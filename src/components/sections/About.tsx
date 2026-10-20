import { Briefcase, GraduationCap, Search, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const journey = [
  {
    year: "2018",
    title: "Computer Science & Engineering",
    detail: "Began a B.Sc. in CSE at IUBAT",
    icon: GraduationCap,
    tone: "bg-ink-900 text-white",
  },
  {
    year: "2022",
    title: "SEO Executive at Rokify",
    detail: "On-page, off-page, and technical SEO",
    icon: Search,
    tone: "bg-azure-600 text-white",
  },
  {
    year: "2025",
    title: "Supply Research at Area71",
    detail: "Market and supplier research",
    icon: Briefcase,
    tone: "bg-ember-600 text-white",
  },
  {
    year: "2026",
    title: "QA Engineer & Operations at Astitva Lab",
    detail: "Web and mobile testing, team coordination",
    icon: ShieldCheck,
    tone: "bg-mint-600 text-white",
  },
];

const principles = [
  {
    title: "Test like a real user",
    text: "Exploring flows, edge cases, and devices the way people actually use them.",
  },
  { title: "Document so others can act", text: "Clear test cases and bug reports with steps, evidence, and priority." },
  { title: "Communicate early", text: "Raising risks during requirement and design reviews, not after release." },
];

/** Splits plain text into paragraphs (blank-line separated) with `**bold**` spans. */
function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      block
        .replace(/\s*\n\s*/g, " ")
        .split(/(\*\*[^*]+\*\*)/g)
        .filter(Boolean)
        .map((part) =>
          part.startsWith("**") && part.endsWith("**") ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false },
        ),
    );
}

export function About({ about, softSkills }: { about: string; softSkills: string[] }) {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/3 -right-40 -z-10 size-[26rem] rounded-full bg-ember-100/50 blur-3xl"
      />
      <div className="container-page grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow="About me"
            title={
              <>
                A multidisciplinary professional who cares about the <span className="text-ember-600">details</span>
              </>
            }
          />
          <Reveal delay={0.1} className="mt-7 space-y-5 text-base leading-relaxed text-muted sm:text-[1.05rem]">
            {paragraphs(about).map((paragraph, index) => (
              <p key={index}>
                {paragraph.map((part, partIndex) =>
                  part.bold ? (
                    <strong key={partIndex} className="font-semibold text-ink-900">
                      {part.text}
                    </strong>
                  ) : (
                    part.text
                  ),
                )}
              </p>
            ))}
          </Reveal>

          <RevealGroup as="ul" className="mt-8 flex flex-wrap gap-2.5">
            {softSkills.map((skill) => (
              <RevealItem
                key={skill}
                as="li"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800 shadow-soft"
              >
                <Sparkles aria-hidden className="size-3.5 text-ember-500" />
                {skill}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="space-y-6">
          <Reveal className="card relative overflow-hidden p-7 sm:p-8">
            <div aria-hidden className="accent-line absolute inset-x-0 top-0 h-1" />
            <h3 className="font-display text-lg font-extrabold">My journey so far</h3>
            <div className="relative mt-6">
              <span
                aria-hidden
                className="absolute top-2 bottom-2 left-[1.1rem] w-px bg-gradient-to-b from-line-strong via-line to-transparent"
              />
              <ol className="relative space-y-6">
                {journey.map((step) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.year} className="relative flex gap-4">
                      <span
                        className={cn(
                          "relative grid size-9 shrink-0 place-items-center rounded-xl shadow-soft",
                          step.tone,
                        )}
                      >
                        <Icon aria-hidden className="size-4.5" />
                      </span>
                      <div>
                        <p className="font-display text-xs font-bold tracking-wider text-subtle uppercase">
                          {step.year}
                        </p>
                        <p className="mt-0.5 font-display font-bold text-ink-950">{step.title}</p>
                        <p className="text-sm text-muted">{step.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative overflow-hidden rounded-card bg-ink-900 p-7 text-white sm:p-8">
            <div aria-hidden className="bg-grid-dark absolute inset-0" />
            <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-ember-500/30 blur-3xl" />
            <h3 className="relative font-display text-lg font-extrabold text-white">How I approach quality</h3>
            <ul className="relative mt-5 space-y-4">
              {principles.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="font-display text-sm font-extrabold text-ember-400">0{index + 1}</span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-white/70">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
