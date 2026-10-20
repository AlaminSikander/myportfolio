import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { PageHeader } from "@/components/admin/ui";
import { getDb, skillCategories } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { SkillForm } from "../SkillForms";

export const metadata: Metadata = { title: "Add skill" };

export default async function NewSkillPage({ searchParams }: PageProps<"/admin/skills/new">) {
  await requireAdmin();
  const categories = await getDb()
    .select({ id: skillCategories.id, label: skillCategories.label })
    .from(skillCategories)
    .orderBy(asc(skillCategories.sortOrder), asc(skillCategories.id));
  if (!categories.length) redirect("/admin/skills/categories/new");

  const requested = Number((await searchParams).category);
  const categoryId = categories.some((category) => category.id === requested) ? requested : categories[0].id;

  return (
    <>
      <PageHeader title="Add skill" backHref="/admin/skills" backLabel="Skills" />
      <SkillForm id={null} categories={categories} initial={{ name: "", categoryId, icon: "", proficiency: "" }} />
    </>
  );
}
