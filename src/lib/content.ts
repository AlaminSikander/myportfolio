import "server-only";
import { cache } from "react";
import { and, asc, count, desc, eq, ilike, lte, ne, or, sql } from "drizzle-orm";
import {
  blogPosts,
  experiences,
  getDb,
  isDatabaseConfigured,
  projects,
  siteSettings,
  skillCategories,
  skills,
  type BlogPostRow,
  type ExperienceRow,
  type ProjectRow,
} from "@/db";
import { experienceSeed } from "@/data/experience";
import { projectSeed } from "@/data/projects";
import { defaultSettings } from "@/data/site";
import { skillCategorySeed } from "@/data/skills";
import { displayUrl, formatPeriod } from "@/lib/format";
import { readingMinutes } from "@/lib/reading-time";
import type { BlogPost, Experience, Project, SiteSettings, SkillCategory } from "@/types";

/*
 * Public read model. Every query here returns published content only.
 * When DATABASE_URL is not set (for example before the database is provisioned), the original
 * static content in src/data is served instead so the public site keeps working.
 */

export function toExperience(row: Pick<ExperienceRow, Exclude<keyof ExperienceRow, "createdAt" | "updatedAt" | "status">>): Experience {
  return {
    id: row.id,
    company: row.company,
    location: row.location,
    role: row.jobTitle,
    employmentType: row.employmentType,
    period: formatPeriod(row.startDate, row.endDate, row.current),
    start: row.startDate.slice(0, 7),
    end: row.endDate ? row.endDate.slice(0, 7) : null,
    current: row.current,
    summary: row.summary,
    accent: row.accent,
    responsibilities: row.responsibilities,
    achievements: row.achievements,
    technologies: row.technologies,
  };
}

export function toProject(row: Omit<ProjectRow, "id" | "createdAt" | "status" | "sortOrder" | "updatedAt"> & { updatedAt?: Date }): Project {
  return {
    slug: row.slug,
    name: row.title,
    url: row.liveUrl,
    displayUrl: displayUrl(row.liveUrl) || row.title,
    githubUrl: row.githubUrl,
    categories: row.categories,
    summary: row.summary,
    content: row.content,
    details: row.details,
    screenshot: row.image,
    imageAlt: row.imageAlt,
    gallery: row.gallery,
    technologies: row.technologies,
    startDate: row.startDate,
    completedDate: row.completedDate,
    featured: row.featured,
    accent: row.accent,
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export function toBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    featuredImage: row.featuredImage,
    featuredImageAlt: row.featuredImageAlt,
    author: row.author,
    category: row.category,
    tags: row.tags,
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImage: row.ogImage,
    readingMinutes: readingMinutes(row.body),
  };
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isDatabaseConfigured()) return defaultSettings;
  const [row] = await getDb().select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return row ? { ...defaultSettings, ...row.data } : defaultSettings;
});

export const getExperiences = cache(async (): Promise<Experience[]> => {
  if (!isDatabaseConfigured()) {
    return experienceSeed.map((item, index) =>
      toExperience({
        id: index + 1,
        employmentType: null,
        endDate: null,
        current: false,
        summary: "",
        location: "",
        accent: "ember",
        responsibilities: [],
        achievements: [],
        technologies: [],
        ...item,
      }),
    );
  }
  const rows = await getDb()
    .select()
    .from(experiences)
    .where(eq(experiences.status, "published"))
    .orderBy(desc(experiences.current), desc(experiences.startDate), desc(experiences.id));
  return rows.map(toExperience);
});

