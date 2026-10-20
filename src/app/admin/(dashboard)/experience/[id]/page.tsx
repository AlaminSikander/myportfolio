import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/ui";
import { experiences, getDb } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { toMonthInput } from "@/lib/format";
import { deleteExperience } from "../actions";
import { ExperienceForm } from "../ExperienceForm";

export const metadata: Metadata = { title: "Edit experience" };

export default async function EditExperiencePage({ params }: PageProps<"/admin/experience/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [row] = await getDb().select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (!row) notFound();

  return (
    <>
      <PageHeader
        title={row.jobTitle}
        description={row.company}
        backHref="/admin/experience"
        backLabel="Work experience"
        actions={
          <ActionButton
            icon="trash"
            label="Delete"
            action={deleteExperience.bind(null, row.id)}
            redirectTo="/admin/experience"
            confirm={{
              title: "Delete this experience?",
              description: "This role will be permanently removed from your portfolio. This cannot be undone.",
              confirmLabel: "Delete",
            }}
          />
        }
      />
      <ExperienceForm
        key={row.updatedAt.toISOString()}
        id={row.id}
        initial={{
          jobTitle: row.jobTitle,
          company: row.company,
          employmentType: row.employmentType ?? "",
          location: row.location,
          startDate: toMonthInput(row.startDate),
          endDate: toMonthInput(row.endDate),
          current: row.current,
          summary: row.summary,
          responsibilities: row.responsibilities,
          achievements: row.achievements,
          technologies: row.technologies,
          accent: row.accent,
          status: row.status,
        }}
      />
    </>
  );
}
