import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { ExternalLink, FolderKanban, Pencil, Plus, Star } from "lucide-react";
import { ActionButton } from "@/components/admin/ActionButton";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { EmptyState, LinkButton, PageHeader, StatusBadge, Table } from "@/components/admin/ui";
import { getDb, projects } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { cn } from "@/lib/cn";
import { isOptimizableImage } from "@/lib/images";
import { projectCategoryLabel, projectCategoryTone } from "@/lib/project-categories";
import { deleteProject, setProjectFeatured, setProjectStatus } from "./actions";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsListPage({ searchParams }: PageProps<"/admin/projects">) {
  await requireAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const status = params.status === "published" || params.status === "draft" ? params.status : "";
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;

  const rows = await getDb()
    .select()
    .from(projects)
    .where(
      and(
        status ? eq(projects.status, status) : undefined,
        query ? or(ilike(projects.title, pattern), ilike(projects.summary, pattern), ilike(projects.slug, pattern)) : undefined,
      ),
    )
    .orderBy(desc(projects.featured), asc(projects.sortOrder), asc(projects.id));

  return (
    <>
      <PageHeader
        title="Projects"
        description="Published projects appear in the Projects section and get their own page. Featured projects are listed first."
        actions={
          <LinkButton href="/admin/projects/new" icon={Plus}>
            Add project
          </LinkButton>
        }
      />
      <SearchFilters action="/admin/projects" query={query} status={status} placeholder="Search projects" />

      {rows.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={query || status ? "No matching projects" : "No projects yet"}
          description={query || status ? "Try a different search or clear the filters." : "Add a project to showcase your work."}
          action={
            query || status ? null : (
              <LinkButton href="/admin/projects/new" icon={Plus}>
                Add project
              </LinkButton>
            )
          }
        />
      ) : (
        <Table caption="Projects" head={["Project", "Categories", "Status", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-900 ring-1 ring-line">
                    {row.image ? (
                      <Image src={row.image} alt="" fill sizes="64px" unoptimized={!isOptimizableImage(row.image)} className="object-cover object-top" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/admin/projects/${row.id}`} className="flex items-center gap-1.5 font-semibold text-ink-950 hover:text-ember-600">
                      {row.title}
                      {row.featured ? <Star aria-label="Featured" className="size-3.5 fill-ember-500 text-ember-500" /> : null}
                    </Link>
                    <p className="truncate text-xs text-muted">/projects/{row.slug}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {row.categories.map((category) => (
                    <span key={category} className={cn("rounded-full px-2 py-0.5 text-[0.7rem] font-bold", projectCategoryTone(category))}>
                      {projectCategoryLabel(category)}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  {row.status === "published" ? (
                    <a href={`/projects/${row.slug}`} target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-canvas hover:text-ink-950" aria-label={`View ${row.title} on the site (opens in a new tab)`} title="View on site">
                      <ExternalLink aria-hidden className="size-4" />
                    </a>
                  ) : null}
                  <Link href={`/admin/projects/${row.id}`} className="grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-canvas hover:text-ink-950" aria-label={`Edit ${row.title}`} title="Edit">
                    <Pencil aria-hidden className="size-4" />
                  </Link>
                  <ActionButton
                    iconOnly
                    icon="star"
                    label={row.featured ? `Unfeature ${row.title}` : `Feature ${row.title}`}
                    action={setProjectFeatured.bind(null, row.id, !row.featured)}
                    className={row.featured ? "text-ember-600" : undefined}
                  />
                  <ActionButton
                    iconOnly
                    icon={row.status === "published" ? "eye-off" : "eye"}
                    label={row.status === "published" ? `Unpublish ${row.title}` : `Publish ${row.title}`}
                    action={setProjectStatus.bind(null, row.id, row.status === "published" ? "draft" : "published")}
                  />
                  <ActionButton
                    iconOnly
                    icon="trash"
                    label={`Delete ${row.title}`}
                    action={deleteProject.bind(null, row.id)}
                    confirm={{
                      title: "Delete this project?",
                      description: (
                        <>
                          <strong>{row.title}</strong> will be permanently removed from your portfolio. This cannot be undone.
                        </>
                      ),
                      confirmLabel: "Delete",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
