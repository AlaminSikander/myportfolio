import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { SkillCategoryForm } from "../../SkillForms";

export const metadata: Metadata = { title: "Add skill category" };

export default async function NewSkillCategoryPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add skill category" backHref="/admin/skills" backLabel="Skills" />
      <SkillCategoryForm id={null} initial={{ label: "", slug: "", description: "", accent: "ember", icon: "shield" }} />
    </>
  );
}
