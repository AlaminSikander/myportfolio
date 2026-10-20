"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { projectFilters, projects } from "@/data/projects";
import { cn } from "@/lib/cn";
import type { Project } from "@/types";

type FilterId = (typeof projectFilters)[number]["id"];

export function Projects() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.categories.includes(filter))),
    [filter],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        projectFilters.map(({ id }) => [
          id,
          id === "all" ? projects.length : projects.filter((p) => p.categories.includes(id)).length,
        ]),
      ) as Record<FilterId, number>,
    [],
  );

  const open = useCallback((project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelected(project);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -right-40 bottom-10 -z-10 size-[28rem] rounded-full bg-mint-100/60 blur-3xl"
      />
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="projects-title"
            eyebrow="Featured projects"
            title={
              <>
                Websites I&apos;ve <span className="text-ember-600">tested &amp; optimized</span>
              </>
            }
            description="A selection of websites where I contributed quality assurance and SEO work. Previews are homepage screenshots of the live sites where available."
          />

          <Reveal delay={0.1} className="shrink-0">
            <div
              role="group"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-white p-1.5 shadow-soft sm:flex-nowrap sm:rounded-full"
            >
              {projectFilters.map((item) => {
                const isActive = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-300",
                      isActive
                        ? "bg-ink-900 text-white shadow-soft"
                        : "text-ink-700 hover:bg-canvas hover:text-ink-950",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "grid min-w-5 place-items-center rounded-full px-1.5 text-[0.7rem] font-bold",
                        isActive ? "bg-white/20 text-white" : "bg-canvas text-muted",
                      )}
                    >
                      {counts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} onOpen={open} />
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <ProjectModal project={selected} onClose={close} />
    </section>
  );
}
