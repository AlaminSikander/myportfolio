export type UploadKind = "image" | "icon" | "document";

type FileRule = { mime: string; ext: string; matches: (bytes: Uint8Array) => boolean };

const ascii = (bytes: Uint8Array, start: number, text: string) =>
  [...text].every((char, index) => bytes[start + index] === char.charCodeAt(0));

const JPEG: FileRule = { mime: "image/jpeg", ext: "jpg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff };
const PNG: FileRule = {
  mime: "image/png",
  ext: "png",
  matches: (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => b[index] === value),
};
const WEBP: FileRule = { mime: "image/webp", ext: "webp", matches: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "WEBP") };
const AVIF: FileRule = {
  mime: "image/avif",
  ext: "avif",
  matches: (b) => ascii(b, 4, "ftyp") && (ascii(b, 8, "avif") || ascii(b, 8, "avis")),
};
const ICO: FileRule = {
  mime: "image/x-icon",
  ext: "ico",
  matches: (b) => b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0,
};
const PDF: FileRule = { mime: "application/pdf", ext: "pdf", matches: (b) => ascii(b, 0, "%PDF-") };

export const uploadRules: Record<UploadKind, { maxBytes: number; types: FileRule[]; label: string }> = {
  image: { maxBytes: 5 * 1024 * 1024, types: [JPEG, PNG, WEBP, AVIF], label: "JPEG, PNG, WebP, or AVIF up to 5 MB" },
  icon: { maxBytes: 1024 * 1024, types: [PNG, ICO, WEBP], label: "PNG, ICO, or WebP up to 1 MB" },
  document: { maxBytes: 10 * 1024 * 1024, types: [PDF], label: "PDF up to 10 MB" },
};

export const acceptAttribute: Record<UploadKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif",
  icon: "image/png,image/x-icon,image/vnd.microsoft.icon,image/webp",
  document: "application/pdf",
};

/** Detects the real file type from its first bytes; the browser-provided MIME type is not trusted. */
export function detectFileType(kind: UploadKind, bytes: Uint8Array) {
  return uploadRules[kind].types.find((rule) => rule.matches(bytes)) ?? null;
}
