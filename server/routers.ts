import { router, publicProcedure, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { hashPassword, verifyPassword, createAuthToken } from "./_core/auth";
import { getUserByEmail, getUserById, getHangoutById, getBookingById } from "./db";
import { db } from "./db";
import { users, hangoutSessions, bookings, messages, reviews } from "../drizzle/schema";
import { eq, and, desc, like, gte, lte } from "drizzle-orm";
import { sendEmail, emailTemplates } from "./_core/email";
import { createCheckoutSession } from "./_core/stripe";
import { PLATFORM_COMMISSION_RATE, HOST_EARNINGS_RATE } from "../shared/const";

export const appRouter = router({
  // Auth procedures
  auth: router({
    signup: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(6), name: z.string() }))
      .mutation(async ({ input }) => {
        const existing = await getUserByEmail(input.email);
        if (existing) throw new Error("Email already registered");

        const userId = uuid();
        const passwordHash = await hashPassword(input.password);

        await db.insert(users).values({
          id: userId,
          email: input.email,
          passwordHash,
          name: input.name,
          role: "user",
        });

        await sendEmail({
          to: input.email,
          ...emailTemplates.welcomeEmail(input.name),
        });

        const token = await createAuthToken(userId);
        return { userId, token };
      }),

    signin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input }) => {
        const user = await getUserByEmail(input.email);
        if (!user) throw new Error("Invalid credentials");

        const valid = await verifyPassword(input.password, user.passwordHash || "");
        if (!valid) throw new Error("Invalid credentials");

        const token = await createAuthToken(user.id);
        return { userId: user.id, token, user };
      }),

    me: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user!.userId);
      return user;
    }),
  }),

  // Hangout procedures
  hangouts: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          category: z.string(),
          locationCity: z.string(),
          locationState: z.string(),
          locationExactAddress: z.string(),
          pricePerGuest: z.number(),
          durationHours: z.number(),
          maxGuests: z.number(),
          images: z.array(z.string()).optional(),
          accommodations: z.array(z.string()).optional(),
          requirements: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const hangoutId = uuid();
        await db.insert(hangoutSessions).values({
          id: hangoutId,
          hostId: ctx.user!.userId,
          ...input,
          status: "draft",
        });
        return { id: hangoutId };
      }),

    browse: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          city: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          minRating: z.number().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        let query = db.query.hangoutSessions.findMany({
          where: (h, { eq, and, gte, lte, like }) => {
            const conditions = [eq(h.status, "published")];
            if (input.category) conditions.push(like(h.category, `%${input.category}%`));
            if (input.city) conditions.push(like(h.locationCity, `%${input.city}%`));
            if (input.minPrice) conditions.push(gte(h.pricePerGuest, input.minPrice));
            if (input.maxPrice) conditions.push(lte(h.pricePerGuest, input.maxPrice));
            if (input.minRating) conditions.push(gte(h.averageRating, input.minRating));
            return and(...conditions);
          },
          limit: input.limit,
          offset: input.offset,
          with: { host: true },
        });
        return query;
      }),

    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      return getHangoutById(input.id);
    }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          pricePerGuest: z.number().optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const hangout = await getHangoutById(input.id);
        if (hangout?.hostId !== ctx.user!.userId) throw new Error("Unauthorized");

        await db.update(hangoutSessions).set(input).where(eq(hangoutSessions.id, input.id));
        return { success: true };
      }),

    getByHost: protectedProcedure.query(async ({ ctx }) => {
      return db.query.hangoutSessions.findMany({
        where: (h) => eq(h.hostId, ctx.user!.userId),
      });
    }),
  }),

  // Booking procedures
  bookings: router({
    create: protectedProcedure
      .input(
        z.object({
          hangoutId: z.string(),
          guestCount: z.number(),
          scheduledDate: z.string(),
          scheduledTime: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const hangout = await getHangoutById(input.hangoutId);
        if (!hangout) throw new Error("Hangout not found");

        const totalPrice = hangout.pricePerGuest * input.guestCount;
        const platformFee = totalPrice * PLATFORM_COMMISSION_RATE;
        const hostEarnings = totalPrice * HOST_EARNINGS_RATE;

        const bookingId = uuid();
        await db.insert(bookings).values({
          id: bookingId,
          hangoutId: input.hangoutId,
          guestId: ctx.user!.userId,
          hostId: hangout.hostId,
          status: "requested",
          guestCount: input.guestCount,
          totalPrice,
          platformFee,
          hostEarnings,
          scheduledDate: new Date(input.scheduledDate),
          scheduledTime: input.scheduledTime,
        });

        // Send notifications
        const guest = await getUserById(ctx.user!.userId);
        await sendEmail({
          to: hangout.host.email,
          ...emailTemplates.bookingRequest(hangout.host.name, guest?.name || "Guest", hangout.title),
        });

        return { id: bookingId, totalPrice };
      }),

    checkout: protectedProcedure
      .input(z.object({ bookingId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const booking = await getBookingById(input.bookingId);
        if (!booking) throw new Error("Booking not found");
        if (booking.guestId !== ctx.user!.userId) throw new Error("Unauthorized");

        const session = await createCheckoutSession(
          booking.hangoutId,
          booking.guestId,
          booking.hostId,
          booking.guestCount,
          booking.totalPrice,
          booking.platformFee,
          booking.hostEarnings,
          booking.scheduledDate.toISOString(),
          booking.scheduledTime
        );

        return { checkoutUrl: session.url };
      }),

    getByGuest: protectedProcedure.query(async ({ ctx }) => {
      return db.query.bookings.findMany({
        where: (b) => eq(b.guestId, ctx.user!.userId),
        with: { hangout: true, host: true },
      });
    }),

    getByHost: protectedProcedure.query(async ({ ctx }) => {
      return db.query.bookings.findMany({
        where: (b) => eq(b.hostId, ctx.user!.userId),
        with: { hangout: true, guest: true },
      });
    }),

    accept: protectedProcedure
      .input(z.object({ bookingId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const booking = await getBookingById(input.bookingId);
        if (!booking) throw new Error("Booking not found");
        if (booking.hostId !== ctx.user!.userId) throw new Error("Unauthorized");

        await db.update(bookings).set({ status: "confirmed" }).where(eq(bookings.id, input.bookingId));

        await sendEmail({
          to: booking.guest.email,
          ...emailTemplates.bookingConfirmation(ctx.user!.userId, booking.guest.name, booking.hangout.title, booking.scheduledDate.toDateString()),
        });

        return { success: true };
      }),
  }),

  // Messaging procedures
  messages: router({
    send: protectedProcedure
      .input(z.object({ receiverId: z.string(), bookingId: z.string().optional(), content: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const messageId = uuid();
        await db.insert(messages).values({
          id: messageId,
          senderId: ctx.user!.userId,
          receiverId: input.receiverId,
          bookingId: input.bookingId,
          content: input.content,
          read: false,
        });
        return { id: messageId };
      }),

    getThread: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input, ctx }) => {
        return db.query.messages.findMany({
          where: (m) =>
            or(
              and(eq(m.senderId, ctx.user!.userId), eq(m.receiverId, input.userId)),
              and(eq(m.senderId, input.userId), eq(m.receiverId, ctx.user!.userId))
            ),
          orderBy: (m) => desc(m.createdAt),
        });
      }),
  }),

  // Review procedures
  reviews: router({
    create: protectedProcedure
      .input(z.object({ bookingId: z.string(), rating: z.number().min(1).max(5), comment: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const booking = await getBookingById(input.bookingId);
        if (!booking) throw new Error("Booking not found");
        if (booking.guestId !== ctx.user!.userId) throw new Error("Unauthorized");

        const reviewId = uuid();
        await db.insert(reviews).values({
          id: reviewId,
          bookingId: input.bookingId,
          reviewerId: ctx.user!.userId,
          revieweeId: booking.hostId,
          rating: input.rating,
          comment: input.comment,
        });

        return { id: reviewId };
      }),

    getByUser: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
      return db.query.reviews.findMany({
        where: (r) => eq(r.revieweeId, input.userId),
      });
    }),
  }),

  // User procedures
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return getUserById(ctx.user!.userId);
    }),

    updateProfile: protectedProcedure
      .input(z.object({ name: z.string().optional(), bio: z.string().optional(), phone: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        await db.update(users).set(input).where(eq(users.id, ctx.user!.userId));
        return { success: true };
      }),
  }),

  // Admin procedures
  admin: router({
    getUsers: adminProcedure.query(async () => {
      return db.query.users.findMany();
    }),

    suspendUser: adminProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        // Implementation for suspending user
        return { success: true };
      }),

    getHangouts: adminProcedure.query(async () => {
      return db.query.hangoutSessions.findMany();
    }),

    removeHangout: adminProcedure
      .input(z.object({ hangoutId: z.string() }))
      .mutation(async ({ input }) => {
        await db.update(hangoutSessions).set({ status: "archived" }).where(eq(hangoutSessions.id, input.hangoutId));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
