"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { btn } from "./styles";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "default";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Native <dialog>: focus trapping, Escape to close, and inert background come from the browser. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !pending) onCancel();
      }}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-description"
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-panel bg-white p-0 shadow-lift backdrop:bg-ink-950/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-7">
        <div className="flex gap-4">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl",
              tone === "danger" ? "bg-ember-50 text-ember-600" : "bg-azure-50 text-azure-600",
            )}
          >
            <AlertTriangle aria-hidden className="size-5" />
          </span>
          <div>
            <h2 id="confirm-title" className="text-lg font-extrabold">
              {title}
            </h2>
            <div id="confirm-description" className="mt-1.5 text-sm leading-relaxed text-muted">
              {description}
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={pending} className={cn(btn.base, btn.secondary)} autoFocus>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(btn.base, tone === "danger" ? btn.danger : btn.dark)}
          >
            {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
