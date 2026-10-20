import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { adminUsers, getDb, sessions } from "@/db";
import { SESSION_COOKIE, SESSION_COOKIE_SECURE, SESSION_RENEW_AFTER_MS, SESSION_TTL_MS } from "./constants";

export type AdminUser = { id: number; email: string; name: string };
export type AdminSession = { sessionId: string; expiresAt: Date; user: AdminUser };

/** Only the SHA-256 of the token is stored, so a database leak does not expose usable session cookies. */
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: SESSION_COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Must be called from a Server Action or Route Handler (it sets a cookie). */
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const userAgent = (await headers()).get("user-agent")?.slice(0, 255) ?? null;
  const db = getDb();
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt, userAgent });
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  await setSessionCookie(token, expiresAt);
}

/** Reads and validates the session cookie against the database. Safe to call during rendering. */
export async function readSession(): Promise<(AdminSession & { token: string }) | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 128) return null;
  const sessionId = hashToken(token);
  const [row] = await getDb()
    .select({
      expiresAt: sessions.expiresAt,
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
    })
    .from(sessions)
    .innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);
  if (!row) return null;
  return {
    token,
    sessionId,
    expiresAt: row.expiresAt,
    user: { id: row.id, email: row.email, name: row.name },
  };
}

/** Sliding expiry: extends the session once it is past half its lifetime. Server Actions / Route Handlers only. */
export async function renewSession(session: AdminSession & { token: string }) {
  if (session.expiresAt.getTime() - Date.now() > SESSION_TTL_MS - SESSION_RENEW_AFTER_MS) return;
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await getDb().update(sessions).set({ expiresAt }).where(eq(sessions.id, session.sessionId));
  await setSessionCookie(session.token, expiresAt);
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await getDb().delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}
