"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { FileText, ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/cn";
import { isOptimizableImage } from "@/lib/images";
import { acceptAttribute, uploadRules, type UploadKind } from "@/lib/uploads";
import { btn, inputClass } from "./styles";

type UploadResponse = { ok: true; url: string } | { ok: false; message: string };

export async function uploadFile(kind: UploadKind, file: File): Promise<UploadResponse> {
  const rule = uploadRules[kind];
  if (file.size > rule.maxBytes) return { ok: false, message: `File is too large. Allowed: ${rule.label}.` };
  const body = new FormData();
  body.append("kind", kind);
  body.append("file", file);
  try {
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json().catch(() => null)) as UploadResponse | null;
    if (!response.ok || !data) return { ok: false, message: data && !data.ok ? data.message : "Upload failed." };
    return data;
  } catch {
    return { ok: false, message: "Upload failed. Check your connection and try again." };
  }
}

/**
 * Upload (or paste a URL for) a single image or document, with validation, progress and preview.
 */
export function FileUpload({
  label,
  kind = "image",
  value,
  onChange,
  error,
  hint,
  aspect = "aspect-[16/9]",
}: {
  label: string;
  kind?: UploadKind;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
  aspect?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const result = await uploadFile(kind, file);
    setUploading(false);
    if (result.ok) onChange(result.url);
    else setUploadError(result.message);
    if (inputRef.current) inputRef.current.value = "";
  };

  const message = uploadError || error;
  const isDocument = kind === "document";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span id={`${id}-label`} className="text-sm font-semibold text-ink-900">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setShowUrl((value) => !value)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink-900"
          aria-expanded={showUrl}
        >
          <Link2 aria-hidden className="size-3.5" />
          {showUrl ? "Hide URL" : "Use a URL"}
        </button>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {isDocument ? (
            <div className="flex items-center gap-3 p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-ember-50 text-ember-600">
                <FileText aria-hidden className="size-5" />
              </span>
              <a href={value} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900 underline-offset-2 hover:underline">
                {value.split("/").pop()}
              </a>
            </div>
          ) : (
            <div className={cn("relative bg-canvas", kind === "icon" ? "aspect-square w-24" : aspect)}>
              <Image
                src={value}
                alt=""
                fill
                sizes="480px"
                unoptimized={!isOptimizableImage(value)}
                className="object-contain"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 border-t border-line p-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={cn(btn.base, btn.ghost, "min-h-9")}
              disabled={uploading}
            >
              {uploading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Upload aria-hidden className="size-4" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className={cn(btn.base, btn.ghost, "min-h-9 hover:text-ember-700")}
              disabled={uploading}
            >
              <Trash2 aria-hidden className="size-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFile(event.dataTransfer.files[0]);
          }}
          disabled={uploading}
          aria-describedby={`${id}-rules`}
          aria-labelledby={`${id}-label`}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging ? "border-ember-500 bg-ember-50" : "border-line-strong bg-white hover:border-ink-600",
            message && "border-ember-600",
          )}
        >
          {uploading ? (
            <Loader2 aria-hidden className="size-7 animate-spin text-ember-600" />
          ) : isDocument ? (
            <FileText aria-hidden className="size-7 text-subtle" />
          ) : (
            <ImagePlus aria-hidden className="size-7 text-subtle" />
          )}
          <span className="text-sm font-semibold text-ink-900">
            {uploading ? "Uploading…" : "Click to upload or drag a file here"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttribute[kind]}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />

      {showUrl ? (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… or /images/…"
          aria-label={`${label} URL`}
          className={cn(inputClass, "mt-2")}
        />
      ) : null}

      <p id={`${id}-rules`} className="mt-1.5 text-xs text-muted">
        {hint ? `${hint} ` : ""}
        {uploadRules[kind].label}.
      </p>
      {message ? (
        <p role="alert" className="mt-1 text-xs font-semibold text-ember-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
