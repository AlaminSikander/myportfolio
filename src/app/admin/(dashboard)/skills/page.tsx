import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { Pencil, Plus, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/admin/ActionButton";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { EmptyState, LinkButton, PageHeader } from "@/components/admin/ui";
import { getDb, skillCategories, skills } from "@/db";
import { accentStyles } from "@/lib/accent";
import { requireAdmin } from "@/lib/auth/dal";
import { cn } from "@/lib/cn";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { deleteSkill, deleteSkillCategory, moveSkill, moveSkillCategory } from "./actions";

export const metadata: Metadata = { title: "Skills" };

const iconLink = "grid size-9 place-items-center rounded-lg text-ink-700 hover:bg-canvas hover:text-ink-950";

export default async function SkillsPage({ searchParams }: PageProps<"/admin/skills">) {
  await requireAdmin();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const db = getDb();
  const [categories, skillRows] = await Promise.all([
    db.select().from(skillCategories).orderBy(asc(skillCategories.sortOrder), asc(skillCategories.id)),
    db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id)),
  ]);

  const groups = categories
    .map((category) => ({
      category,
      items: skillRows.filter(
        (skill) => skill.categoryId === category.id && (!query || skill.name.toLowerCase().includes(query)),
      ),
    }))
    .filter((group) => !query || group.items.length > 0);

  return (
    <>
      <PageHeader
        title="Skills"
        description="Skills are grouped into categories, shown as tabs on the portfolio. Use the arrows to change the display order."
        actions={
          <>
            <LinkButton href="/admin/skills/categories/new" icon={Plus} variant="secondary">
              Add category
            </LinkButton>
            {categories.length ? (
              <LinkButton href="/admin/skills/new" icon={Plus}>
                Add skill
              </LinkButton>
            ) : null}
          </>
        }
      />
      <SearchFilters action="/admin/skills" query={params.q && typeof params.q === "string" ? params.q : ""} status="" placeholder="Search skills" statusOptions={null} />

      {groups.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={query ? "No matching skills" : "No skill categories yet"}
          description={query ? "Try a different search." : "Create a category such as “QA Testing”, then add skills to it."}
          action={
            query ? null : (
              <LinkButton href="/admin/skills/categories/new" icon={Plus}>
                Add category
              </LinkButton>
            )
          }
        />
      ) : (
        <div className="space-y-5">
          {groups.map(({ category, items }) => {
            const position = categories.findIndex((item) => item.id === category.id);
            return (
              <section key={category.id} className="card overflow-hidden" aria-labelledby={`category-${category.id}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-canvas/50 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-white", accentStyles[category.accent].bg)}>
                      <DynamicIcon name={category.icon} aria-hidden className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 id={`category-${category.id}`} className="font-display text-base font-extrabold">
                        {category.label}
                      </h2>
                      <p className="truncate text-xs text-muted">
                        {items.length} {items.length === 1 ? "skill" : "skills"}
                        {category.description ? ` · ${category.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!query ? (
                      <>
                        <ActionButton iconOnly icon="arrow-up" label={`Move ${category.label} up`} action={moveSkillCategory.bind(null, category.id, "up")} disabled={position === 0} />
                        <ActionButton iconOnly icon="arrow-down" label={`Move ${category.label} down`} action={moveSkillCategory.bind(null, category.id, "down")} disabled={position === categories.length - 1} />
                      </>
                    ) : null}
                    <Link href={`/admin/skills/categories/${category.id}`} className={iconLink} aria-label={`Edit ${category.label}`} title="Edit category">
                      <Pencil aria-hidden className="size-4" />
                    </Link>
                    <ActionButton
                      iconOnly
                      icon="trash"
                      label={`Delete ${category.label}`}
                      action={deleteSkillCategory.bind(null, category.id)}
                      confirm={{
                        title: "Delete this category?",
                        description: (
                          <>
                            <strong>{category.label}</strong> and all {items.length} of its skills will be permanently deleted.
                          </>
                        ),
                        confirmLabel: "Delete category",
                      }}
                    />
                  </div>
                </div>
                {items.length ? (
                  <ul className="divide-y divide-line">
                    {items.map((skill, index) => {
                      return (
                        <li key={skill.id} className="flex items-center gap-3 px-4 py-2.5">
                          {skill.icon ? (
                            <DynamicIcon name={skill.icon} aria-hidden className="size-4 shrink-0 text-subtle" />
                          ) : (
                            <span aria-hidden className={cn("size-2 shrink-0 rounded-full", accentStyles[category.accent].dot)} />
                          )}
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">
                            {skill.name}
                            {skill.proficiency ? <span className="ml-2 text-xs font-medium text-muted">{skill.proficiency}</span> : null}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {!query ? (
                              <>
                                <ActionButton iconOnly icon="arrow-up" label={`Move ${skill.name} up`} action={moveSkill.bind(null, skill.id, "up")} disabled={index === 0} />
                                <ActionButton iconOnly icon="arrow-down" label={`Move ${skill.name} down`} action={moveSkill.bind(null, skill.id, "down")} disabled={index === items.length - 1} />
                              </>
                            ) : null}
                            <Link href={`/admin/skills/${skill.id}`} className={iconLink} aria-label={`Edit ${skill.name}`} title="Edit skill">
                              <Pencil aria-hidden className="size-4" />
                            </Link>
                            <ActionButton
                              iconOnly
                              icon="trash"
                              label={`Delete ${skill.name}`}
                              action={deleteSkill.bind(null, skill.id)}
                              confirm={{ title: "Delete this skill?", description: <><strong>{skill.name}</strong> will be removed from your portfolio.</>, confirmLabel: "Delete" }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-muted">No skills in this category yet. Empty categories are hidden on the site.</p>
                )}
                {!query ? (
                  <div className="border-t border-line px-2 py-1.5">
                    <Link href={`/admin/skills/new?category=${category.id}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-700 hover:bg-canvas hover:text-ink-950">
                      <Plus aria-hidden className="size-4" />
                      Add skill to {category.label}
                    </Link>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
