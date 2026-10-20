import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { getContentUpdatedAt, getProjects, getSettings, getSitemapPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/images";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects, posts, contentUpdatedAt] = await Promise.all([
    getSettings(),
    getProjects(),
    getSitemapPosts(),
    getContentUpdatedAt(),
  ]);
  const latestPost = posts.reduce<Date | null>(
    (latest, post) => (!latest || post.updatedAt > latest ? post.updatedAt : latest),
    null,
  );

  return [
    {
      url: siteUrl,
      lastModified: contentUpdatedAt,
      changeFrequency: "monthly",
      priority: 1,
      ...(settings.photo ? { images: [absoluteUrl(settings.photo, siteUrl)] } : {}),
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestPost ?? contentUpdatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : contentUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(project.screenshot ? { images: [absoluteUrl(project.screenshot, siteUrl)] } : {}),
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(post.featuredImage ? { images: [absoluteUrl(post.featuredImage, siteUrl)] } : {}),
    })),
  ];
}
