import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { emptyProject, ProjectForm } from "../ProjectForm";

export const metadata: Metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add project" backHref="/admin/projects" backLabel="Projects" />
      <ProjectForm id={null} initial={emptyProject} />
    </>
  );
}
