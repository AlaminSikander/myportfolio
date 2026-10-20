import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass, Newspaper } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative grid min-h-[70dvh] place-items-center overflow-hidden px-5 pt-28 pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="animate-drift absolute top-10 left-1/4 size-[22rem] rounded-full bg-ember-200/40 blur-3xl" />
        </div>
        <div className="max-w-lg text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-ink-900 text-white shadow-lift">
            <Compass aria-hidden className="size-8" />
          </span>
          <p className="mt-6 font-display text-sm font-bold tracking-[0.18em] text-ember-600 uppercase">Error 404</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">This page could not be found</h1>
          <p className="mt-4 text-lg text-muted">
            The link may be broken, or the page may have been moved or unpublished.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ember-600 px-6 font-display text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-ember-700"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Back to home
            </Link>
            <Link
              href="/blog"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-white px-6 font-display text-sm font-bold text-ink-900 transition-all hover:-translate-y-0.5 hover:border-ink-900"
            >
              <Newspaper aria-hidden className="size-4" />
              Read the blog
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
