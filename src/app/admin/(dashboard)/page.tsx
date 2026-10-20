import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq, sql } from "drizzle-orm";
import { ArrowUpRight, Briefcase, FileText, FolderKanban, Newspaper, Plus, Sparkles, type LucideIcon } from "lucide-react";
import { LinkButton, PageHeader, Panel } from "@/components/admin/ui";
import { blogPosts, experiences, getDb, projects, siteSettings, skills } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Overview" };

type StatusCounts = { published: number; draft: number };

async function statusCounts(table: typeof projects | typeof experiences | typeof blogPosts): Promise<StatusCounts> {
  const rows = await getDb()
    .select({ status: table.status, value: count() })
    .from(table)
    .groupBy(table.status);
  return {
    published: rows.find((row) => row.status === "published")?.value ?? 0,
    draft: rows.find((row) => row.status === "draft")?.value ?? 0,
  };
}

type RecentItem = { type: string; title: string; href: string; updatedAt: Date; status?: string };

async function recentUpdates(): Promise<RecentItem[]> {
  const db = getDb();
  const [projectRows, experienceRows, postRows, skillRows, settingsRows] = await Promise.all([
    db.select({ id: projects.id, title: projects.title, updatedAt: projects.updatedAt, status: projects.status }).from(projects).orderBy(desc(projects.updatedAt)).limit(5),
    db.select({ id: experiences.id, title: experiences.jobTitle, company: experiences.company, updatedAt: experiences.updatedAt, status: experiences.status }).from(experiences).orderBy(desc(experiences.updatedAt)).limit(5),
    db.select({ id: blogPosts.id, title: blogPosts.title, updatedAt: blogPosts.updatedAt, status: blogPosts.status }).from(blogPosts).orderBy(desc(blogPosts.updatedAt)).limit(5),
    db.select({ id: skills.id, title: skills.name, updatedAt: skills.updatedAt }).from(skills).orderBy(desc(skills.updatedAt)).limit(3),
    db.select({ updatedAt: siteSettings.updatedAt }).from(siteSettings).where(eq(siteSettings.id, 1)),
  ]);
  return [
    ...projectRows.map((row) => ({ type: "Project", title: row.title, href: `/admin/projects/${row.id}`, updatedAt: row.updatedAt, status: row.status })),
    ...experienceRows.map((row) => ({ type: "Experience", title: `${row.title} · ${row.company}`, href: `/admin/experience/${row.id}`, updatedAt: row.updatedAt, status: row.status })),
    ...postRows.map((row) => ({ type: "Blog post", title: row.title, href: `/admin/blog/${row.id}`, updatedAt: row.updatedAt, status: row.status })),
    ...skillRows.map((row) => ({ type: "Skill", title: row.title, href: "/admin/skills", updatedAt: row.updatedAt })),
    ...settingsRows.map((row) => ({ type: "Settings", title: "Site settings", href: "/admin/settings", updatedAt: row.updatedAt })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  tone,
  detail,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  tone: string;
  detail?: string;
}) {
  return (
    <Link
      href={href}
      className="group card flex items-start justify-between gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div>
        <p className="text-sm font-semibold text-muted">{label}</p>
        <p className="mt-2 font-display text-3xl font-extrabold text-ink-950 tabular-nums">{value}</p>
        {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
      </div>
      <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tone}`}>
        <Icon aria-hidden className="size-5" />
      </span>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const user = await requireAdmin();
  const db = getDb();
  const [projectCounts, experienceCounts, postCounts, [skillCount], recent, [scheduled]] = await Promise.all([
    statusCounts(projects),
    statusCounts(experiences),
    statusCounts(blogPosts),
    db.select({ value: count() }).from(skills),
    recentUpdates(),
    db
      .select({ value: count() })
      .from(blogPosts)
      .where(sql`${blogPosts.status} = 'published' and ${blogPosts.publishedAt} > now()`),
  ]);

  const statusRows = [
    { label: "Projects", ...projectCounts, href: "/admin/projects" },
    { label: "Work experience", ...experienceCounts, href: "/admin/experience" },
    { label: "Blog posts", ...postCounts, href: "/admin/blog" },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back${user.name ? `, ${user.name}` : ""}`}
        description="An overview of your portfolio content. Changes you publish here update the public website right away."
        actions={
          <>
            <LinkButton href="/admin/blog/new" icon={Plus}>
              New post
            </LinkButton>
            <LinkButton href="/admin/projects/new" icon={Plus} variant="secondary">
              New project
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={projectCounts.published + projectCounts.draft}
          icon={FolderKanban}
          href="/admin/projects"
          tone="bg-mint-50 text-mint-700"
          detail={`${projectCounts.published} published`}
        />
        <StatCard label="Skills" value={skillCount.value} icon={Sparkles} href="/admin/skills" tone="bg-azure-50 text-azure-600" />
        <StatCard
          label="Work experiences"
          value={experienceCounts.published + experienceCounts.draft}
          icon={Briefcase}
          href="/admin/experience"
          tone="bg-ember-50 text-ember-600"
          detail={`${experienceCounts.published} shown on the site`}
        />
        <StatCard
          label="Published posts"
          value={postCounts.published}
          icon={Newspaper}
          href="/admin/blog?status=published"
          tone="bg-ink-900 text-white"
          detail={scheduled.value ? `${scheduled.value} scheduled` : `${postCounts.draft} drafts`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Draft vs. published" description="Drafts are never shown on the public website.">
          <ul className="space-y-4">
            {statusRows.map((row) => {
              const total = row.published + row.draft;
              const percent = total ? Math.round((row.published / total) * 100) : 0;
              return (
                <li key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <Link href={row.href} className="font-semibold text-ink-900 hover:text-ember-600">
                      {row.label}
                    </Link>
                    <span className="text-muted tabular-nums">
                      {row.published} published · {row.draft} draft
                    </span>
                  </div>
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-canvas ring-1 ring-line"
                    role="img"
                    aria-label={`${percent}% of ${row.label.toLowerCase()} published`}
                  >
                    <div className="h-full rounded-full bg-mint-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Recent updates">
          {recent.length ? (
            <ul className="-my-2 divide-y divide-line">
              {recent.map((item) => (
                <li key={`${item.type}-${item.href}-${item.title}`}>
                  <Link href={item.href} className="group flex items-center gap-3 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas text-ink-700">
                      <FileText aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-ember-600">
                        {item.title}
                      </span>
                      <span className="block text-xs text-muted">
                        {item.type}
                        {item.status ? ` · ${item.status === "published" ? "Published" : "Draft"}` : ""} · Updated{" "}
                        {formatDateTime(item.updatedAt)}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 shrink-0 text-subtle group-hover:text-ember-600" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No content yet. Run the seed script or create your first item.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