export const getSkillCategories = cache(async (): Promise<SkillCategory[]> => {
  if (!isDatabaseConfigured()) {
    return skillCategorySeed.map((category) => ({
      id: category.slug,
      label: category.label,
      description: category.description,
      accent: category.accent,
      icon: category.icon,
      skills: category.skills.map((name) => ({ name })),
    }));
  }
  const db = getDb();
  const [categoryRows, skillRows] = await Promise.all([
    db.select().from(skillCategories).orderBy(asc(skillCategories.sortOrder), asc(skillCategories.id)),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
  ]);
  return categoryRows
    .map((category) => ({
      id: category.slug,
      label: category.label,
      description: category.description,
      accent: category.accent,
      icon: category.icon,
      skills: skillRows
        .filter((skill) => skill.categoryId === category.id)
        .map((skill) => ({ name: skill.name, icon: skill.icon, proficiency: skill.proficiency })),
    }))
    .filter((category) => category.skills.length > 0);
});

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!isDatabaseConfigured()) return projectSeed.map((item) => toProject(item as Parameters<typeof toProject>[0]));
  const rows = await getDb()
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(desc(projects.featured), asc(projects.sortOrder), asc(projects.id));
  return rows.map(toProject);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const all = await getProjects();
  return all.find((project) => project.slug === slug) ?? null;
});

const publishedPost = () => and(eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, new Date()));

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

export async function getPublishedPosts({
  query = "",
  category = "",
  page = 1,
  perPage = 9,
}: { query?: string; category?: string; page?: number; perPage?: number } = {}) {
  if (!isDatabaseConfigured()) return { posts: [] as BlogPost[], total: 0, page: 1, pageCount: 1 };
  const term = query.trim().slice(0, 100);
  const pattern = `%${escapeLike(term)}%`;
  const where = and(
    publishedPost(),
    category ? eq(blogPosts.category, category) : undefined,
    term
      ? or(ilike(blogPosts.title, pattern), ilike(blogPosts.excerpt, pattern), ilike(blogPosts.body, pattern))
      : undefined,
  );
  const db = getDb();
  const [{ value: total }] = await db.select({ value: count() }).from(blogPosts).where(where);
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pageCount);
  const rows = await db
    .select()
    .from(blogPosts)
    .where(where)
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.id))
    .limit(perPage)
    .offset((current - 1) * perPage);
  return { posts: rows.map(toBlogPost), total, page: current, pageCount };
}

export const getBlogCategories = cache(async (): Promise<string[]> => {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDb()
    .selectDistinct({ category: blogPosts.category })
    .from(blogPosts)
    .where(and(publishedPost(), ne(blogPosts.category, "")))
    .orderBy(asc(blogPosts.category));
  return rows.map((row) => row.category);
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!isDatabaseConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(blogPosts)
    .where(and(publishedPost(), eq(blogPosts.slug, slug)))
    .limit(1);
  return row ? toBlogPost(row) : null;
});

export async function getRelatedPosts(post: Pick<BlogPost, "id" | "category" | "tags">, limit = 3) {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDb()
    .select()
    .from(blogPosts)
    .where(and(publishedPost(), ne(blogPosts.id, post.id)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(40);
  const tags = new Set(post.tags.map((tag) => tag.toLowerCase()));
  return rows
    .map((row) => ({
      row,
      score:
        (post.category && row.category === post.category ? 2 : 0) +
        row.tags.filter((tag) => tags.has(tag.toLowerCase())).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => toBlogPost(item.row));
}

export async function getLatestPosts(limit = 3) {
  const { posts } = await getPublishedPosts({ perPage: limit });
  return posts;
}

export async function getSitemapPosts() {
  if (!isDatabaseConfigured()) return [];
  return getDb()
    .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt, featuredImage: blogPosts.featuredImage })
    .from(blogPosts)
    .where(publishedPost())
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getContentUpdatedAt() {
  if (!isDatabaseConfigured()) return new Date();
  const db = getDb();
  const [[a], [b], [c], [d]] = await Promise.all([
    db.select({ value: sql<Date>`max(${experiences.updatedAt})` }).from(experiences),
    db.select({ value: sql<Date>`max(${projects.updatedAt})` }).from(projects),
    db.select({ value: sql<Date>`max(${skills.updatedAt})` }).from(skills),
    db.select({ value: sql<Date>`max(${siteSettings.updatedAt})` }).from(siteSettings),
  ]);
  const dates = [a.value, b.value, c.value, d.value].filter(Boolean).map((value) => new Date(value));
  return dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : new Date();
}
