import { ArrowRight, Download, MessageSquare } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "@/components/sections/HeroVisual";
import type { Experience, SiteSettings } from "@/types";

type HeroProps = {
  settings: SiteSettings;
  current?: Experience;
  projectCount: number;
};

export function Hero({ settings, current, projectCount }: HeroProps) {
  const facts = [
    { value: "4+", label: "Years of professional experience" },
    { value: "3", label: "Disciplines: QA, SEO & Operations" },
    { value: String(projectCount), label: "Featured website projects" },
  ];

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="animate-drift absolute -top-32 -left-24 size-[28rem] rounded-full bg-ember-200/45 blur-3xl" />
        <div className="animate-drift-slow absolute top-20 -right-32 size-[30rem] rounded-full bg-azure-100/80 blur-3xl" />
        <div className="animate-drift absolute bottom-0 left-1/3 size-[22rem] rounded-full bg-mint-100/70 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="max-w-2xl">
          {current ? (
            <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-line bg-white/80 py-1.5 pr-4 pl-2 text-xs font-semibold text-ink-700 shadow-soft backdrop-blur sm:text-sm">
              <span
                className="animate-pulse-dot grid size-2.5 place-items-center rounded-full bg-mint-500"
                aria-hidden
              />
              Currently {current.role} at {current.company}
            </p>
          ) : null}

          <p
            className="animate-rise mt-6 font-display text-sm font-bold tracking-wide text-ember-600 sm:text-base"
            style={{ animationDelay: "80ms" }}
          >
            {settings.roleLine}
          </p>

          <h1
            id="hero-title"
            className="animate-rise mt-3 text-[2.35rem] leading-[1.06] font-extrabold sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]"
            style={{ animationDelay: "140ms" }}
          >
            Building Better Digital Experiences Through <span className="text-mint-700">Quality</span>,{" "}
            <span className="text-azure-600">Search</span> &amp;{" "}
            <span className="relative whitespace-nowrap text-ember-600">
              Strategy
              <svg
                aria-hidden
                viewBox="0 0 220 14"
                className="absolute -bottom-2 left-0 h-3 w-full text-ember-400"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10 C 60 2, 150 2, 218 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p
            className="animate-rise mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            I&apos;m <strong className="font-semibold text-ink-900">{settings.name}</strong>, a Software QA professional
            with experience in SEO, digital marketing, and management operations. I help teams improve software quality,
            website visibility, and day-to-day project delivery.
          </p>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "300ms" }}>
            <ButtonLink href="#projects" size="lg" iconChip icon={<ArrowRight aria-hidden className="size-4" />}>
              Explore My Work
            </ButtonLink>
            <ButtonLink
              href="#contact"
              size="lg"
              variant="secondary"
              icon={<MessageSquare aria-hidden className="size-4" />}
            >
              Contact Me
            </ButtonLink>
            {settings.cvUrl ? (
              <ButtonLink
                href={settings.cvUrl}
                size="lg"
                variant="ghost"
                download
                icon={<Download aria-hidden className="size-4" />}
                aria-label={`Download CV of ${settings.name} (PDF)`}
              >
                Download CV
              </ButtonLink>
            ) : null}
          </div>

          <dl
            className="animate-rise mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6"
            style={{ animationDelay: "380ms" }}
          >
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                <dd className="font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">{fact.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual name={settings.name} photoUrl={settings.photo} location={settings.location} />
      </div>
    </section>
  );
}
