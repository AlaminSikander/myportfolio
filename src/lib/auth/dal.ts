import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isDatabaseConfigured } from "@/db";
import { LOGIN_PATH } from "./constants";
import { readSession, renewSession, type AdminUser } from "./session";

export class UnauthorizedError extends Error {
  constructor() {
    super("You must be signed in as an admin to do that.");
    this.name = "UnauthorizedError";
  }
}

export const getCurrentSession = cache(async () => {
  if (!isDatabaseConfigured()) return null;
  return readSession();
});

/** For admin pages and layouts: redirects to the login page when there is no valid session. */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await getCurrentSession();
  if (!session) redirect(LOGIN_PATH);
  return session.user;
}

/**
 * For Server Actions and Route Handlers. Every write path calls this first; it is the actual
 * security boundary (the proxy redirect is only a convenience).
 */
export async function authorizeAdminRequest(): Promise<AdminUser> {
  const session = await getCurrentSession();
  if (!session) throw new UnauthorizedError();
  await renewSession(session);
  return session.user;
}
