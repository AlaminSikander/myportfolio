import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Eye } from "lucide-react";
import { ArticleView } from "@/components/blog/ArticleView";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteUrl } from "@/data/site";
import { blogPosts, getDb } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { toBlogPost } from "@/lib/content";

export const metadata: Metadata = { title: "Preview" };

export default async function PostPreviewPage({ params }: PageProps<"/admin/blog/[id]/preview">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [row] = await getDb().select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!row) notFound();
  const post = toBlogPost(row);
  const live = row.status === "published" && row.publishedAt && row.publishedAt <= new Date();

  return (
    <>
      <div
        role="status"
        className="fixed inset-x-0 bottom-0 z-[60] border-t border-ember-700 bg-ink-950/95 text-white backdrop-blur"
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <p className="inline-flex items-center gap-2 font-semibold">
            <Eye aria-hidden className="size-4 text-ember-400" />
            Preview of the last saved version · {live ? "Published" : row.status === "published" ? "Scheduled" : "Draft — not public"}
          </p>
          <Link
            href={`/admin/blog/${row.id}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 font-semibold text-ink-950 hover:bg-ember-50"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to editor
          </Link>
        </div>
      </div>
      <SiteShell>
        <ArticleView post={{ ...post, publishedAt: post.publishedAt ?? new Date().toISOString() }} url={`${siteUrl}/blog/${post.slug}`} />
      </SiteShell>
    </>
  );
}
