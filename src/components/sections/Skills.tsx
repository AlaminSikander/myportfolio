"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MonitorCog, Search, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { skillCategories } from "@/data/skills";
import { accentStyles } from "@/lib/accent";
import { cn } from "@/lib/cn";

const icons: Record<string, typeof ShieldCheck> = {
  qa: ShieldCheck,
  seo: Search,
  ecommerce: ShoppingCart,
  operations: Users,
  it: MonitorCog,
};

export function Skills() {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = skillCategories.find((c) => c.id === activeId) ?? skillCategories[0];
  const accent = accentStyles[active.accent];
  const ActiveIcon = icons[active.id] ?? ShieldCheck;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = skillCategories.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActiveId(skillCategories[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="section-pad relative overflow-hidden">
      <div aria-hidden className="absolute -top-24 -left-40 -z-10 size-[26rem] rounded-full bg-azure-100/60 blur-3xl" />
      <div className="container-page">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills & tools"
          title={
            <>
              A practical toolkit across <span className="text-ember-600">five areas</span>
            </>
          }
          description="Hands-on skills and tools I use day to day, grouped by discipline. Choose a category to explore."
        />

        <Reveal delay={0.05} className="mt-12">
          <div
            role="tablist"
            aria-label="Skill categories"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {skillCategories.map((category, index) => {
              const selected = category.id === activeId;
              const Icon = icons[category.id] ?? ShieldCheck;
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`skills-tab-${category.id}`}
                  aria-selected={selected}
                  aria-controls={`skills-panel-${category.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(category.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                    selected ? "text-white" : "border border-line bg-white text-ink-800 hover:border-ink-900",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="skills-tab-bg"
                      className="absolute inset-0 -z-0 rounded-full bg-ink-900 shadow-soft"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  ) : null}
                  <Icon aria-hidden className="relative size-4" />
                  <span className="relative">{category.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`skills-panel-${active.id}`}
          aria-labelledby={`skills-tab-${active.id}`}
          tabIndex={0}
          className="mt-6 rounded-panel"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 lg:grid-cols-[0.8fr_2fr]"
            >
              <div className="relative overflow-hidden rounded-panel bg-ink-900 p-7 text-white sm:p-8">
                <div aria-hidden className="bg-grid-dark absolute inset-0" />
                <div
                  aria-hidden
                  className={cn("absolute -right-12 -bottom-12 size-48 rounded-full opacity-40 blur-3xl", accent.bg)}
                />
                <span className={cn("relative grid size-12 place-items-center rounded-2xl text-white", accent.bg)}>
                  <ActiveIcon aria-hidden className="size-6" />
                </span>
                <h3 className="relative mt-6 text-2xl font-extrabold text-white">{active.label}</h3>
                <p className="relative mt-3 leading-relaxed text-white/70">{active.description}</p>
                <p className="relative mt-8 font-display text-sm font-semibold text-white/60">
                  <span className="text-3xl font-extrabold text-white">{active.skills.length}</span> skills &amp; tools
                </p>
              </div>

              <ul className="card grid content-start gap-2.5 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-3">
                {active.skills.map((skill, index) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.025 * index, duration: 0.3 }}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border border-line bg-canvas/60 px-3.5 py-3 text-sm font-semibold text-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft",
                      accent.hoverBorder,
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-2 shrink-0 rounded-full transition-transform group-hover:scale-150",
                        accent.dot,
                      )}
                    />
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
