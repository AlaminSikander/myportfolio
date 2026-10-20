import { Check, Search, ShieldCheck, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { focusAreas } from "@/data/focus-areas";
import { accentStyles } from "@/lib/accent";
import { cn } from "@/lib/cn";
import type { FocusArea } from "@/types";

const icons: Record<FocusArea["icon"], typeof ShieldCheck> = {
  shield: ShieldCheck,
  search: Search,
  workflow: Workflow,
};

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className="section-pad relative bg-white">
      <div className="container-page">
        <SectionHeading
          id="overview-title"
          eyebrow="What I do"
          title={
            <>
              Three disciplines, <span className="text-ember-600">one focus</span>: dependable digital products
            </>
          }
          description="My work sits where software quality, search visibility, and operations meet — so products work as intended, can be found, and are delivered smoothly."
        />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {focusAreas.map((area, index) => {
            const Icon = icons[area.icon];
            const accent = accentStyles[area.accent];
            return (
              <RevealItem
                key={area.title}
                as="article"
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-panel border border-line bg-surface p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:p-8",
                  accent.hoverBorder,
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100",
                    accent.gradient,
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    "absolute -top-24 -right-24 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60",
                    accent.softBg,
                  )}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className={cn(
                      "grid size-14 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105",
                      accent.softBg,
                      accent.text,
                    )}
                  >
                    <Icon aria-hidden className="size-7" />
                  </span>
                  <span aria-hidden className="font-display text-4xl font-extrabold text-line">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="relative mt-6 text-xl font-extrabold">{area.title}</h3>
                <p className="relative mt-3 text-[0.95rem] leading-relaxed text-muted">{area.description}</p>
                <ul className="relative mt-6 space-y-3 border-t border-line pt-6">
                  {area.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm font-medium text-ink-800">
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                          accent.softBg,
                          accent.text,
                        )}
                      >
                        <Check aria-hidden className="size-3" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
