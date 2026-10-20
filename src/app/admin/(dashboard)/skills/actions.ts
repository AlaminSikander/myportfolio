"use server";

import { asc, count, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, skillCategories, skills } from "@/db";
import { ActionError, adminAction, idSchema, parseOrThrow } from "@/lib/admin/action";
import { skillCategorySchema, skillSchema, type SkillCategoryInput, type SkillInput } from "@/lib/validation/admin";

const directionSchema = z.enum(["up", "down"]);

/** Swaps an item with its neighbour, then rewrites sort orders as 0..n so they stay contiguous. */
async function reorder<T extends { id: number }>(
  items: T[],
  id: number,
  direction: "up" | "down",
  write: (id: number, sortOrder: number) => Promise<unknown>,
) {
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return false;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  for (const [order, item] of next.entries()) await write(item.id, order);
  return true;
}

export async function saveSkillCategory(id: number | null, input: SkillCategoryInput) {
  return adminAction<{ id: number }>(async () => {
    const data = parseOrThrow(skillCategorySchema, input);
    const db = getDb();
    if (id !== null) {
      const [row] = await db
        .update(skillCategories)
        .set(data)
        .where(eq(skillCategories.id, idSchema.parse(id)))
        .returning({ id: skillCategories.id });
      if (!row) throw new ActionError("This category no longer exists.");
      return { message: "Category saved.", data: { id: row.id } };
    }
    const [{ next }] = await db
      .select({ next: sql<number>`coalesce(max(${skillCategories.sortOrder}), -1) + 1` })
      .from(skillCategories);
    const [row] = await db
      .insert(skillCategories)
      .values({ ...data, sortOrder: Number(next) })
      .returning({ id: skillCategories.id });
    return { message: "Category created.", data: { id: row.id } };
  });
}

export async function deleteSkillCategory(id: number) {
  return adminAction(async () => {
    const [row] = await getDb()
      .delete(skillCategories)
      .where(eq(skillCategories.id, idSchema.parse(id)))
      .returning({ id: skillCategories.id });
    if (!row) throw new ActionError("This category was already deleted.");
    return { message: "Category and its skills deleted." };
  });
}

export async function moveSkillCategory(id: number, direction: "up" | "down") {
  return adminAction(async () => {
    const db = getDb();
    const items = await db
      .select({ id: skillCategories.id })
      .from(skillCategories)
      .orderBy(asc(skillCategories.sortOrder), asc(skillCategories.id));
    const moved = await reorder(items, idSchema.parse(id), directionSchema.parse(direction), (itemId, sortOrder) =>
      db.update(skillCategories).set({ sortOrder }).where(eq(skillCategories.id, itemId)),
    );
    return { message: moved ? "Category order updated." : "Category is already at the edge." };
  });
}

export async function saveSkill(id: number | null, input: SkillInput) {
  return adminAction<{ id: number }>(async () => {
    const data = parseOrThrow(skillSchema, input);
    const db = getDb();
    const [category] = await db
      .select({ value: count() })
      .from(skillCategories)
      .where(eq(skillCategories.id, data.categoryId));
    if (!category.value) throw new ActionError("Choose a valid category.", { categoryId: "Choose a valid category." });

    const values = { ...data, icon: data.icon || null, proficiency: data.proficiency || null };
    if (id !== null) {
      const skillId = idSchema.parse(id);
      const [existing] = await db.select({ categoryId: skills.categoryId }).from(skills).where(eq(skills.id, skillId));
      if (!existing) throw new ActionError("This skill no longer exists.");
      const movedCategory = existing.categoryId !== data.categoryId;
      const [{ next }] = movedCategory
        ? await db.select({ next: sql<number>`coalesce(max(${skills.sortOrder}), -1) + 1` }).from(skills).where(eq(skills.categoryId, data.categoryId))
        : [{ next: undefined }];
      await db
        .update(skills)
        .set({ ...values, ...(movedCategory ? { sortOrder: Number(next) } : {}) })
        .where(eq(skills.id, skillId));
      return { message: "Skill saved.", data: { id: skillId } };
    }
    const [{ next }] = await db
      .select({ next: sql<number>`coalesce(max(${skills.sortOrder}), -1) + 1` })
      .from(skills)
      .where(eq(skills.categoryId, data.categoryId));
    const [row] = await db
      .insert(skills)
      .values({ ...values, sortOrder: Number(next) })
      .returning({ id: skills.id });
    return { message: "Skill added.", data: { id: row.id } };
  });
}

export async function deleteSkill(id: number) {
  return adminAction(async () => {
    const [row] = await getDb().delete(skills).where(eq(skills.id, idSchema.parse(id))).returning({ id: skills.id });
    if (!row) throw new ActionError("This skill was already deleted.");
    return { message: "Skill deleted." };
  });
}

export async function moveSkill(id: number, direction: "up" | "down") {
  return adminAction(async () => {
    const db = getDb();
    const skillId = idSchema.parse(id);
    const [skill] = await db.select({ categoryId: skills.categoryId }).from(skills).where(eq(skills.id, skillId));
    if (!skill) throw new ActionError("This skill no longer exists.");
    const items = await db
      .select({ id: skills.id })
      .from(skills)
      .where(eq(skills.categoryId, skill.categoryId))
      .orderBy(asc(skills.sortOrder), asc(skills.id));
    const moved = await reorder(items, skillId, directionSchema.parse(direction), (itemId, sortOrder) =>
      db.update(skills).set({ sortOrder }).where(eq(skills.id, itemId)),
    );
    return { message: moved ? "Skill order updated." : "Skill is already at the edge." };
  });
}
