import "server-only";
import { asc, ne } from "drizzle-orm";
import { blogPosts, getDb } from "@/db";

export async function getAllPostCategories() {
  const rows = await getDb()
    .selectDistinct({ category: blogPosts.category })
    .from(blogPosts)
    .where(ne(blogPosts.category, ""))
    .orderBy(asc(blogPosts.category));
  return rows.map((row) => row.category);
}
