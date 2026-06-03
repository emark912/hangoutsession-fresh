import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { UNAUTHED_ERR_MSG, NOT_ADMIN_ERR_MSG } from "../../shared/const";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: UNAUTHED_ERR_MSG,
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const user = ctx.user as any;
  if (user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: NOT_ADMIN_ERR_MSG,
    });
  }
  return next();
});
