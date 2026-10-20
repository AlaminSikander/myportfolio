"use server";

import { eq } from "drizzle-orm";
import { blogPosts, getDb } from "@/db";
import { ActionError, adminAction, idSchema, parseOrThrow, statusSchema } from "@/lib/admin/action";
import { blogPostSchema, type BlogPostInput } from "@/lib/validation/admin";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Picks the publication timestamp. An unchanged date keeps the original time; a date within the
 * next ~36 hours counts as "today" in the author's time zone; later dates schedule the post.
 */
function resolvePublishedAt(status: "draft" | "published", dateInput: string, existing: Date | null) {
  if (!dateInput) return status === "published" ? (existing ?? new Date()) : existing;
  if (existing && existing.toISOString().slice(0, 10) === dateInput) return existing;
  const chosen = new Date(`${dateInput}T00:00:00Z`);
  const ahead = chosen.getTime() - Date.now();
  if (ahead > 0 && ahead < 1.5 * DAY_MS) return new Date();
  return chosen;
}

export async function savePost(id: number | null, input: BlogPostInput) {
  return adminAction<{ id: number }>(async () => {
    const data = parseOrThrow(blogPostSchema, input);
    const db = getDb();
    const postId = id === null ? null : idSchema.parse(id);
    let existing: Date | null = null;
    if (postId !== null) {
      const [row] = await db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, postId));
      if (!row) throw new ActionError("This post no longer exists.");
      existing = row.publishedAt;
    }
    const values = {
      ...data,
      featuredImage: data.featuredImage || null,
      ogImage: data.ogImage || null,
      publishedAt: resolvePublishedAt(data.status, data.publishedAt, existing),
    };
    const verb = data.status === "published" ? "published" : "saved as a draft";
    if (postId !== null) {
      await db.update(blogPosts).set(values).where(eq(blogPosts.id, postId));
      return { message: `Post ${verb}.`, data: { id: postId } };
    }
    const [row] = await db.insert(blogPosts).values(values).returning({ id: blogPosts.id });
    return { message: `Post ${verb}.`, data: { id: row.id } };
  });
}

export async function setPostStatus(id: number, status: "draft" | "published") {
  return adminAction(async () => {
    const next = statusSchema.parse(status);
    const postId = idSchema.parse(id);
    const db = getDb();
    const [row] = await db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, postId));
    if (!row) throw new ActionError("This post no longer exists.");
    await db
      .update(blogPosts)
      .set({ status: next, publishedAt: next === "published" ? (row.publishedAt ?? new Date()) : row.publishedAt })
      .where(eq(blogPosts.id, postId));
    return { message: next === "published" ? "Post published." : "Post moved back to drafts." };
  });
}

export async function deletePost(id: number) {
  return adminAction(async () => {
    const [row] = await getDb().delete(blogPosts).where(eq(blogPosts.id, idSchema.parse(id))).returning({ id: blogPosts.id });
    if (!row) throw new ActionError("This post was already deleted.");
    return { message: "Post deleted." };
  });
}
