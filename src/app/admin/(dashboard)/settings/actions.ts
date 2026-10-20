"use server";

import { getDb, siteSettings } from "@/db";
import { adminAction, parseOrThrow } from "@/lib/admin/action";
import { settingsSchema, type SettingsInput } from "@/lib/validation/admin";

export async function saveSettings(input: SettingsInput) {
  return adminAction<undefined>(async () => {
    const data = parseOrThrow(settingsSchema, input);
    await getDb()
      .insert(siteSettings)
      .values({ id: 1, data })
      .onConflictDoUpdate({ target: siteSettings.id, set: { data, updatedAt: new Date() } });
    return { message: "Settings saved. The website has been updated." };
  });
}
