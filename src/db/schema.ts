import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { ProjectDetailGroup, SiteSettings } from "@/types";

export const accentEnum = pgEnum("accent", ["teal", "blue", "ember"]);
export const statusEnum = pgEnum("content_status", ["draft", "published"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
}).enableRLS();

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
).enableRLS();

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("login_attempts_key_created_idx").on(table.key, table.createdAt)],
).enableRLS();

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  employmentType: text("employment_type"),
  location: text("location").notNull().default(""),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  current: boolean("current").notNull().default(false),
  summary: text("summary").notNull().default(""),
  responsibilities: jsonb("responsibilities").$type<string[]>().notNull().default([]),
  achievements: jsonb("achievements").$type<string[]>().notNull().default([]),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  accent: accentEnum("accent").notNull().default("ember"),
  status: statusEnum("status").notNull().default("published"),
  ...timestamps,
}).enableRLS();

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  details: jsonb("details").$type<ProjectDetailGroup[]>().notNull().default([]),
  image: text("image"),
  imageAlt: text("image_alt").notNull().default(""),
  gallery: jsonb("gallery").$type<{ url: string; alt: string }[]>().notNull().default([]),
  categories: jsonb("categories").$type<string[]>().notNull().default([]),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  startDate: date("start_date"),
  completedDate: date("completed_date"),
  featured: boolean("featured").notNull().default(false),
  status: statusEnum("status").notNull().default("draft"),
  accent: accentEnum("accent").notNull().default("ember"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
}).enableRLS();

export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  description: text("description").notNull().default(""),
  accent: accentEnum("accent").notNull().default("ember"),
  icon: text("icon").notNull().default("shield"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
}).enableRLS();

export const skills = pgTable(
  "skills",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => skillCategories.id, { onDelete: "cascade" }),
    icon: text("icon"),
    proficiency: text("proficiency"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("skills_category_idx").on(table.categoryId, table.sortOrder)],
).enableRLS();

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull().default(""),
    featuredImage: text("featured_image"),
    featuredImageAlt: text("featured_image_alt").notNull().default(""),
    author: text("author").notNull().default(""),
    category: text("category").notNull().default(""),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    status: statusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    ogImage: text("og_image"),
    ...timestamps,
  },
  (table) => [index("blog_posts_status_published_idx").on(table.status, table.publishedAt)],
).enableRLS();

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  data: jsonb("data").$type<SiteSettings>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}).enableRLS();

export type ExperienceRow = typeof experiences.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type SkillCategoryRow = typeof skillCategories.$inferSelect;
export type SkillRow = typeof skills.$inferSelect;
export type BlogPostRow = typeof blogPosts.$inferSelect;
