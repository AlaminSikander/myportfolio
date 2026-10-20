"use client";

import { useCallback, useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/admin/action";
import type { FieldErrors } from "@/lib/validation/admin";
import { useToast } from "./Toast";
import { useUnsavedChanges } from "./useUnsavedChanges";

type SaveResult = ActionResult<{ id: number } | undefined>;

/**
 * Form state for admin editors: tracks values, server-side field errors, pending state and
 * unsaved changes. Validation happens on the server (the Zod schemas are shared with the client).
 */
export function useAdminForm<T extends Record<string, unknown>>({
  initial,
  save,
  redirectTo,
}: {
  initial: T;
  save: (values: T) => Promise<SaveResult>;
  /** Where to go after a successful create; receives the new id. */
  redirectTo?: (id: number | undefined) => string | undefined;
}) {
  const [values, setValues] = useState<T>(initial);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const dirty = useMemo(() => JSON.stringify(values) !== saved, [values, saved]);
  useUnsavedChanges(dirty && !pending);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key as string]) return current;
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }, []);

  const submit = useCallback(
    (event?: FormEvent, override?: Partial<T>) => {
      event?.preventDefault();
      const payload = { ...values, ...override };
      if (override) setValues(payload);
      startTransition(async () => {
        const result = await save(payload);
        if (!result.ok) {
          setErrors(result.fieldErrors ?? {});
          toast("error", result.message);
          requestAnimationFrame(() => {
            document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
          });
          return;
        }
        setErrors({});
        setSaved(JSON.stringify(payload));
        toast("success", result.message);
        const target = redirectTo?.(result.data?.id);
        if (target) router.push(target);
        router.refresh();
      });
    },
    [values, save, toast, router, redirectTo],
  );

  return { values, set, setValues, errors, pending, dirty, submit };
}
