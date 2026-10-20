"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Star, Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/admin/action";
import { cn } from "@/lib/cn";
import { ConfirmDialog } from "./ConfirmDialog";
import { btn } from "./styles";
import { useToast } from "./Toast";

/** Icons are passed by name because component functions can't cross the server/client boundary. */
const icons = {
  trash: Trash2,
  eye: Eye,
  "eye-off": EyeOff,
  star: Star,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
};

type ActionButtonProps = {
  action: () => Promise<ActionResult<unknown>>;
  label: string;
  icon?: keyof typeof icons;
  /** Show only the icon (label becomes the accessible name). */
  iconOnly?: boolean;
  variant?: keyof typeof btn;
  confirm?: { title: string; description: ReactNode; confirmLabel?: string; tone?: "danger" | "default" };
  redirectTo?: string;
  disabled?: boolean;
  className?: string;
};

/** Runs a Server Action with optional confirmation, pending state, and toast feedback. */
export function ActionButton({
  action,
  label,
  icon,
  iconOnly = false,
  variant = "secondary",
  confirm,
  redirectTo,
  disabled,
  className,
}: ActionButtonProps) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const run = () =>
    startTransition(async () => {
      const result = await action();
      setConfirmOpen(false);
      toast(result.ok ? "success" : "error", result.message);
      if (result.ok) {
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }
    });

  const Icon = icon ? icons[icon] : null;
  const iconNode = pending ? (
    <Loader2 aria-hidden className="size-4 animate-spin" />
  ) : Icon ? (
    <Icon aria-hidden className="size-4" />
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => (confirm ? setConfirmOpen(true) : run())}
        disabled={pending || disabled}
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        className={cn(iconOnly ? btn.icon : cn(btn.base, btn[variant]), className)}
      >
        {iconNode}
        {iconOnly ? null : label}
      </button>
      {confirm ? (
        <ConfirmDialog
          open={confirmOpen}
          title={confirm.title}
          description={confirm.description}
          confirmLabel={confirm.confirmLabel}
          tone={confirm.tone}
          pending={pending}
          onConfirm={run}
          onCancel={() => setConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}
