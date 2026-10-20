import type { Metadata } from "next";
import { siteUrl } from "@/data/site";
import { absoluteUrl } from "@/lib/images";
import type { BlogPost, Experience, Project, SiteSettings, SkillCategory } from "@/types";

export const DEFAULT_OG_IMAGE = "/og";

export function siteName(settings: SiteSettings) {
  return `${settings.name} — Portfolio`;
}

type PageMetadataInput = {
  settings: SiteSettings;
  title?: string;
  /** When true, `title` is used as-is instead of going through the "%s | Name" template. */
  absoluteTitle?: boolean;
  description: string;
  path: string;
  image?: { url: string; alt?: string } | null;
  type?: "website" | "article" | "profile";
  publishedTime?: string | null;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
};

/** Canonical URL, Open Graph and Twitter metadata for a public page. */
export function pageMetadata({
  settings,
  title,
  absoluteTitle,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  section,
}: PageMetadataInput): Metadata {
  const ogTitle = title ?? settings.seoTitle;
  const ogImage = image?.url || settings.ogImageUrl || DEFAULT_OG_IMAGE;
  const images = [
    {
      url: absoluteUrl(ogImage, siteUrl),
      alt: image?.alt || `${settings.name} — ${settings.roles.join(", ")}`,
      ...(ogImage === DEFAULT_OG_IMAGE ? { width: 1200, height: 630 } : {}),
    },
  ];
  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: siteName(settings),
      title: ogTitle,
      description,
      locale: "en_US",
      images,
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime,
            authors: [settings.name],
            tags,
            section,
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: images.map((item) => item.url) },
  };
}

export function personJsonLd(settings: SiteSettings, experiences: Experience[] = [], skills: SkillCategory[] = []) {
  const current = experiences.find((job) => job.current);
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: settings.name,
    alternateName: settings.shortName,
    url: siteUrl,
    ...(settings.photo ? { image: absoluteUrl(settings.photo, siteUrl) } : {}),
    email: `mailto:${settings.email}`,
    ...(settings.phone ? { telephone: settings.phone } : {}),
    jobTitle: settings.roles,
    description: settings.seoDescription,
    sameAs: settings.socialLinks.map((link) => link.url),
    ...(settings.location ? { address: { "@type": "PostalAddress", addressLocality: settings.location } } : {}),
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "IUBAT — International University of Business Agriculture and Technology",
    },
    ...(skills.length ? { knowsAbout: skills.flatMap((category) => category.skills.map((skill) => skill.name)).slice(0, 30) } : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName(settings),
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#person` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function blogPostingJsonLd(post: BlogPost, settings: SiteSettings) {
  const url = `${siteUrl}/blog/${post.slug}`;
  const image = post.ogImage || post.featuredImage;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    ...(image ? { image: [absoluteUrl(image, siteUrl)] } : {}),
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author || settings.name, url: siteUrl },
    publisher: { "@id": `${siteUrl}/#person` },
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    wordCount: post.body.split(/\s+/).filter(Boolean).length,
    inLanguage: "en",
  };
}

export function projectJsonLd(project: Project, settings: SiteSettings) {
  const url = `${siteUrl}/projects/${project.slug}`;
  return {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    url,
    name: project.name,
    description: project.summary,
    ...(project.screenshot ? { image: absoluteUrl(project.screenshot, siteUrl) } : {}),
    creator: { "@id": `${siteUrl}/#person`, name: settings.name },
    ...(project.url ? { sameAs: project.url } : {}),
    ...(project.technologies.length ? { keywords: project.technologies.join(", ") } : {}),
    ...(project.startDate ? { dateCreated: project.startDate } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
