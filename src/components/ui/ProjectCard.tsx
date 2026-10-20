"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Eye } from "lucide-react";
import type { Project } from "@/types";
import { accentStyles } from "@/lib/accent";
import { cn } from "@/lib/cn";
import { projectCategoryLabel, projectCategoryTone } from "@/lib/project-categories";
import { ProjectThumbnail } from "@/components/ui/ProjectThumbnail";

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: (project: Project, trigger: HTMLButtonElement) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

export const ProjectCard = forwardRef<HTMLLIElement, ProjectCardProps>(function ProjectCard(
  { project, index, onOpen },
  ref,
) {
  const accent = accentStyles[project.accent];
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease, layout: { duration: 0.4, ease } }}
      className="h-full"
    >
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift",
          accent.hoverBorder,
        )}
      >
        <div className="p-3 pb-0">
          <ProjectThumbnail
            project={project}
            sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 92vw"
            className="rounded-2xl ring-1 ring-line"
            imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <ul className="flex flex-wrap gap-1.5" aria-label="Categories">
            {project.categories.map((category) => (
              <li
                key={category}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide uppercase",
                  projectCategoryTone(category),
                )}
              >
                {projectCategoryLabel(category)}
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-xl font-extrabold">{project.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-1 border-t border-line pt-5 sm:gap-2">
            <button
              type="button"
              onClick={(event) => onOpen(project, event.currentTarget)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
              aria-haspopup="dialog"
              aria-label={`View details about ${project.name}`}
            >
              <Eye aria-hidden className="size-4" />
              View Details
            </button>
            {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold text-ink-900 transition-colors hover:text-ember-600"
              aria-label={`Visit the ${project.name} website (opens in a new tab)`}
            >
              Visit Website
              <span className="relative grid size-6 place-items-center overflow-hidden rounded-full bg-ember-50 text-ember-600">
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-4 group-hover/link:-translate-y-4"
                />
                <ArrowUpRight
                  aria-hidden
                  className="absolute size-3.5 -translate-x-4 translate-y-4 transition-transform duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0"
                />
              </span>
            </a>
            ) : null}
          </div>
        </div>
      </article>
    </motion.li>
  );
});
