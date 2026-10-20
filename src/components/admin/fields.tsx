"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { inputClass, textareaClass } from "./styles";

type FieldProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => ReactNode;
  className?: string;
  counter?: { value: number; max: number };
};

export function Field({ label, error, hint, required, children, className, counter }: FieldProps) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink-900">
          {label}
          {required ? (
            <span className="text-ember-600" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
        {counter ? (
          <span
            className={cn("text-xs tabular-nums", counter.value > counter.max ? "font-bold text-ember-700" : "text-subtle")}
          >
            {counter.value}/{counter.max}
          </span>
        ) : null}
      </div>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-ember-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  type?: "text" | "email" | "url" | "tel" | "month" | "date" | "search";
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  type = "text",
  placeholder,
  maxLength,
  showCounter,
  className,
  disabled,
  autoComplete,
}: TextFieldProps) {
  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
      counter={showCounter && maxLength ? { value: value.length, max: maxLength } : undefined}
    >
      {(props) => (
        <input
          {...props}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete ?? "off"}
          className={inputClass}
        />
      )}
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  rows = 4,
  maxLength,
  showCounter,
  className,
  placeholder,
}: Omit<TextFieldProps, "type"> & { rows?: number }) {
  return (
    <Field
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
      counter={showCounter && maxLength ? { value: value.length, max: maxLength } : undefined}
    >
      {(props) => (
        <textarea
          {...props}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          placeholder={placeholder}
          className={textareaClass}
        />
      )}
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  required,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(props) => (
        <select
          {...props}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={cn(inputClass, "pr-9")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line-strong accent-ember-600"
      />
      <div>
        <label htmlFor={id} className="cursor-pointer text-sm font-semibold text-ink-900">
          {label}
        </label>
        {hint ? (
          <p id={`${id}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-extrabold">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}
