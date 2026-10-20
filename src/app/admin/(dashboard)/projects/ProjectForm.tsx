"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";
import { FormFooter } from "@/components/admin/FormFooter";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { ListEditor, TagInput } from "@/components/admin/ListEditor";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { CheckboxField, FormSection, SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { btn, inputClass } from "@/components/admin/styles";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { cn } from "@/lib/cn";
import { projectCategories } from "@/lib/project-categories";
import { slugify } from "@/lib/slug";
import type { ProjectDetailGroup } from "@/types";
import { saveProject } from "./actions";

export type ProjectFormValues = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  details: ProjectDetailGroup[];
  image: string;
  imageAlt: string;
  gallery: { url: string; alt: string }[];
  categories: string[];
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  startDate: string;
  completedDate: string;
  featured: boolean;
  status: "draft" | "published";
  accent: "teal" | "blue" | "ember";
};

export const emptyProject: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  details: [],
  image: "",
  imageAlt: "",
  gallery: [],
  categories: [],
  technologies: [],
  liveUrl: "",
  githubUrl: "",
  startDate: "",
  completedDate: "",
  featured: false,
  status: "draft",
  accent: "ember",
};

export function ProjectForm({ id, initial }: { id: number | null; initial: ProjectFormValues }) {
  const { values, set, errors, pending, dirty, submit } = useAdminForm({
    initial,
    save: (data) => saveProject(id, data),
    redirectTo: (newId) => (id === null && newId ? `/admin/projects/${newId}` : undefined),
  });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));

  const updateTitle = (title: string) => {
    set("title", title);
    if (!slugEdited) set("slug", slugify(title));
  };

  const toggleCategory = (category: string) =>
    set(
      "categories",
      values.categories.includes(category)
        ? values.categories.filter((item) => item !== category)
        : [...values.categories, category],
    );

  const updateGroup = (index: number, patch: Partial<ProjectDetailGroup>) =>
    set(
      "details",
      values.details.map((group, i) => (i === index ? { ...group, ...patch } : group)),
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormSection title="Basics">
        <TextField label="Project title" required value={values.title} onChange={updateTitle} error={errors.title} maxLength={160} />
        <TextField
          label="Slug"
          required
          value={values.slug}
          onChange={(v) => {
            setSlugEdited(true);
            set("slug", v.toLowerCase().replace(/\s+/g, "-"));
          }}
          error={errors.slug}
          hint={`Page address: /projects/${values.slug || "your-project"}`}
        />
        <TextAreaField
          label="Short description"
          required
          value={values.summary}
          onChange={(v) => set("summary", v)}
          error={errors.summary}
          rows={3}
          maxLength={400}
          showCounter
          hint="Shown on project cards and used as the page's meta description."
        />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink-900">
            Categories <span className="text-ember-600" aria-hidden>*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {projectCategories.map((category) => {
              const checked = values.categories.includes(category.id);
              return (
                <label
                  key={category.id}
                  className={cn(
                    "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember-600",
                    checked ? "border-ink-900 bg-ink-900 text-white" : "border-line-strong bg-white text-ink-800 hover:border-ink-900",
                  )}
                >
                  <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleCategory(category.id)} />
                  {category.label}
                </label>
              );
            })}
          </div>
          {errors.categories ? <p className="mt-1.5 text-xs font-semibold text-ember-700">{errors.categories}</p> : null}
        </fieldset>
      </FormSection>

      <FormSection title="Images">
        <div className="grid gap-5 lg:grid-cols-2">
          <FileUpload label="Project image" value={values.image} onChange={(v) => set("image", v)} error={errors.image} />
          <TextAreaField
            label="Image alt text"
            value={values.imageAlt}
            onChange={(v) => set("imageAlt", v)}
            error={errors.imageAlt}
            rows={3}
            maxLength={200}
            hint="Describe what the image shows, e.g. “Screenshot of the Truckall homepage”."
          />
        </div>
        <GalleryEditor images={values.gallery} onChange={(v) => set("gallery", v)} errors={errors} />
      </FormSection>

      <FormSection title="Details">
        <MarkdownEditor label="Detailed content" value={values.content} onChange={(v) => set("content", v)} error={errors.content} rows={12} />
        <fieldset>
          <legend className="mb-1 text-sm font-semibold text-ink-900">Highlight sections</legend>
          <p className="mb-3 text-xs text-muted">Short headed lists shown in the project card pop-up and on the project page.</p>
          <div className="space-y-4">
            {values.details.map((group, index) => (
              <div key={index} className="rounded-2xl border border-line bg-canvas/50 p-4">
                <div className="flex items-start gap-2">
                  <input
                    value={group.heading}
                    onChange={(event) => updateGroup(index, { heading: event.target.value })}
                    placeholder="Section heading, e.g. QA focus areas"
                    aria-label={`Heading for section ${index + 1}`}
                    aria-invalid={errors[`details.${index}.heading`] ? true : undefined}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    className={cn(btn.icon, "mt-1 hover:text-ember-700")}
                    onClick={() => set("details", values.details.filter((_, i) => i !== index))}
                    aria-label={`Remove section ${index + 1}`}
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
                {errors[`details.${index}.heading`] ? (
                  <p className="mt-1 text-xs font-semibold text-ember-700">{errors[`details.${index}.heading`]}</p>
                ) : null}
                <div className="mt-3">
                  <ListEditor label="Points" items={group.items} onChange={(items) => updateGroup(index, { items })} addLabel="Add point" />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set("details", [...values.details, { heading: "", items: [""] }])}
            className={cn(btn.base, btn.secondary, "mt-3")}
          >
            <Plus aria-hidden className="size-4" />
            Add section
          </button>
        </fieldset>
        <TagInput label="Technologies" values={values.technologies} onChange={(v) => set("technologies", v)} error={errors.technologies} />
      </FormSection>

      <FormSection title="Links & dates">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Live URL" type="url" value={values.liveUrl} onChange={(v) => set("liveUrl", v)} error={errors.liveUrl} placeholder="https://" />
          <TextField label="GitHub URL" type="url" value={values.githubUrl} onChange={(v) => set("githubUrl", v)} error={errors.githubUrl} placeholder="https://github.com/…" />
          <TextField label="Start date" type="month" value={values.startDate} onChange={(v) => set("startDate", v)} error={errors.startDate} />
          <TextField label="Completion date" type="month" value={values.completedDate} onChange={(v) => set("completedDate", v)} error={errors.completedDate} />
        </div>
      </FormSection>

      <FormSection title="Publishing">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Status"
            value={values.status}
            onChange={(v) => set("status", v)}
            options={[
              { value: "draft", label: "Draft (not public)" },
              { value: "published", label: "Published" },
            ]}
          />
          <SelectField
            label="Accent color"
            value={values.accent}
            onChange={(v) => set("accent", v)}
            options={[
              { value: "ember", label: "Ember (orange)" },
              { value: "teal", label: "Mint (teal)" },
              { value: "blue", label: "Azure (blue)" },
            ]}
          />
        </div>
        <CheckboxField label="Featured project" hint="Featured projects are listed first." checked={values.featured} onChange={(v) => set("featured", v)} />
      </FormSection>

      <FormFooter pending={pending} dirty={dirty} cancelHref="/admin/projects" submitLabel={id === null ? "Create project" : "Save changes"} />
    </form>
  );
}
