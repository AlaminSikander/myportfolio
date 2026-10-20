import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, DatabaseZap } from "lucide-react";
import { isDatabaseConfigured } from "@/db";
import { getCurrentSession } from "@/lib/auth/dal";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const configured = isDatabaseConfigured();
  if (configured && (await getCurrentSession())) redirect("/admin");
  const { next } = await searchParams;

  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden bg-ink-950 px-5 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="animate-drift absolute -top-32 -left-24 size-[30rem] rounded-full bg-ember-600/25 blur-3xl" />
        <div className="animate-drift-slow absolute -right-24 -bottom-40 size-[30rem] rounded-full bg-azure-600/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5 text-white">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white font-display text-lg font-extrabold text-ink-950">
            A<span className="text-ember-600">.</span>
          </span>
          <span className="font-display text-lg font-extrabold">Portfolio Admin</span>
        </div>

        <div className="rounded-panel bg-white p-7 shadow-lift sm:p-9">
          <h1 className="text-2xl font-extrabold">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Manage portfolio content, projects, and blog posts.</p>

          {configured ? (
            <LoginForm next={typeof next === "string" ? next : ""} />
          ) : (
            <div role="alert" className="mt-7 flex gap-3 rounded-2xl border border-ember-200 bg-ember-50 p-4 text-sm text-ink-800">
              <DatabaseZap aria-hidden className="mt-0.5 size-5 shrink-0 text-ember-600" />
              <p>
                The admin is not set up yet: <code className="font-semibold">DATABASE_URL</code> is missing. Follow the
                &ldquo;Database setup&rdquo; steps in the README, then create the admin account with{" "}
                <code className="font-semibold">npm run admin:create</code>.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mx-auto mt-6 flex w-fit items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to the website
        </Link>
      </div>
    </main>
  );
}
