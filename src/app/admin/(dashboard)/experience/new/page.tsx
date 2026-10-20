import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { emptyExperience, ExperienceForm } from "../ExperienceForm";

export const metadata: Metadata = { title: "Add experience" };

export default async function NewExperiencePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add experience" backHref="/admin/experience" backLabel="Work experience" />
      <ExperienceForm id={null} initial={emptyExperience} />
    </>
  );
}
