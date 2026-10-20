import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/ui";
import { getDb, skillCategories, skills } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { SkillForm } from "../SkillForms";

export const metadata: Metadata = { title: "Edit skill" };

export default async function EditSkillPage({ params }: PageProps<"/admin/skills/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const db = getDb();
  const [[row], categories] = await Promise.all([
    db.select().from(skills).where(eq(skills.id, id)).limit(1),
    db
      .select({ id: skillCategories.id, label: skillCategories.label })
      .from(skillCategories)
      .orderBy(asc(skillCategories.sortOrder), asc(skillCategories.id)),
  ]);
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.name} backHref="/admin/skills" backLabel="Skills" />
      <SkillForm
        key={row.updatedAt.toISOString()}
        id={row.id}
        categories={categories}
        initial={{ name: row.name, categoryId: row.categoryId, icon: row.icon ?? "", proficiency: row.proficiency ?? "" }}
      />
    </>
  );
}
