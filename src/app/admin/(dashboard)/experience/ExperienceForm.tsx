"use client";

import { FormFooter } from "@/components/admin/FormFooter";
import { CheckboxField, FormSection, SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { ListEditor, TagInput } from "@/components/admin/ListEditor";
import { useAdminForm } from "@/components/admin/useAdminForm";
import type { ExperienceInput } from "@/lib/validation/admin";
import { saveExperience } from "./actions";

export type ExperienceFormValues = {
  jobTitle: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  accent: "teal" | "blue" | "ember";
  status: "draft" | "published";
};

export const emptyExperience: ExperienceFormValues = {
  jobTitle: "",
  company: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  summary: "",
  responsibilities: [],
  achievements: [],
  technologies: [],
  accent: "ember",
  status: "published",
};

const employmentTypes = [
  { value: "", label: "Not specified" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
  { value: "Remote", label: "Remote" },
] as const;

const accents = [
  { value: "ember", label: "Ember (orange)" },
  { value: "teal", label: "Mint (teal)" },
  { value: "blue", label: "Azure (blue)" },
] as const;

export function ExperienceForm({ id, initial }: { id: number | null; initial: ExperienceFormValues }) {
  const { values, set, errors, pending, dirty, submit } = useAdminForm({
    initial,
    save: (data) => saveExperience(id, data satisfies ExperienceInput),
    redirectTo: (newId) => (id === null && newId ? `/admin/experience/${newId}` : undefined),
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormSection title="Role">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Job title" required value={values.jobTitle} onChange={(v) => set("jobTitle", v)} error={errors.jobTitle} maxLength={160} />
          <TextField label="Company name" required value={values.company} onChange={(v) => set("company", v)} error={errors.company} maxLength={160} />
          <SelectField
            label="Employment type"
            value={values.employmentType}
            onChange={(v) => set("employmentType", v)}
            options={employmentTypes.some((t) => t.value === values.employmentType) ? employmentTypes : [...employmentTypes, { value: values.employmentType, label: values.employmentType }]}
            error={errors.employmentType}
          />
          <TextField label="Location" value={values.location} onChange={(v) => set("location", v)} error={errors.location} placeholder="e.g. Dhaka, Bangladesh or Remote" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Start date" type="month" required value={values.startDate} onChange={(v) => set("startDate", v)} error={errors.startDate} />
          <TextField
            label="End date"
            type="month"
            value={values.current ? "" : values.endDate}
            onChange={(v) => set("endDate", v)}
            error={errors.endDate}
            disabled={values.current}
            hint={values.current ? "Shown as “Present”." : undefined}
          />
        </div>
        <CheckboxField label="I currently work here" checked={values.current} onChange={(v) => set("current", v)} />
      </FormSection>

      <FormSection title="Details" description="Keep descriptions factual — only include work and results you can stand behind.">
        <TextAreaField label="Description" value={values.summary} onChange={(v) => set("summary", v)} error={errors.summary} rows={3} maxLength={600} showCounter />
        <ListEditor
          label="Responsibilities"
          items={values.responsibilities}
          onChange={(v) => set("responsibilities", v)}
          error={errors.responsibilities}
          hint="Each item becomes a bullet point. The first four are shown; the rest are behind “Show more”."
          addLabel="Add responsibility"
        />
        <ListEditor
          label="Achievements"
          items={values.achievements}
          onChange={(v) => set("achievements", v)}
          error={errors.achievements}
          hint="Optional. Leave empty if you prefer not to list specific achievements."
          addLabel="Add achievement"
        />
        <TagInput label="Technologies & tools used" values={values.technologies} onChange={(v) => set("technologies", v)} error={errors.technologies} />
      </FormSection>

      <FormSection title="Display">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Accent color" value={values.accent} onChange={(v) => set("accent", v)} options={accents} />
          <SelectField
            label="Visibility"
            value={values.status}
            onChange={(v) => set("status", v)}
            options={[
              { value: "published", label: "Shown on the portfolio" },
              { value: "draft", label: "Hidden (draft)" },
            ]}
          />
        </div>
      </FormSection>

      <FormFooter pending={pending} dirty={dirty} cancelHref="/admin/experience" submitLabel={id === null ? "Create experience" : "Save changes"} />
    </form>
  );
}
