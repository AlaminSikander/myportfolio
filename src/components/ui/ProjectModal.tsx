"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import type { Project } from "@/types";
import { ProjectThumbnail } from "@/components/ui/ProjectThumbnail";
import { cn } from "@/lib/cn";
import { projectCategoryLabel, projectCategoryTone } from "@/lib/project-categories";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="project-modal"
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div aria-hidden className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            aria-describedby="project-modal-summary"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-panel bg-white shadow-lift sm:rounded-panel"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
              <p className="font-display text-xs font-bold tracking-[0.16em] text-ember-600 uppercase">
                Project details
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid size-10 place-items-center rounded-full border border-line text-ink-900 transition-colors hover:border-ink-900 hover:bg-canvas"
                aria-label="Close project details"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <ProjectThumbnail
                project={project}
                sizes="(min-width: 768px) 720px, 100vw"
                className="rounded-2xl ring-1 ring-line"
              />

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide uppercase",
                      projectCategoryTone(category),
                    )}
                  >
                    {projectCategoryLabel(category)}
                  </span>
                ))}
              </div>
              <h3 id="project-modal-title" className="mt-3 text-2xl font-extrabold sm:text-3xl">
                {project.name}
              </h3>
              <p id="project-modal-summary" className="mt-3 leading-relaxed text-muted">
                {project.summary}
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {project.details.map((group) => (
                  <div
                    key={group.heading}
                    className={cn("rounded-2xl bg-canvas p-5", group.heading.startsWith("About") && "sm:col-span-2")}
                  >
                    <h4 className="font-display text-sm font-bold text-ink-950">{group.heading}</h4>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-800">
                          <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-mint-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                <span className="text-sm text-muted">{project.displayUrl}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/projects/${project.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-display text-sm font-bold text-ink-900 transition-colors hover:border-ink-900"
                  >
                    Full project page
                  </a>
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-ember-600 px-5 font-display text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-ember-700"
                      aria-label={`Visit the ${project.name} website (opens in a new tab)`}
                    >
                      Visit Website
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
