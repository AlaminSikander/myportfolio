import { NextResponse, type NextRequest } from "next/server";
import { MailerNotConfiguredError, sendContactEmail } from "@/lib/mailer";
import { contactRequestSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_TIME_MS = 3_000;
const MAX_LINKS = 3;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

// Best-effort, per-instance limiter. On serverless platforms each instance keeps its own counts.
const hits = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

function clientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function error(status: number, message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, ...extra }, { status });
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return error(415, "Unsupported request format.");
  }

  if (isRateLimited(clientKey(request))) {
    return error(429, "Too many messages in a short time. Please try again later or email directly.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error(400, "Invalid request body.");
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return error(422, "Please correct the highlighted fields.", { fieldErrors: toFieldErrors(parsed.error) });
  }

  const { website, startedAt, ...message } = parsed.data;

  const elapsed = Date.now() - startedAt;
  const linkCount = (message.message.match(/https?:\/\//gi) ?? []).length;
  if (website || elapsed < MIN_FILL_TIME_MS || linkCount > MAX_LINKS) {
    return error(400, "Your message could not be sent. Please email directly instead.");
  }

  try {
    await sendContactEmail(message);
    return NextResponse.json({ ok: true, message: "Thanks for reaching out — I'll get back to you as soon as I can." });
  } catch (err) {
    if (err instanceof MailerNotConfiguredError) {
      console.error("[contact]", err.message);
      return error(503, "The contact form is not configured yet. Please reach out by email or LinkedIn instead.");
    }
    console.error("[contact] Failed to send email:", err);
    return error(502, "Your message could not be sent right now. Please try again later or email directly.");
  }
}
