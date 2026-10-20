"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { login, type LoginState } from "@/lib/auth/actions";

const inputClass =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-line-strong bg-white px-4 text-ink-950 transition-colors placeholder:text-subtle hover:border-ink-600 focus:border-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-600/40";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-7 space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-ink-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-ink-900">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "login-error" : undefined}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-1.5 mt-0.75 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink-900"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <p id="login-error" role="alert" aria-live="assertive" className="min-h-5 text-sm font-semibold text-ember-700">
        {state.error}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ember-600 font-display font-bold text-white shadow-glow transition-all hover:bg-ember-700 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <LogIn aria-hidden className="size-5" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
