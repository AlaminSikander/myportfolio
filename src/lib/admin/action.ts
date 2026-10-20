import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DatabaseNotConfiguredError } from "@/db";
import { authorizeAdminRequest, UnauthorizedError } from "@/lib/auth/dal";
import type { AdminUser } from "@/lib/auth/session";
import { toFieldErrors, type FieldErrors } from "@/lib/validation/admin";

export type ActionResult<T = undefined> =
  | { ok: true; message: string; data?: T }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

export class ActionError extends Error {
  constructor(
    message: string,
    public fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = "ActionError";
  }
}

export const idSchema = z.number().int().positive();
export const statusSchema = z.enum(["draft", "published"]);

function postgresCode(error: unknown): string | undefined {
  let current: unknown = error;
  for (let depth = 0; current && depth < 4; depth += 1) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string") return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

/**
 * Wraps every admin Server Action: authorizes the session first, then runs the mutation,
 * maps validation and database errors to friendly messages, and refreshes public pages.
 */
export async function adminAction<T = undefined>(
  run: (user: AdminUser) => Promise<{ message: string; data?: T }>,
  options: { revalidate?: boolean } = {},
): Promise<ActionResult<T>> {
  try {
    const user = await authorizeAdminRequest();
    const result = await run(user);
    if (options.revalidate !== false) revalidatePath("/", "layout");
    return { ok: true, ...result };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, message: "Your session has expired. Please sign in again." };
    if (error instanceof DatabaseNotConfiguredError) return { ok: false, message: error.message };
    if (error instanceof ActionError) return { ok: false, message: error.message, fieldErrors: error.fieldErrors };
    if (error instanceof z.ZodError) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: toFieldErrors(error) };
    }
    if (postgresCode(error) === "23505") {
      return {
        ok: false,
        message: "That slug is already used by another item.",
        fieldErrors: { slug: "This slug is already in use. Choose a different one." },
      };
    }
    console.error("[admin action]", error);
    return { ok: false, message: "Something went wrong while saving. Please try again." };
  }
}

export function parseOrThrow<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw parsed.error;
  return parsed.data;
}
