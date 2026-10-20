import { z } from "zod";
import { iconIds } from "@/lib/icons";
import { projectCategoryIds } from "@/lib/project-categories";
import { SLUG_PATTERN } from "@/lib/slug";

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`).default("");

const list = (max: number, itemMax = 300) =>
  z
    .array(z.string().trim().max(itemMax, `Each item must be ${itemMax} characters or fewer.`))
    .max(max, `Add at most ${max} items.`)
    .transform((items) => items.filter(Boolean));

/** Accepts absolute http(s) URLs or site-relative paths such as /images/photo.webp. */
const assetUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === "" || value.startsWith("/") || /^https?:\/\//i.test(value), "Enter a valid URL.")
  .refine((value) => !value.startsWith("//"), "Enter a valid URL.")
  .default("");

const webUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === "" || /^https?:\/\/[^\s]+$/i.test(value), "Enter a full URL starting with https://")
  .default("");

const linkUrl = z
  .string()
  .trim()
  .min(1, "URL is required.")
  .max(2048)
  .refine(
    (value) => (value.startsWith("/") && !value.startsWith("//")) || /^(https?:\/\/|mailto:|tel:)/i.test(value),
    "Use a full URL (https://…), mailto:, tel:, or a path starting with /",
  );

const month = z.string().regex(/^\d{4}-\d{2}$/, "Choose a month.");
const optionalMonth = z.union([z.literal(""), month]).default("");

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(80, "Slug must be 80 characters or fewer.")
  .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and single hyphens only.");

const accent = z.enum(["teal", "blue", "ember"]);
const status = z.enum(["draft", "published"]);

export const experienceSchema = z
  .object({
    jobTitle: text("Job title", 160),
    company: text("Company name", 160),
    employmentType: optionalText(60),
    location: optionalText(160),
    startDate: month,
    endDate: optionalMonth,
    current: z.boolean().default(false),
    summary: optionalText(600),
    responsibilities: list(30),
    achievements: list(30),
    technologies: list(40, 60),
    accent,
    status,
  })
  .superRefine((value, ctx) => {
    if (!value.current && !value.endDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "Add an end date or tick “Currently working here”." });
    }
    if (!value.current && value.endDate && value.endDate < value.startDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be after the start date." });
    }
  });

const detailGroup = z.object({
  heading: text("Section heading", 120),
  items: list(20),
});

const galleryImage = z.object({
  url: assetUrl.refine(Boolean, "Image URL is required."),
  alt: text("Alt text", 200),
});

export const projectSchema = z
  .object({
    title: text("Project title", 160),
    slug,
    summary: text("Short description", 400),
    content: optionalText(50_000),
    details: z.array(detailGroup).max(10).default([]),
    image: assetUrl,
    imageAlt: optionalText(200),
    gallery: z.array(galleryImage).max(12, "Add at most 12 gallery images.").default([]),
    categories: z.array(z.enum(projectCategoryIds)).min(1, "Choose at least one category.").max(6),
    technologies: list(40, 60),
    liveUrl: webUrl,
    githubUrl: webUrl,
    startDate: optionalMonth,
    completedDate: optionalMonth,
    featured: z.boolean().default(false),
    status,
    accent,
  })
  .superRefine((value, ctx) => {
    if (value.image && !value.imageAlt) {
      ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "Describe the image for screen readers and search engines." });
    }
    if (value.startDate && value.completedDate && value.completedDate < value.startDate) {
      ctx.addIssue({ code: "custom", path: ["completedDate"], message: "Completion date must be after the start date." });
    }
  });

export const skillCategorySchema = z.object({
  label: text("Category name", 80),
  slug,
  description: optionalText(300),
  accent,
  icon: z.enum(iconIds),
});

export const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export const skillSchema = z.object({
  name: text("Skill name", 80),
  categoryId: z.coerce.number().int().positive("Choose a category."),
  icon: z.union([z.literal(""), z.enum(iconIds)]).default(""),
  proficiency: z.union([z.literal(""), z.enum(proficiencyLevels)]).default(""),
});

export const blogPostSchema = z
  .object({
    title: text("Title", 160),
    slug,
    excerpt: text("Excerpt", 300),
    body: text("Article body", 100_000),
    featuredImage: assetUrl,
    featuredImageAlt: optionalText(200),
    author: optionalText(120),
    category: optionalText(60),
    tags: list(12, 40),
    status,
    publishedAt: z
      .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")])
      .default(""),
    seoTitle: optionalText(70),
    seoDescription: optionalText(160),
    ogImage: assetUrl,
  })
  .superRefine((value, ctx) => {
    if (value.featuredImage && !value.featuredImageAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["featuredImageAlt"],
        message: "Describe the image for screen readers and search engines.",
      });
    }
  });

const socialLink = z.object({
  platform: z.enum(["linkedin", "github", "x", "facebook", "instagram", "youtube", "website"]),
  label: text("Label", 80),
  url: webUrl.refine(Boolean, "URL is required."),
});

const footerLink = z.object({
  label: text("Label", 60),
  url: linkUrl,
});

export const settingsSchema = z.object({
  name: text("Name", 120),
  shortName: text("Short name", 60),
  roles: list(6, 80).refine((items) => items.length > 0, "Add at least one professional title."),
  roleLine: text("Role line", 120),
  tagline: text("Tagline", 300),
  about: text("About section", 10_000),
  email: z.string().trim().max(254).pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((value) => value === "" || /^\+?[0-9\s()-]{6,}$/.test(value), "Enter a valid phone number.")
    .default(""),
  phoneDisplay: optionalText(40),
  location: optionalText(120),
  whatsappMessage: optionalText(500),
  socialLinks: z.array(socialLink).max(10).default([]),
  photo: assetUrl,
  cvUrl: assetUrl,
  logoUrl: assetUrl,
  faviconUrl: assetUrl,
  ogImageUrl: assetUrl,
  seoTitle: text("Default SEO title", 120),
  seoDescription: text("Default meta description", 200),
  seoKeywords: list(20, 80),
  footerLinks: z.array(footerLink).max(12).default([]),
  softSkills: list(20, 60),
});

export type ExperienceInput = z.input<typeof experienceSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type SkillCategoryInput = z.input<typeof skillCategorySchema>;
export type SkillInput = z.input<typeof skillSchema>;
export type BlogPostInput = z.input<typeof blogPostSchema>;
export type SettingsInput = z.input<typeof settingsSchema>;

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
