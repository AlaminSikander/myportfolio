"use server";

import { eq } from "drizzle-orm";
import { experiences, getDb } from "@/db";
import { ActionError, adminAction, idSchema, parseOrThrow, statusSchema } from "@/lib/admin/action";
import { fromMonthInput } from "@/lib/format";
import { experienceSchema, type ExperienceInput } from "@/lib/validation/admin";

export async function saveExperience(id: number | null, input: ExperienceInput) {
  return adminAction<{ id: number }>(async () => {
    const data = parseOrThrow(experienceSchema, input);
    const values = {
      ...data,
      employmentType: data.employmentType || null,
      startDate: fromMonthInput(data.startDate)!,
      endDate: data.current ? null : fromMonthInput(data.endDate),
    };
    const db = getDb();
    if (id !== null) {
      const [row] = await db
        .update(experiences)
        .set(values)
        .where(eq(experiences.id, idSchema.parse(id)))
        .returning({ id: experiences.id });
      if (!row) throw new ActionError("This experience no longer exists.");
      return { message: "Experience saved.", data: { id: row.id } };
    }
    const [row] = await db.insert(experiences).values(values).returning({ id: experiences.id });
    return { message: "Experience created.", data: { id: row.id } };
  });
}

export async function setExperienceStatus(id: number, status: "draft" | "published") {
  return adminAction(async () => {
    const next = statusSchema.parse(status);
    await getDb().update(experiences).set({ status: next }).where(eq(experiences.id, idSchema.parse(id)));
    return { message: next === "published" ? "Experience is now shown on the site." : "Experience hidden from the site." };
  });
}

export async function deleteExperience(id: number) {
  return adminAction(async () => {
    const [row] = await getDb()
      .delete(experiences)
      .where(eq(experiences.id, idSchema.parse(id)))
      .returning({ id: experiences.id });
    if (!row) throw new ActionError("This experience was already deleted.");
    return { message: "Experience deleted." };
  });
}
