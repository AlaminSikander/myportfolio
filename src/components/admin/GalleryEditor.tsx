"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { isOptimizableImage } from "@/lib/images";
import { acceptAttribute, uploadRules } from "@/lib/uploads";
import { uploadFile } from "./FileUpload";
import { btn, inputClass } from "./styles";

type GalleryImage = { url: string; alt: string };

export function GalleryEditor({
  images,
  onChange,
  errors,
  max = 12,
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  errors: Record<string, string>;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = Math.max(0, max - images.length);
    const selected = Array.from(files).slice(0, room);
    setUploadError(files.length > room ? `Only ${max} images are allowed; extra files were skipped.` : "");
    setUploading(selected.length);
    const results = await Promise.all(selected.map((file) => uploadFile("image", file)));
    setUploading(0);
    const added = results.flatMap((result) => (result.ok ? [{ url: result.url, alt: "" }] : []));
    const failed = results.find((result) => !result.ok);
    if (failed && !failed.ok) setUploadError(failed.message);
    if (added.length) onChange([...images, ...added]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const update = (index: number, patch: Partial<GalleryImage>) =>
    onChange(images.map((image, i) => (i === index ? { ...image, ...patch } : image)));

  const move = (index: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-ink-900">Gallery</legend>
      {images.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-video bg-canvas">
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="360px"
                  unoptimized={!isOptimizableImage(image.url)}
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-3">
                <input
                  value={image.alt}
                  onChange={(event) => update(index, { alt: event.target.value })}
                  placeholder="Describe this image (alt text)"
                  aria-label={`Alt text for gallery image ${index + 1}`}
                  aria-invalid={errors[`gallery.${index}.alt`] ? true : undefined}
                  className={inputClass}
                />
                {errors[`gallery.${index}.alt`] ? (
                  <p className="text-xs font-semibold text-ember-700">{errors[`gallery.${index}.alt`]}</p>
                ) : null}
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <button type="button" className={btn.icon} onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={`Move image ${index + 1} earlier`}>
                      <ArrowLeft aria-hidden className="size-4" />
                    </button>
                    <button type="button" className={btn.icon} onClick={() => move(index, index + 1)} disabled={index === images.length - 1} aria-label={`Move image ${index + 1} later`}>
                      <ArrowRight aria-hidden className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className={cn(btn.icon, "hover:text-ember-700")}
                    onClick={() => onChange(images.filter((_, i) => i !== index))}
                    aria-label={`Remove gallery image ${index + 1}`}
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">No gallery images yet.</p>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading > 0 || images.length >= max}
        className={cn(btn.base, btn.secondary, "mt-3")}
      >
        {uploading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <ImagePlus aria-hidden className="size-4" />}
        {uploading ? `Uploading ${uploading}…` : "Add images"}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptAttribute.image}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => void addFiles(event.target.files)}
      />
      <p className="mt-1.5 text-xs text-muted">
        Up to {max} images. {uploadRules.image.label} each.
      </p>
      {uploadError ? (
        <p role="alert" className="mt-1 text-xs font-semibold text-ember-700">
          {uploadError}
        </p>
      ) : null}
    </fieldset>
  );
}
