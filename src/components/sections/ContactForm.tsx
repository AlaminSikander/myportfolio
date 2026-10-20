"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  contactLimits,
  contactSchema,
  toFieldErrors,
  type ContactField,
  type ContactFieldErrors,
  type ContactInput,
} from "@/lib/validation";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm: ContactInput = { name: "", email: "", subject: "", message: "" };

const fields: {
  name: ContactField;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  maxLength: number;
}[] = [
  {
    name: "name",
    label: "Full name",
    autoComplete: "name",
    placeholder: "Your full name",
    maxLength: contactLimits.name,
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
    maxLength: contactLimits.email,
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "What would you like to discuss?",
    maxLength: contactLimits.subject,
  },
];

const inputClass =
  "w-full rounded-xl border bg-canvas/60 px-4 py-3 text-[0.95rem] text-ink-950 placeholder:text-subtle transition-colors focus:bg-white focus:outline-none focus-visible:outline-none focus:ring-4";

export function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState<ContactInput>(emptyForm);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name as ContactField;
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "error" || status === "success") setStatus("idle");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      const firstInvalid = Object.keys(fieldErrors)[0];
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok: boolean;
        message?: string;
        fieldErrors?: ContactFieldErrors;
      } | null;

      if (response.ok && data?.ok) {
        setStatus("success");
        setFeedback(data.message ?? "Thanks for reaching out — I'll get back to you as soon as I can.");
        setValues(emptyForm);
        setErrors({});
        startedAt.current = Date.now();
        return;
      }

      if (data?.fieldErrors) setErrors(data.fieldErrors);
      setStatus("error");
      setFeedback(data?.message ?? "Something went wrong. Please try again or email directly.");
    } catch {
      setStatus("error");
      setFeedback("Network error — please check your connection and try again, or email directly.");
    }
  };

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="contact-form-note">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={cn(field.name === "subject" && "sm:col-span-2")}>
              <label htmlFor={`contact-${field.name}`} className="mb-1.5 block text-sm font-semibold text-ink-900">
                {field.label}{" "}
                <span aria-hidden className="text-ember-600">
                  *
                </span>
              </label>
              <input
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                required
                value={values[field.name]}
                onChange={update}
                disabled={submitting}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `contact-${field.name}-error` : undefined}
                className={cn(
                  inputClass,
                  error
                    ? "border-ember-500 focus:border-ember-600 focus:ring-ember-100"
                    : "border-line focus:border-azure-500 focus:ring-azure-100",
                )}
              />
              {error ? (
                <p id={`contact-${field.name}-error`} className="mt-1.5 flex items-center gap-1 text-sm text-ember-700">
                  <AlertCircle aria-hidden className="size-3.5" />
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <label htmlFor="contact-message" className="block text-sm font-semibold text-ink-900">
            Message{" "}
            <span aria-hidden className="text-ember-600">
              *
            </span>
          </label>
          <span className="text-xs text-subtle" aria-hidden>
            {values.message.length}/{contactLimits.message}
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell me a little about your project, role, or question…"
          maxLength={contactLimits.message}
          required
          value={values.message}
          onChange={update}
          disabled={submitting}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(
            inputClass,
            "min-h-36 resize-y",
            errors.message
              ? "border-ember-500 focus:border-ember-600 focus:ring-ember-100"
              : "border-line focus:border-azure-500 focus:ring-azure-100",
          )}
        />
        {errors.message ? (
          <p id="contact-message-error" className="mt-1.5 flex items-center gap-1 text-sm text-ember-700">
            <AlertCircle aria-hidden className="size-3.5" />
            {errors.message}
          </p>
        ) : null}
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-note" className="text-xs leading-relaxed text-muted">
          Fields marked <span className="text-ember-600">*</span> are required. Your details are only used to reply to
          you.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ember-600 px-6 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-700 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Message
              <Send
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>
      </div>

      <div aria-live="polite" role="status">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-xl border border-mint-100 bg-mint-50 p-4 text-sm text-mint-700"
            >
              <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0" />
              <p>
                <strong className="font-semibold">Message sent.</strong> {feedback}
              </p>
            </motion.div>
          ) : null}
          {status === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-xl border border-ember-200 bg-ember-50 p-4 text-sm text-ember-700"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0" />
              <p>
                <strong className="font-semibold">Message not sent.</strong> {feedback}{" "}
                <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2">
                  {email}
                </a>
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
