"use server";

import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, projects } from "@/db";
import { ActionError, adminAction, idSchema, parseOrThrow, statusSchema } from "@/lib/admin/action";
import { fromMonthInput } from "@/lib/format";
import { projectSchema, type ProjectInput } from "@/lib/validation/admin";

export async function saveProject(id: number | null, input: ProjectInput) {
  return adminAction<{ id: number }>(async () => {
    const data = parseOrThrow(projectSchema, input);
    const values = {
      ...data,
      image: data.image || null,
      liveUrl: data.liveUrl || null,
      githubUrl: data.githubUrl || null,
      startDate: fromMonthInput(data.startDate),
      completedDate: fromMonthInput(data.completedDate),
      details: data.details.filter((group) => group.items.length > 0),
    };
    const db = getDb();
    if (id !== null) {
      const [row] = await db
        .update(projects)
        .set(values)
        .where(eq(projects.id, idSchema.parse(id)))
        .returning({ id: projects.id });
      if (!row) throw new ActionError("This project no longer exists.");
      return { message: "Project saved.", data: { id: row.id } };
    }
    const [{ next }] = await db.select({ next: sql<number>`coalesce(max(${projects.sortOrder}), -1) + 1` }).from(projects);
    const [row] = await db
      .insert(projects)
      .values({ ...values, sortOrder: Number(next) })
      .returning({ id: projects.id });
    return { message: "Project created.", data: { id: row.id } };
  });
}

export async function setProjectStatus(id: number, status: "draft" | "published") {
  return adminAction(async () => {
    const next = statusSchema.parse(status);
    await getDb().update(projects).set({ status: next }).where(eq(projects.id, idSchema.parse(id)));
    return { message: next === "published" ? "Project published." : "Project unpublished." };
  });
}

export async function setProjectFeatured(id: number, featured: boolean) {
  return adminAction(async () => {
    const value = z.boolean().parse(featured);
    await getDb().update(projects).set({ featured: value }).where(eq(projects.id, idSchema.parse(id)));
    return { message: value ? "Project marked as featured." : "Project is no longer featured." };
  });
}

export async function deleteProject(id: number) {
  return adminAction(async () => {
    const [row] = await getDb()
      .delete(projects)
      .where(eq(projects.id, idSchema.parse(id)))
      .returning({ id: projects.id });
    if (!row) throw new ActionError("This project was already deleted.");
    return { message: "Project deleted." };
  });
}
