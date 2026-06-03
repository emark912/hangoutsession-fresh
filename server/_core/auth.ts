import { SignJWT, jwtVerify } from "jose";
import { hash, compare } from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

export async function createAuthToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
  return token;
}

export async function verifyAuth(token: string): Promise<{ userId: string } | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: string };
  } catch (error) {
    return null;
  }
}
