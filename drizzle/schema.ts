import { mysqlTable, varchar, text, int, decimal, timestamp, enum as mysqlEnum, json, boolean, date, time, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Users table
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    profilePictureUrl: varchar("profile_picture_url", { length: 255 }),
    bio: text("bio"),
    phone: varchar("phone", { length: 20 }),
    locationCity: varchar("location_city", { length: 100 }),
    locationState: varchar("location_state", { length: 100 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user"),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
    reviewCount: int("review_count").default(0),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    oauthProvider: varchar("oauth_provider", { length: 50 }),
    oauthId: varchar("oauth_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
    roleIdx: index("role_idx").on(table.role),
  })
);

// Hangout Sessions table
export const hangoutSessions = mysqlTable(
  "hangout_sessions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    hostId: varchar("host_id", { length: 36 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    locationCity: varchar("location_city", { length: 100 }).notNull(),
    locationState: varchar("location_state", { length: 100 }).notNull(),
    locationExactAddress: text("location_exact_address").notNull(),
    locationLat: decimal("location_lat", { precision: 10, scale: 8 }),
    locationLng: decimal("location_lng", { precision: 11, scale: 8 }),
    pricePerGuest: decimal("price_per_guest", { precision: 10, scale: 2 }).notNull(),
    durationHours: int("duration_hours").notNull(),
    maxGuests: int("max_guests").notNull(),
    images: json("images"),
    accommodations: json("accommodations"),
    requirements: text("requirements"),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
    reviewCount: int("review_count").default(0),
    status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    hostIdIdx: index("host_id_idx").on(table.hostId),
    statusIdx: index("status_idx").on(table.status),
    categoryIdx: index("category_idx").on(table.category),
  })
);

// Bookings table
export const bookings = mysqlTable(
  "bookings",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    hangoutId: varchar("hangout_id", { length: 36 }).notNull(),
    guestId: varchar("guest_id", { length: 36 }).notNull(),
    hostId: varchar("host_id", { length: 36 }).notNull(),
    status: mysqlEnum("status", ["requested", "confirmed", "completed", "cancelled"]).default("requested"),
    guestCount: int("guest_count").notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
    hostEarnings: decimal("host_earnings", { precision: 10, scale: 2 }).notNull(),
    paymentIntentId: varchar("payment_intent_id", { length: 255 }),
    scheduledDate: date("scheduled_date").notNull(),
    scheduledTime: time("scheduled_time").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    hangoutIdIdx: index("hangout_id_idx").on(table.hangoutId),
    guestIdIdx: index("guest_id_idx").on(table.guestId),
    hostIdIdx: index("host_id_idx").on(table.hostId),
    statusIdx: index("booking_status_idx").on(table.status),
  })
);

// Messages table
export const messages = mysqlTable(
  "messages",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    senderId: varchar("sender_id", { length: 36 }).notNull(),
    receiverId: varchar("receiver_id", { length: 36 }).notNull(),
    bookingId: varchar("booking_id", { length: 36 }),
    content: text("content").notNull(),
    read: boolean("read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    senderIdIdx: index("sender_id_idx").on(table.senderId),
    receiverIdIdx: index("receiver_id_idx").on(table.receiverId),
    bookingIdIdx: index("booking_id_idx").on(table.bookingId),
  })
);

// Reviews table
export const reviews = mysqlTable(
  "reviews",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    bookingId: varchar("booking_id", { length: 36 }).notNull(),
    reviewerId: varchar("reviewer_id", { length: 36 }).notNull(),
    revieweeId: varchar("reviewee_id", { length: 36 }).notNull(),
    rating: int("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    bookingIdIdx: index("review_booking_id_idx").on(table.bookingId),
    reviewerIdIdx: index("reviewer_id_idx").on(table.reviewerId),
    revieweeIdIdx: index("reviewee_id_idx").on(table.revieweeId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  hostedHangouts: many(hangoutSessions),
  guestBookings: many(bookings, { relationName: "guestBookings" }),
  hostBookings: many(bookings, { relationName: "hostBookings" }),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  givenReviews: many(reviews, { relationName: "givenReviews" }),
  receivedReviews: many(reviews, { relationName: "receivedReviews" }),
}));

export const hangoutSessionsRelations = relations(hangoutSessions, ({ one, many }) => ({
  host: one(users, { fields: [hangoutSessions.hostId], references: [users.id] }),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  hangout: one(hangoutSessions, { fields: [bookings.hangoutId], references: [hangoutSessions.id] }),
  guest: one(users, { fields: [bookings.guestId], references: [users.id], relationName: "guestBookings" }),
  host: one(users, { fields: [bookings.hostId], references: [users.id], relationName: "hostBookings" }),
  messages: many(messages),
  review: one(reviews),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sentMessages" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receivedMessages" }),
  booking: one(bookings, { fields: [messages.bookingId], references: [bookings.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
  reviewer: one(users, { fields: [reviews.reviewerId], references: [users.id], relationName: "givenReviews" }),
  reviewee: one(users, { fields: [reviews.revieweeId], references: [users.id], relationName: "receivedReviews" }),
}));
