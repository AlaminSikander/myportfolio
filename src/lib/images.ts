/** Local files and Vercel Blob URLs go through the Next.js image optimizer; other hosts are served as-is. */
export function isOptimizableImage(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function absoluteUrl(url: string, base: string) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}
