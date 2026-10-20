import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, ChevronRight, Code2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProjectThumbnail } from "@/components/ui/ProjectThumbnail";
import { cn } from "@/lib/cn";
import { getProjectBySlug, getProjects, getSettings } from "@/lib/content";
import { formatMonthYear } from "@/lib/format";
import { isOptimizableImage } from "@/lib/images";
import { projectCategoryLabel, projectCategoryTone } from "@/lib/project-categories";
import { breadcrumbJsonLd, graph, pageMetadata, projectJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return pageMetadata({
    settings,
    title: `${project.name} — ${project.categories.map(projectCategoryLabel).join(" & ")} Project`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.screenshot ? { url: project.screenshot, alt: project.imageAlt || project.name } : null,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, settings, allProjects] = await Promise.all([getProjectBySlug(slug), getSettings(), getProjects()]);
  if (!project) notFound();

  const others = allProjects
    .filter((item) => item.slug !== project.slug)
    .sort(
      (a, b) =>
        b.categories.filter((c) => project.categories.includes(c)).length -
        a.categories.filter((c) => project.categories.includes(c)).length,
    )
    .slice(0, 3);

  const jsonLd = graph(
    projectJsonLd(project, settings),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/#projects" },
      { name: project.name, path: `/projects/${project.slug}` },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <SiteShell>
        <article className="relative overflow-hidden pt-28 pb-16 sm:pt-32">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
            <div className="animate-drift absolute -top-32 -left-24 size-[26rem] rounded-full bg-mint-100/70 blur-3xl" />
            <div className="animate-drift-slow absolute top-10 -right-32 size-[26rem] rounded-full bg-azure-100/70 blur-3xl" />
          </div>

          <div className="container-page">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
                <li>
                  <Link href="/" className="hover:text-ink-950">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3.5" />
                </li>
                <li>
                  <Link href="/#projects" className="hover:text-ink-950">
                    Projects
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-3.5" />
                </li>
                <li aria-current="page" className="font-semibold text-ink-900">
                  {project.name}
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              <header>
                <ul className="flex flex-wrap gap-1.5" aria-label="Categories">
                  {project.categories.map((category) => (
                    <li key={category} className={cn("rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide uppercase", projectCategoryTone(category))}>
                      {projectCategoryLabel(category)}
                    </li>
                  ))}
                </ul>
                <h1 className="mt-4 text-[2.3rem] leading-[1.08] font-extrabold sm:text-5xl">{project.name}</h1>
                <p className="mt-5 text-lg leading-relaxed text-muted">{project.summary}</p>

                {project.startDate || project.completedDate ? (
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-800">
                    <CalendarDays aria-hidden className="size-4 text-subtle" />
                    {project.startDate ? formatMonthYear(project.startDate) : ""}
                    {project.startDate && project.completedDate ? " – " : ""}
                    {project.completedDate ? formatMonthYear(project.completedDate) : project.startDate ? " – Ongoing" : ""}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-3">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-ember-600 px-6 font-display text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-ember-700"
                    >
                      Visit {project.displayUrl}
                      <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-white px-6 font-display text-sm font-bold text-ink-900 transition-colors hover:border-ink-900"
                    >
                      <Code2 aria-hidden className="size-4" />
                      View source
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>

                {project.technologies.length ? (
                  <div className="mt-8">
                    <h2 className="font-display text-sm font-bold text-ink-950">Technologies & tools</h2>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <li key={tech} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-800">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </header>

              <ProjectThumbnail
                project={project}
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="rounded-panel shadow-lift ring-1 ring-line"
              />
            </div>

            {project.details.length ? (
              <div className="mt-14 grid gap-5 md:grid-cols-2">
                {project.details.map((group) => (
                  <section key={group.heading} className={cn("card p-6", group.heading.startsWith("About") && "md:col-span-2")}>
                    <h2 className="font-display text-base font-extrabold">{group.heading}</h2>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-800">
                          <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-mint-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : null}

            {project.content.trim() ? (
              <div className="mx-auto mt-14 max-w-3xl">
                <Markdown>{project.content}</Markdown>
              </div>
            ) : null}

            {project.gallery.length ? (
              <section aria-labelledby="gallery-title" className="mt-14">
                <h2 id="gallery-title" className="text-2xl font-extrabold">
                  Gallery
                </h2>
                <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                  {project.gallery.map((image) => (
                    <li key={image.url} className="relative aspect-video overflow-hidden rounded-panel bg-ink-900 ring-1 ring-line">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 640px) 50vw, 100vw"
                        unoptimized={!isOptimizableImage(image.url)}
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <Link
              href="/#projects"
              className="mt-14 inline-flex items-center gap-1.5 rounded-full text-sm font-bold text-ink-900 transition-colors hover:text-ember-600"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Back to all projects
            </Link>
          </div>
        </article>

        {others.length ? (
          <section aria-labelledby="more-projects" className="border-t border-line bg-white py-16 sm:py-20">
            <div className="container-page">
              <h2 id="more-projects" className="text-2xl font-extrabold sm:text-3xl">
                More projects
              </h2>
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {others.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/projects/${item.slug}`}
                      className="group block h-full rounded-panel border border-line bg-surface p-3 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <ProjectThumbnail project={item} sizes="(min-width: 768px) 30vw, 92vw" className="rounded-2xl ring-1 ring-line" />
                      <span className="block px-2 pt-4 pb-2 font-display text-lg font-extrabold text-ink-950 group-hover:text-ember-600">
                        {item.name}
                      </span>
                      <span className="block px-2 pb-2 text-sm text-muted">{item.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </SiteShell>
    </>
  );
}
