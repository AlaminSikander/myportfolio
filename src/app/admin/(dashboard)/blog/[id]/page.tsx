import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { ActionButton } from "@/components/admin/ActionButton";
import { LinkButton, PageHeader, StatusBadge } from "@/components/admin/ui";
import { siteUrl } from "@/data/site";
import { blogPosts, getDb } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { deletePost } from "../actions";
import { getAllPostCategories } from "../categories";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [[row], categories] = await Promise.all([
    getDb().select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1),
    getAllPostCategories(),
  ]);
  if (!row) notFound();
  const scheduled = row.status === "published" && row.publishedAt && row.publishedAt > new Date();

  return (
    <>
      <PageHeader
        title={row.title}
        description={<StatusBadge status={scheduled ? "scheduled" : row.status} />}
        backHref="/admin/blog"
        backLabel="Blog"
        actions={
          <>
            {row.status === "published" && !scheduled ? (
              <LinkButton href={`/blog/${row.slug}`} icon={ExternalLink} variant="secondary">
                View on site
              </LinkButton>
            ) : null}
            <ActionButton
              icon="trash"
              label="Delete"
              action={deletePost.bind(null, row.id)}
              redirectTo="/admin/blog"
              confirm={{
                title: "Delete this post?",
                description: "The article will be permanently deleted. This cannot be undone.",
                confirmLabel: "Delete",
              }}
            />
          </>
        }
      />
      <PostForm
        key={row.updatedAt.toISOString()}
        id={row.id}
        siteUrl={siteUrl}
        categories={categories}
        initial={{
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          body: row.body,
          featuredImage: row.featuredImage ?? "",
          featuredImageAlt: row.featuredImageAlt,
          author: row.author,
          category: row.category,
          tags: row.tags,
          status: row.status,
          publishedAt: row.publishedAt ? row.publishedAt.toISOString().slice(0, 10) : "",
          seoTitle: row.seoTitle,
          seoDescription: row.seoDescription,
          ogImage: row.ogImage ?? "",
        }}
      />
    </>
  );
}
