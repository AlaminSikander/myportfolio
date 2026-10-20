"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { btn, inputClass } from "./styles";

function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Ordered list of text lines (responsibilities, achievements, bullet points). */
export function ListEditor({
  label,
  items,
  onChange,
  error,
  hint,
  placeholder = "Add an item",
  addLabel = "Add item",
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  addLabel?: string;
}) {
  const id = useId();
  const listRef = useRef<HTMLOListElement>(null);

  const add = () => {
    onChange([...items, ""]);
    requestAnimationFrame(() => {
      const inputs = listRef.current?.querySelectorAll<HTMLTextAreaElement>("textarea");
      inputs?.[inputs.length - 1]?.focus();
    });
  };

  return (
    <fieldset aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="mb-1.5 text-sm font-semibold text-ink-900">{label}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-0.5 mb-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {items.length > 0 ? (
        <ol ref={listRef} className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-3 w-5 shrink-0 text-right text-xs font-bold text-subtle tabular-nums">{index + 1}.</span>
              <textarea
                value={item}
                rows={1}
                onChange={(event) => onChange(items.map((value, i) => (i === index ? event.target.value : value)))}
                placeholder={placeholder}
                aria-label={`${label} item ${index + 1}`}
                className={cn(inputClass, "field-sizing-content min-h-11 resize-none py-2.5")}
              />
              <div className="flex shrink-0 items-center">
                <button
                  type="button"
                  className={btn.icon}
                  onClick={() => onChange(move(items, index, index - 1))}
                  disabled={index === 0}
                  aria-label={`Move item ${index + 1} up`}
                >
                  <ArrowUp aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  className={btn.icon}
                  onClick={() => onChange(move(items, index, index + 1))}
                  disabled={index === items.length - 1}
                  aria-label={`Move item ${index + 1} down`}
                >
                  <ArrowDown aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  className={cn(btn.icon, "hover:text-ember-700")}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  aria-label={`Remove item ${index + 1}`}
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-muted">No items yet.</p>
      )}
      <button type="button" onClick={add} className={cn(btn.base, btn.ghost, "mt-2 -ml-2 px-3")}>
        <Plus aria-hidden className="size-4" />
        {addLabel}
      </button>
      {error ? <p className="mt-1 text-xs font-semibold text-ember-700">{error}</p> : null}
    </fieldset>
  );
}

/** Short values entered as chips (technologies, tags, keywords). Enter or comma adds a value. */
export function TagInput({
  label,
  values,
  onChange,
  error,
  hint,
  placeholder = "Type and press Enter",
  max = 40,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  max?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const additions = raw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => !values.some((existing) => existing.toLowerCase() === value.toLowerCase()));
    if (additions.length) onChange([...values, ...additions].slice(0, max));
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-900">
        {label}
      </label>
      <div
        className={cn(
          "flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-line-strong bg-white px-2 py-1.5 transition-colors focus-within:border-ink-900",
          error && "border-ember-600",
        )}
      >
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 rounded-full bg-canvas py-1 pr-1 pl-2.5 text-xs font-semibold text-ink-800 ring-1 ring-line"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((item) => item !== value))}
              className="grid size-5 place-items-center rounded-full text-muted hover:bg-white hover:text-ember-700"
              aria-label={`Remove ${value}`}
            >
              <X aria-hidden className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && commit(draft)}
          placeholder={values.length ? "" : placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-invalid={error ? true : undefined}
          className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-subtle"
        />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? <p className="mt-1.5 text-xs font-semibold text-ember-700">{error}</p> : null}
    </div>
  );
}
