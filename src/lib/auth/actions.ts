"use server";

import { randomBytes } from "node:crypto";
import { and, count, eq, gt, inArray, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminUsers, getDb, isDatabaseConfigured, loginAttempts } from "@/db";
import { LOGIN_LOCKOUT, LOGIN_PATH } from "./constants";
import { hashPassword, verifyPassword } from "./password";
import { createSession, deleteSession } from "./session";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password.").max(256),
});

let dummyHash: Promise<string> | undefined;
/** Verifying against a throwaway hash keeps response time the same whether or not the email exists. */
function getDummyHash() {
  dummyHash ??= hashPassword(randomBytes(16).toString("hex"));
  return dummyHash;
}

function clientIp(requestHeaders: Headers) {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown"
  );
}

function safeRedirectTarget(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) return "/admin";
  try {
    const url = new URL(value, "http://local.invalid");
    if (url.origin !== "http://local.invalid" || !url.pathname.startsWith("/admin")) return "/admin";
    if (url.pathname.startsWith(LOGIN_PATH)) return "/admin";
    return `${url.pathname}${url.search}`;
  } catch {
    return "/admin";
  }
}

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isDatabaseConfigured()) {
    return { error: "The database is not configured yet, so sign-in is unavailable. See the README setup steps." };
  }

  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const typedEmail = typeof formData.get("email") === "string" ? String(formData.get("email")).slice(0, 254) : "";
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter your email and password.", email: typedEmail };
  }

  const { email, password } = parsed.data;
  const db = getDb();
  const keys = [`ip:${clientIp(await headers())}`, `email:${email}`];
  const windowStart = new Date(Date.now() - LOGIN_LOCKOUT.windowMs);

  const recent = await db
    .select({ key: loginAttempts.key, value: count() })
    .from(loginAttempts)
    .where(and(inArray(loginAttempts.key, keys), gt(loginAttempts.createdAt, windowStart)))
    .groupBy(loginAttempts.key);
  if (recent.some((row) => row.value >= LOGIN_LOCKOUT.maxAttempts)) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again.", email };
  }

  const [user] = await db
    .select({ id: adminUsers.id, passwordHash: adminUsers.passwordHash })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  const valid = user
    ? await verifyPassword(password, user.passwordHash)
    : (await verifyPassword(password, await getDummyHash()), false);

  if (!user || !valid) {
    await db.insert(loginAttempts).values(keys.map((key) => ({ key })));
    return { error: "Incorrect email or password.", email };
  }

  await db.delete(loginAttempts).where(inArray(loginAttempts.key, keys));
  await db.delete(loginAttempts).where(lt(loginAttempts.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
  await createSession(user.id);

  redirect(safeRedirectTarget(formData.get("next")));
}

export async function logout() {
  if (isDatabaseConfigured()) await deleteSession();
  redirect(LOGIN_PATH);
}
