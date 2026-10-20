"use client";

import { useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter";
import { FormSection, SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { iconOptions } from "@/lib/icons";
import { slugify } from "@/lib/slug";
import { proficiencyLevels } from "@/lib/validation/admin";
import { saveSkill, saveSkillCategory } from "./actions";

const accents = [
  { value: "ember", label: "Ember (orange)" },
  { value: "teal", label: "Mint (teal)" },
  { value: "blue", label: "Azure (blue)" },
] as const;

export type SkillCategoryFormValues = {
  label: string;
  slug: string;
  description: string;
  accent: "teal" | "blue" | "ember";
  icon: string;
};

export function SkillCategoryForm({ id, initial }: { id: number | null; initial: SkillCategoryFormValues }) {
  const { values, set, errors, pending, dirty, submit } = useAdminForm({
    initial,
    save: (data) => saveSkillCategory(id, data),
    redirectTo: () => "/admin/skills",
  });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormSection title="Category">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Category name"
            required
            value={values.label}
            onChange={(v) => {
              set("label", v);
              if (!slugEdited) set("slug", slugify(v));
            }}
            error={errors.label}
            placeholder="e.g. API Testing"
          />
          <TextField
            label="Identifier"
            required
            value={values.slug}
            onChange={(v) => {
              setSlugEdited(true);
              set("slug", v.toLowerCase().replace(/\s+/g, "-"));
            }}
            error={errors.slug}
            hint="Used internally for the tab; lowercase letters and hyphens."
          />
        </div>
        <TextAreaField label="Description" value={values.description} onChange={(v) => set("description", v)} error={errors.description} rows={2} maxLength={300} showCounter />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Icon" value={values.icon} onChange={(v) => set("icon", v)} options={iconOptions.map((o) => ({ value: o.id, label: o.label }))} />
          <SelectField label="Accent color" value={values.accent} onChange={(v) => set("accent", v)} options={accents} />
        </div>
      </FormSection>
      <FormFooter pending={pending} dirty={dirty} cancelHref="/admin/skills" submitLabel={id === null ? "Create category" : "Save changes"} />
    </form>
  );
}

export type SkillFormValues = {
  name: string;
  categoryId: number;
  icon: string;
  proficiency: string;
};

export function SkillForm({
  id,
  initial,
  categories,
}: {
  id: number | null;
  initial: SkillFormValues;
  categories: { id: number; label: string }[];
}) {
  const { values, set, errors, pending, dirty, submit } = useAdminForm({
    initial,
    save: (data) => saveSkill(id, { ...data, proficiency: data.proficiency as "" }),
    redirectTo: () => "/admin/skills",
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormSection title="Skill">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Skill name" required value={values.name} onChange={(v) => set("name", v)} error={errors.name} maxLength={80} />
          <SelectField
            label="Category"
            required
            value={String(values.categoryId)}
            onChange={(v) => set("categoryId", Number(v))}
            options={categories.map((category) => ({ value: String(category.id), label: category.label }))}
            error={errors.categoryId}
          />
          <SelectField
            label="Icon (optional)"
            value={values.icon}
            onChange={(v) => set("icon", v)}
            options={[{ value: "", label: "None — use a colored dot" }, ...iconOptions.map((o) => ({ value: o.id, label: o.label }))]}
          />
          <SelectField
            label="Proficiency level (optional)"
            value={values.proficiency}
            onChange={(v) => set("proficiency", v)}
            options={[{ value: "", label: "Not shown" }, ...proficiencyLevels.map((level) => ({ value: level, label: level }))]}
            hint="Leave as “Not shown” unless you want to display a self-assessed level."
          />
        </div>
      </FormSection>
      <FormFooter pending={pending} dirty={dirty} cancelHref="/admin/skills" submitLabel={id === null ? "Add skill" : "Save changes"} />
    </form>
  );
}
