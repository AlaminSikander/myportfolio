import { CalendarDays, ChevronDown, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { accentStyles } from "@/lib/accent";
import { cn } from "@/lib/cn";
import type { Experience as ExperienceItem } from "@/types";

const VISIBLE_ITEMS = 4;

export function Experience({ experience }: { experience: ExperienceItem[] }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section-pad relative bg-white">
      <div className="container-page">
        <SectionHeading
          id="experience-title"
          eyebrow="Work experience"
          title={
            <>
              Where I&apos;ve <span className="text-ember-600">contributed</span>
            </>
          }
          description="Roles spanning software quality assurance, supply and market research, and search engine optimization."
        />

        <div className="relative mt-14 lg:mt-16">
          <span
            aria-hidden
            className="absolute top-3 bottom-3 left-[1.2rem] w-0.5 rounded-full bg-gradient-to-b from-mint-400 via-ember-400 to-azure-400 opacity-60 md:left-[11.5rem]"
          />
          <ol className="space-y-8">
            {experience.map((job) => {
              const accent = accentStyles[job.accent];
              const visible = job.responsibilities.slice(0, VISIBLE_ITEMS);
              const hidden = job.responsibilities.slice(VISIBLE_ITEMS);
              return (
                <li key={job.id} className="relative grid gap-4 pl-12 md:grid-cols-[10rem_1fr] md:gap-12 md:pl-0">
                  <Reveal className="md:pt-6 md:text-right">
                    <p className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-ink-900">
                      <CalendarDays aria-hidden className="size-4 text-subtle md:hidden" />
                      <time dateTime={job.start}>{job.period}</time>
                    </p>
                    {job.current ? (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-2.5 py-0.5 text-xs font-bold text-mint-700 md:ml-auto md:flex md:w-fit">
                        <span aria-hidden className="animate-pulse-dot size-1.5 rounded-full bg-mint-500" />
                        Current role
                      </p>
                    ) : null}
                  </Reveal>

                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1 left-[0.27rem] size-8 rounded-full border-4 border-white shadow-soft md:top-6 md:left-[10.56rem]",
                      accent.bg,
                    )}
                  />

                  <Reveal delay={0.08}>
                    <article
                      className={cn(
                        "group card relative overflow-hidden p-6 transition-all duration-500 hover:shadow-lift sm:p-8",
                        accent.hoverBorder,
                      )}
                    >
                      <div aria-hidden className={cn("absolute inset-y-0 left-0 w-1", accent.bg)} />
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-extrabold sm:text-2xl">{job.role}</h3>
                          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            <span className={cn("font-display font-bold", accent.text)}>{job.company}</span>
                            {job.location ? (
                              <span className="inline-flex items-center gap-1 text-muted">
                                <MapPin aria-hidden className="size-3.5" />
                                {job.location}
                              </span>
                            ) : null}
                            {job.employmentType ? <span className="text-muted">{job.employmentType}</span> : null}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 leading-relaxed text-muted">{job.summary}</p>

                      <ul className="mt-5 grid gap-x-8 gap-y-2.5 text-[0.93rem] text-ink-800 lg:grid-cols-2">
                        {visible.map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", accent.dot)} />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {hidden.length > 0 ? (
                        <details className="group/details mt-4">
                          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900 [&::-webkit-details-marker]:hidden">
                            <span className="group-open/details:hidden">
                              Show {hidden.length} more responsibilities
                            </span>
                            <span className="hidden group-open/details:inline">Show fewer</span>
                            <ChevronDown
                              aria-hidden
                              className="size-4 transition-transform group-open/details:rotate-180"
                            />
                          </summary>
                          <ul className="mt-4 grid gap-x-8 gap-y-2.5 text-[0.93rem] text-ink-800 lg:grid-cols-2">
                            {hidden.map((item) => (
                              <li key={item} className="flex gap-2.5">
                                <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", accent.dot)} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : null}

                      {job.achievements.length > 0 ? (
                        <div className="mt-5 rounded-2xl bg-canvas p-4">
                          <h4 className="font-display text-sm font-bold text-ink-950">Key achievements</h4>
                          <ul className="mt-2.5 space-y-2 text-[0.93rem] text-ink-800">
                            {job.achievements.map((item) => (
                              <li key={item} className="flex gap-2.5">
                                <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", accent.dot)} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {job.technologies.length > 0 ? (
                        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`Technologies used at ${job.company}`}>
                          {job.technologies.map((tech) => (
                            <li key={tech} className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", accent.softBg, accent.text)}>
                              {tech}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
