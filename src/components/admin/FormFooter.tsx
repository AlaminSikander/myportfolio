"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/cn";
import { btn } from "./styles";

export function FormFooter({
  pending,
  dirty,
  cancelHref,
  submitLabel = "Save changes",
  children,
}: {
  pending: boolean;
  dirty: boolean;
  cancelHref?: string;
  submitLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {pending ? "Saving…" : dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {children}
          {cancelHref ? (
            <Link href={cancelHref} className={cn(btn.base, btn.ghost)}>
              Cancel
            </Link>
          ) : null}
          <button type="submit" disabled={pending} className={cn(btn.base, btn.primary)}>
            {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
