import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { Briefcase, Pencil, Plus } from "lucide-react";
import { ActionButton } from "@/components/admin/ActionButton";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { EmptyState, LinkButton, PageHeader, StatusBadge, Table } from "@/components/admin/ui";
import { experiences, getDb } from "@/db";
import { requireAdmin } from "@/lib/auth/dal";
import { formatPeriod } from "@/lib/format";
import { deleteExperience, setExperienceStatus } from "./actions";

export const metadata: Metadata = { title: "Work experience" };

export default async function ExperienceListPage({ searchParams }: PageProps<"/admin/experience">) {
  await requireAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const status = params.status === "published" || params.status === "draft" ? params.status : "";

  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;
  const rows = await getDb()
    .select()
    .from(experiences)
    .where(
      and(
        status ? eq(experiences.status, status) : undefined,
        query ? or(ilike(experiences.jobTitle, pattern), ilike(experiences.company, pattern)) : undefined,
      ),
    )
    .orderBy(desc(experiences.current), desc(experiences.startDate));

  return (
    <>
      <PageHeader
        title="Work experience"
        description="Roles are shown on the portfolio newest first. Hidden (draft) roles are kept here but not shown publicly."
        actions={
          <LinkButton href="/admin/experience/new" icon={Plus}>
            Add experience
          </LinkButton>
        }
      />
      <SearchFilters action="/admin/experience" query={query} status={status} placeholder="Search by job title or company" />

      {rows.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={query || status ? "No matching experience" : "No work experience yet"}
          description={query || status ? "Try a different search or clear the filters." : "Add your first role to show it on the portfolio."}
          action={
            query || status ? null : (
              <LinkButton href="/admin/experience/new" icon={Plus}>
                Add experience
              </LinkButton>
            )
          }
        />
      ) : (
        <Table caption="Work experience" head={["Role", "Period", "Status", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link href={`/admin/experience/${row.id}`} className="font-semibold text-ink-950 hover:text-ember-600">
                  {row.jobTitle}
                </Link>
                <p className="text-xs text-muted">
                  {row.company}
                  {row.location ? ` · ${row.location}` : ""}
                </p>
              </td>
              <td className="whitespace-nowrap text-muted">{formatPeriod(row.startDate, row.endDate, row.current)}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Link href={`/admin/experience/${row.id}`} className="grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-canvas hover:text-ink-950" aria-label={`Edit ${row.jobTitle}`} title="Edit">
                    <Pencil aria-hidden className="size-4" />
                  </Link>
                  <ActionButton
                    iconOnly
                    icon={row.status === "published" ? "eye-off" : "eye"}
                    label={row.status === "published" ? `Hide ${row.jobTitle}` : `Show ${row.jobTitle}`}
                    action={setExperienceStatus.bind(null, row.id, row.status === "published" ? "draft" : "published")}
                  />
                  <ActionButton
                    iconOnly
                    icon="trash"
                    label={`Delete ${row.jobTitle}`}
                    action={deleteExperience.bind(null, row.id)}
                    confirm={{
                      title: "Delete this experience?",
                      description: (
                        <>
                          <strong>{row.jobTitle}</strong> at {row.company} will be permanently removed. This cannot be undone.
                        </>
                      ),
                      confirmLabel: "Delete",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
