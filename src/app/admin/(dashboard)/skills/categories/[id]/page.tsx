import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/ui";
import { getDb, skillCategories } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { SkillCategoryForm } from "../../SkillForms";

export const metadata: Metadata = { title: "Edit skill category" };

export default async function EditSkillCategoryPage({ params }: PageProps<"/admin/skills/categories/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [row] = await getDb().select().from(skillCategories).where(eq(skillCategories.id, id)).limit(1);
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.label} backHref="/admin/skills" backLabel="Skills" />
      <SkillCategoryForm
        key={row.updatedAt.toISOString()}
        id={row.id}
        initial={{ label: row.label, slug: row.slug, description: row.description, accent: row.accent, icon: row.icon }}
      />
    </>
  );
}
