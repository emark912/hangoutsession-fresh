import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

const poolConnection = mysql.createPool({
  host: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hangoutsession",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema });

// Query helpers
export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  return user;
}

export async function getHangoutById(id: string) {
  const hangout = await db.query.hangoutSessions.findFirst({
    where: (hangouts, { eq }) => eq(hangouts.id, id),
    with: {
      host: true,
    },
  });
  return hangout;
}

export async function getBookingById(id: string) {
  const booking = await db.query.bookings.findFirst({
    where: (bookings, { eq }) => eq(bookings.id, id),
    with: {
      hangout: true,
      guest: true,
      host: true,
    },
  });
  return booking;
}
