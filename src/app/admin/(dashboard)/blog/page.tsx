import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, gt, ilike, lte, or } from "drizzle-orm";
import { ExternalLink, FileSearch, Newspaper, Pencil, Plus } from "lucide-react";
import { ActionButton } from "@/components/admin/ActionButton";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { EmptyState, LinkButton, PageHeader, StatusBadge, Table } from "@/components/admin/ui";
import { blogPosts, getDb } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { formatDate } from "@/lib/format";
import { deletePost, setPostStatus } from "./actions";

export const metadata: Metadata = { title: "Blog" };

const iconLink = "grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-canvas hover:text-ink-950";

export default async function BlogListPage({ searchParams }: PageProps<"/admin/blog">) {
  await requireAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const status = ["published", "draft", "scheduled"].includes(String(params.status)) ? String(params.status) : "";
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  const now = new Date();

  const statusFilter =
    status === "draft"
      ? eq(blogPosts.status, "draft")
      : status === "published"
        ? and(eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, now))
        : status === "scheduled"
          ? and(eq(blogPosts.status, "published"), gt(blogPosts.publishedAt, now))
          : undefined;

  const rows = await getDb()
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      category: blogPosts.category,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(
      and(
        statusFilter,
        query ? or(ilike(blogPosts.title, pattern), ilike(blogPosts.category, pattern), ilike(blogPosts.slug, pattern)) : undefined,
      ),
    )
    .orderBy(desc(blogPosts.updatedAt));

  return (
    <>
      <PageHeader
        title="Blog"
        description="Only published posts appear on /blog and in the sitemap. Drafts stay private."
        actions={
          <LinkButton href="/admin/blog/new" icon={Plus}>
            New post
          </LinkButton>
        }
      />
      <SearchFilters
        action="/admin/blog"
        query={query}
        status={status}
        placeholder="Search posts by title, category, or slug"
        statusOptions={[
          { value: "", label: "All statuses" },
          { value: "published", label: "Published" },
          { value: "scheduled", label: "Scheduled" },
          { value: "draft", label: "Draft" },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={query || status ? "No matching posts" : "No blog posts yet"}
          description={query || status ? "Try a different search or clear the filters." : "Write your first article — it stays a private draft until you publish it."}
          action={
            query || status ? null : (
              <LinkButton href="/admin/blog/new" icon={Plus}>
                New post
              </LinkButton>
            )
          }
        />
      ) : (
        <Table caption="Blog posts" head={["Title", "Category", "Status", "Actions"]}>
          {rows.map((row) => {
            const scheduled = row.status === "published" && row.publishedAt && row.publishedAt > now;
            const live = row.status === "published" && !scheduled;
            return (
              <tr key={row.id}>
                <td>
                  <Link href={`/admin/blog/${row.id}`} className="font-semibold text-ink-950 hover:text-ember-600">
                    {row.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {row.publishedAt ? `${scheduled ? "Scheduled for" : "Published"} ${formatDate(row.publishedAt)}` : "Not published"} · Updated {formatDate(row.updatedAt)}
                  </p>
                </td>
                <td className="text-muted">{row.category || "—"}</td>
                <td>
                  <StatusBadge status={scheduled ? "scheduled" : row.status} />
                </td>
                <td>
                  <div className="flex justify-end gap-1">
                    {live ? (
                      <a href={`/blog/${row.slug}`} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label={`View ${row.title} on the site (opens in a new tab)`} title="View on site">
                        <ExternalLink aria-hidden className="size-4" />
                      </a>
                    ) : (
                      <Link href={`/admin/blog/${row.id}/preview`} className={iconLink} aria-label={`Preview ${row.title}`} title="Preview">
                        <FileSearch aria-hidden className="size-4" />
                      </Link>
                    )}
                    <Link href={`/admin/blog/${row.id}`} className={iconLink} aria-label={`Edit ${row.title}`} title="Edit">
                      <Pencil aria-hidden className="size-4" />
                    </Link>
                    <ActionButton
                      iconOnly
                      icon={row.status === "published" ? "eye-off" : "eye"}
                      label={row.status === "published" ? `Unpublish ${row.title}` : `Publish ${row.title}`}
                      action={setPostStatus.bind(null, row.id, row.status === "published" ? "draft" : "published")}
                      confirm={
                        row.status === "published"
                          ? undefined
                          : { title: "Publish this post?", description: <>&ldquo;{row.title}&rdquo; will be visible on your public blog.</>, confirmLabel: "Publish", tone: "default" }
                      }
                    />
                    <ActionButton
                      iconOnly
                      icon="trash"
                      label={`Delete ${row.title}`}
                      action={deletePost.bind(null, row.id)}
                      confirm={{
                        title: "Delete this post?",
                        description: (
                          <>
                            &ldquo;<strong>{row.title}</strong>&rdquo; will be permanently deleted. This cannot be undone.
                          </>
                        ),
                        confirmLabel: "Delete",
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
