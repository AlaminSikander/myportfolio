"use client";

import { useId, useRef, useState } from "react";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Loader2, Quote } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/cn";
import { acceptAttribute } from "@/lib/uploads";
import { uploadFile } from "./FileUpload";
import { btn, textareaClass } from "./styles";

type Edit = { before: string; after?: string; placeholder: string; block?: boolean };

const tools: { label: string; icon: typeof Bold; edit: Edit }[] = [
  { label: "Heading", icon: Heading2, edit: { before: "## ", placeholder: "Heading", block: true } },
  { label: "Subheading", icon: Heading3, edit: { before: "### ", placeholder: "Subheading", block: true } },
  { label: "Bold", icon: Bold, edit: { before: "**", after: "**", placeholder: "bold text" } },
  { label: "Italic", icon: Italic, edit: { before: "_", after: "_", placeholder: "italic text" } },
  { label: "Link", icon: Link2, edit: { before: "[", after: "](https://)", placeholder: "link text" } },
  { label: "Bulleted list", icon: List, edit: { before: "- ", placeholder: "List item", block: true } },
  { label: "Numbered list", icon: ListOrdered, edit: { before: "1. ", placeholder: "List item", block: true } },
  { label: "Quote", icon: Quote, edit: { before: "> ", placeholder: "Quote", block: true } },
  { label: "Code", icon: Code, edit: { before: "`", after: "`", placeholder: "code" } },
];

export function MarkdownEditor({
  label,
  value,
  onChange,
  error,
  required,
  rows = 18,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const insert = ({ before, after = "", placeholder, block }: Edit) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = value.slice(start, end) || placeholder;
    const needsNewline = block && start > 0 && value[start - 1] !== "\n";
    const prefix = `${needsNewline ? "\n" : ""}${before}`;
    const next = `${value.slice(0, start)}${prefix}${selected}${after}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  const insertImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const result = await uploadFile("image", file);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (!result.ok) {
      setUploadError(result.message);
      return;
    }
    insert({ before: "![", after: `](${result.url})`, placeholder: "Describe the image", block: true });
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink-900">
          {label}
          {required ? <span className="text-ember-600" aria-hidden> *</span> : null}
        </label>
        <span className="text-xs text-subtle tabular-nums">{words} words</span>
      </div>
      <div className={cn("overflow-hidden rounded-2xl border bg-white", error ? "border-ember-600" : "border-line-strong")}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-canvas/60 px-2 py-1.5">
          <div role="tablist" aria-label="Editor mode" className="flex gap-1">
            {(["write", "preview"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={tab === mode}
                onClick={() => setTab(mode)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                  tab === mode ? "bg-white text-ink-950 shadow-soft" : "text-muted hover:text-ink-950",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          {tab === "write" ? (
            <div role="toolbar" aria-label="Formatting" className="flex flex-wrap">
              {tools.map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => insert(tool.edit)}
                  className={btn.icon}
                  aria-label={tool.label}
                  title={tool.label}
                >
                  <tool.icon aria-hidden className="size-4" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={btn.icon}
                aria-label="Insert image"
                title="Insert image"
                disabled={uploading}
              >
                {uploading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <ImagePlus aria-hidden className="size-4" />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept={acceptAttribute.image}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(event) => void insertImage(event.target.files?.[0])}
              />
            </div>
          ) : null}
        </div>
        {tab === "write" ? (
          <textarea
            ref={textareaRef}
            id={id}
            rows={rows}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error ? true : undefined}
            className={cn(textareaClass, "rounded-none border-0 font-mono text-[0.85rem] focus-visible:ring-0")}
            placeholder="Write in Markdown. Use ## for section headings, - for bullet points, and [text](https://…) for links."
          />
        ) : (
          <div className="max-h-[36rem] min-h-64 overflow-y-auto p-5 sm:p-7">
            {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
      {uploadError ? <p role="alert" className="mt-1.5 text-xs font-semibold text-ember-700">{uploadError}</p> : null}
      {error ? <p className="mt-1.5 text-xs font-semibold text-ember-700">{error}</p> : null}
    </div>
  );
}
