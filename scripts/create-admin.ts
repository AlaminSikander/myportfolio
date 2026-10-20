import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminUsers, sessions } from "../src/db/schema";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../src/lib/auth/password";
import { connect } from "./db";

const input = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("ADMIN_EMAIL must be a valid email address.")),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    .max(256, "ADMIN_PASSWORD is too long."),
  name: z.string().trim().max(120).default(""),
});

/**
 * Creates the admin account, or resets its password if it already exists (which also signs out
 * every existing session for that account). Credentials come only from the environment.
 */
async function main() {
  const parsed = input.safeParse({
    email: process.env.ADMIN_EMAIL ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    name: process.env.ADMIN_NAME ?? "",
  });
  if (!parsed.success) {
    console.error("Cannot create the admin account:");
    for (const issue of parsed.error.issues) console.error(`  - ${issue.message}`);
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (for example in .env.local), then run `npm run admin:create`.");
    process.exit(1);
  }

  const { email, password, name } = parsed.data;
  const { db, close } = connect();
  try {
    const passwordHash = await hashPassword(password);
    const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email));
    if (existing) {
      await db
        .update(adminUsers)
        .set({ passwordHash, ...(name ? { name } : {}) })
        .where(eq(adminUsers.id, existing.id));
      await db.delete(sessions).where(eq(sessions.userId, existing.id));
      console.log(`Updated the password for ${email} and signed out its existing sessions.`);
    } else {
      await db.insert(adminUsers).values({ email, passwordHash, name });
      console.log(`Created admin account ${email}.`);
    }
    console.log("Remove ADMIN_PASSWORD from your environment files now that the account exists.");
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error("Failed to create the admin account:", error);
  process.exit(1);
});
