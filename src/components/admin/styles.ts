export const btn = {
  base: "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
  primary: "bg-ember-600 text-white shadow-glow hover:bg-ember-700",
  dark: "bg-ink-900 text-white hover:bg-ink-700",
  secondary: "border border-line-strong bg-white text-ink-900 hover:border-ink-900",
  ghost: "text-ink-700 hover:bg-canvas hover:text-ink-950",
  danger: "bg-ember-700 text-white hover:bg-[#8a2909]",
  icon: "grid size-9 place-items-center rounded-lg text-ink-700 transition-colors hover:bg-canvas hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40",
};

export const inputClass =
  "block min-h-11 w-full rounded-xl border border-line-strong bg-white px-3.5 text-sm text-ink-950 transition-colors placeholder:text-subtle hover:border-ink-600 focus:border-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-600/30 aria-[invalid=true]:border-ember-600 disabled:bg-canvas";

export const textareaClass = `${inputClass} py-2.5 leading-relaxed`;
