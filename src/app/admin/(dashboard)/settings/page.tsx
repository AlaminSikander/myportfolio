import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getSettings } from "@/lib/content";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        title="Site settings"
        description="Your profile, contact details, SEO defaults, and branding. These appear across the whole website."
      />
      <SettingsForm initial={settings} />
    </>
  );
}
