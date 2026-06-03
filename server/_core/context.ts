import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Request, Response } from "express";
import { verifyAuth } from "./auth";
import { db } from "../db";

interface ContextOptions {
  req?: Request;
  res?: Response;
}

export async function createContext(opts: ContextOptions) {
  const token = opts.req?.cookies?.["auth-token"];
  let user = null;

  if (token) {
    try {
      user = await verifyAuth(token);
    } catch (error) {
      console.error("Auth verification failed:", error);
    }
  }

  return {
    user,
    db,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
