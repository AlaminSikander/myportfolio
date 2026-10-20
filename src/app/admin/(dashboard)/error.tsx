"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { btn } from "@/components/admin/styles";
import { cn } from "@/lib/cn";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center" role="alert">
      <span className="grid size-14 place-items-center rounded-2xl bg-ember-50 text-ember-600">
        <AlertTriangle aria-hidden className="size-7" />
      </span>
      <h1 className="mt-5 text-xl font-extrabold">This page could not be loaded</h1>
      <p className="mt-1.5 max-w-md text-sm text-muted">
        {error.message.includes("DATABASE_URL")
          ? "The database is not configured. Set DATABASE_URL and run the migrations (see README)."
          : "A server error occurred. Check that the database is reachable, then try again."}
        {error.digest ? <span className="mt-2 block text-xs text-subtle">Reference: {error.digest}</span> : null}
      </p>
      <button type="button" onClick={reset} className={cn(btn.base, btn.dark, "mt-6")}>
        <RotateCcw aria-hidden className="size-4" />
        Try again
      </button>
    </div>
  );
}
