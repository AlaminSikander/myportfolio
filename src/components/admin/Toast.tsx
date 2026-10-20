"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Toast = { id: number; type: "success" | "error"; message: string };
type ToastContextValue = { toast: (type: Toast["type"], message: string) => void };

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext).toast;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);

  const toast = useCallback(
    (type: Toast["type"], message: string) => {
      const id = nextId.current++;
      setToasts((items) => [...items.slice(-3), { id, type, message }]);
      window.setTimeout(() => dismiss(id), type === "error" ? 7000 : 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              role={item.type === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 text-sm shadow-lift",
                item.type === "error" ? "border-ember-200" : "border-mint-100",
              )}
            >
              {item.type === "error" ? (
                <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-ember-600" />
              ) : (
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-mint-600" />
              )}
              <p className="flex-1 font-medium text-ink-900">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="-m-1 grid size-7 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink-900"
                aria-label="Dismiss notification"
              >
                <X aria-hidden className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
