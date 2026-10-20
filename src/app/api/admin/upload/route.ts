import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { authorizeAdminRequest, UnauthorizedError } from "@/lib/auth/dal";
import { detectFileType, uploadRules, type UploadKind } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const kinds = new Set<UploadKind>(["image", "icon", "document"]);

function fail(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Rejects cross-site requests: the Origin header must match the host serving this request. */
function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function safeBaseName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  return base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return fail(403, "Cross-site upload rejected.");

  try {
    await authorizeAdminRequest();
  } catch (error) {
    if (error instanceof UnauthorizedError) return fail(401, error.message);
    throw error;
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "Invalid upload request.");
  }

  const kind = form.get("kind");
  const file = form.get("file");
  if (typeof kind !== "string" || !kinds.has(kind as UploadKind)) return fail(400, "Unknown upload type.");
  if (!(file instanceof File) || file.size === 0) return fail(400, "Choose a file to upload.");

  const rule = uploadRules[kind as UploadKind];
  if (file.size > rule.maxBytes) return fail(413, `File is too large. Allowed: ${rule.label}.`);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectFileType(kind as UploadKind, bytes);
  if (!type) return fail(415, `Unsupported file type. Allowed: ${rule.label}.`);

  const folder = kind === "document" ? "documents" : "images";
  const name = `${safeBaseName(file.name)}.${type.ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`${folder}/${name}`, Buffer.from(bytes), {
        access: "public",
        addRandomSuffix: true,
        contentType: type.mime,
      });
      return NextResponse.json({ ok: true, url: blob.url, contentType: type.mime, size: file.size });
    } catch (error) {
      console.error("[upload] Blob upload failed:", error);
      return fail(502, "The file could not be stored. Please try again.");
    }
  }

  if (process.env.NODE_ENV === "production") {
    return fail(503, "File storage is not configured (BLOB_READ_WRITE_TOKEN is missing).");
  }

  // Development-only fallback so uploads can be tried without a Blob store; files are not deployed.
  const fileName = `${safeBaseName(file.name)}-${randomBytes(6).toString("hex")}.${type.ext}`;
  const directory = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), bytes);
  return NextResponse.json({ ok: true, url: `/uploads/${folder}/${fileName}`, contentType: type.mime, size: file.size });
}
