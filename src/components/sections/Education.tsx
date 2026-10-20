import { Award, GraduationCap, School } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { education } from "@/data/education";
import { cn } from "@/lib/cn";

const tones = [
  { icon: GraduationCap, chip: "bg-ember-600 text-white", ring: "group-hover:border-ember-400" },
  { icon: School, chip: "bg-azure-600 text-white", ring: "group-hover:border-azure-400" },
  { icon: School, chip: "bg-mint-600 text-white", ring: "group-hover:border-mint-400" },
];

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="section-pad relative bg-white">
      <div className="container-page">
        <SectionHeading
          id="education-title"
          eyebrow="Education"
          align="center"
          title={
            <>
              Academic <span className="text-ember-600">foundation</span>
            </>
          }
          description="A Computer Science and Engineering degree that underpins my work in software quality and the web."
        />

        <div className="relative mx-auto mt-14 max-w-5xl">
          <span
            aria-hidden
            className="absolute top-7 right-[16%] left-[16%] hidden h-0.5 bg-gradient-to-r from-ember-200 via-azure-100 to-mint-100 md:block"
          />
          <RevealGroup as="ol" className="relative grid gap-6 md:grid-cols-3">
            {education.map((item, index) => {
              const tone = tones[index % tones.length];
              const Icon = tone.icon;
              return (
                <RevealItem key={item.degree} as="li" className="group relative flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "relative z-10 grid size-14 place-items-center rounded-2xl border-4 border-white shadow-lift transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3",
                      tone.chip,
                    )}
                  >
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <article
                    className={cn(
                      "card mt-6 flex w-full flex-1 flex-col p-6 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lift",
                      tone.ring,
                    )}
                  >
                    <p className="font-display text-sm font-bold text-ember-600">{item.period}</p>
                    <h3 className="mt-2 text-lg leading-snug font-extrabold">{item.degree}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.institution}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-5">
                      {item.group ? (
                        <span className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink-700">
                          {item.group}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3 py-1 text-xs font-bold text-white">
                        <Award aria-hidden className="size-3.5 text-ember-400" />
                        {item.result}
                      </span>
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
