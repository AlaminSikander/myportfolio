import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/blog/ArticleView";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteUrl } from "@/data/site";
import { getPostBySlug, getRelatedPosts, getSettings, getSitemapPosts } from "@/lib/content";
import { blogPostingJsonLd, breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getSitemapPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const image = post.ogImage || post.featuredImage;
  return pageMetadata({
    settings,
    title: post.seoTitle || post.title,
    absoluteTitle: Boolean(post.seoTitle),
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    image: image ? { url: image, alt: post.featuredImageAlt || post.title } : null,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
    section: post.category || undefined,
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);
  if (!post) notFound();
  const related = await getRelatedPosts(post);

  const jsonLd = graph(
    blogPostingJsonLd(post, settings),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <SiteShell>
        <ArticleView post={post} url={`${siteUrl}/blog/${post.slug}`} related={related} />
      </SiteShell>
    </>
  );
}
