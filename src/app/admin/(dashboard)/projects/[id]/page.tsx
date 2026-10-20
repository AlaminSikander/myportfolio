import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { ActionButton } from "@/components/admin/ActionButton";
import { LinkButton, PageHeader, StatusBadge } from "@/components/admin/ui";
import { getDb, projects } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { toMonthInput } from "@/lib/format";
import { deleteProject } from "../actions";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [row] = await getDb().select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!row) notFound();

  return (
    <>
      <PageHeader
        title={row.title}
        description={<StatusBadge status={row.status} />}
        backHref="/admin/projects"
        backLabel="Projects"
        actions={
          <>
            {row.status === "published" ? (
              <LinkButton href={`/projects/${row.slug}`} icon={ExternalLink} variant="secondary">
                View on site
              </LinkButton>
            ) : null}
            <ActionButton
              icon="trash"
              label="Delete"
              action={deleteProject.bind(null, row.id)}
              redirectTo="/admin/projects"
              confirm={{
                title: "Delete this project?",
                description: "This project will be permanently removed from your portfolio. This cannot be undone.",
                confirmLabel: "Delete",
              }}
            />
          </>
        }
      />
      <ProjectForm
        key={row.updatedAt.toISOString()}
        id={row.id}
        initial={{
          title: row.title,
          slug: row.slug,
          summary: row.summary,
          content: row.content,
          details: row.details,
          image: row.image ?? "",
          imageAlt: row.imageAlt,
          gallery: row.gallery,
          categories: row.categories,
          technologies: row.technologies,
          liveUrl: row.liveUrl ?? "",
          githubUrl: row.githubUrl ?? "",
          startDate: toMonthInput(row.startDate),
          completedDate: toMonthInput(row.completedDate),
          featured: row.featured,
          status: row.status,
          accent: row.accent,
        }}
      />
    </>
  );
}
