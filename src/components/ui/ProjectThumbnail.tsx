import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/cn";

type ProjectThumbnailProps = {
  project: Project;
  sizes: string;
  className?: string;
  imageClassName?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

export function ProjectThumbnail({ project, sizes, className, imageClassName }: ProjectThumbnailProps) {
  return (
    <div className={cn("relative overflow-hidden bg-ink-900", className)}>
      <div className="relative z-10 flex h-7 items-center gap-1.5 border-b border-black/5 bg-white/95 px-3">
        <span aria-hidden className="size-2 rounded-full bg-[#ff5f57]" />
        <span aria-hidden className="size-2 rounded-full bg-[#febc2e]" />
        <span aria-hidden className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate rounded-md bg-canvas px-2 py-0.5 text-[0.65rem] font-medium text-muted">
          {project.displayUrl}
        </span>
      </div>
      <div className="relative aspect-[1200/633]">
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={`Screenshot of the ${project.name} homepage`}
            fill
            sizes={sizes}
            className={cn("object-cover object-top", imageClassName)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-900 via-ink-800 to-ember-700 p-6 text-center">
            <div aria-hidden className="bg-grid-dark absolute inset-0" />
            <div aria-hidden className="absolute -top-10 -right-10 size-40 rounded-full bg-ember-500/40 blur-3xl" />
            <span className="relative grid size-14 place-items-center rounded-2xl border border-white/20 bg-white/10 font-display text-xl font-extrabold text-white backdrop-blur">
              {initials(project.name)}
            </span>
            <span className="relative font-display text-base font-bold text-white">{project.name}</span>
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-white/80">
              <ImageOff aria-hidden className="size-3" />
              Illustration — live preview unavailable
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
