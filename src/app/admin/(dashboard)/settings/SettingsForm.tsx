"use client";

import { Plus, Trash2 } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";
import { FormFooter } from "@/components/admin/FormFooter";
import { TagInput } from "@/components/admin/ListEditor";
import { FormSection, TextAreaField, TextField } from "@/components/admin/fields";
import { btn, inputClass } from "@/components/admin/styles";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { cn } from "@/lib/cn";
import type { SiteSettings, SocialPlatform } from "@/types";
import { saveSettings } from "./actions";

const platforms: { value: SocialPlatform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "x", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
];

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const { values, set, errors, pending, dirty, submit } = useAdminForm({
    initial,
    save: (data) => saveSettings(data),
  });

  const updateSocial = (index: number, patch: Partial<SiteSettings["socialLinks"][number]>) =>
    set(
      "socialLinks",
      values.socialLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    );

  const updateFooter = (index: number, patch: Partial<SiteSettings["footerLinks"][number]>) =>
    set(
      "footerLinks",
      values.footerLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormSection title="Profile">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Full name" required value={values.name} onChange={(v) => set("name", v)} error={errors.name} />
          <TextField label="Short name" required value={values.shortName} onChange={(v) => set("shortName", v)} error={errors.shortName} hint="Used in the header and compact places." />
        </div>
        <TagInput label="Professional titles" values={values.roles} onChange={(v) => set("roles", v)} error={errors.roles} hint="Used in structured data for search engines." max={6} />
        <TextField label="Role line" required value={values.roleLine} onChange={(v) => set("roleLine", v)} error={errors.roleLine} hint="Shown above the main heading, e.g. “Software QA Engineer | SEO | Operations”." />
        <TextAreaField label="Tagline" required value={values.tagline} onChange={(v) => set("tagline", v)} error={errors.tagline} rows={2} maxLength={300} showCounter hint="Shown in the footer." />
        <TextAreaField
          label="About section"
          required
          value={values.about}
          onChange={(v) => set("about", v)}
          error={errors.about}
          rows={10}
          hint="Separate paragraphs with a blank line. Wrap words in **double asterisks** to make them bold."
        />
        <TagInput label="Soft skills" values={values.softSkills} onChange={(v) => set("softSkills", v)} error={errors.softSkills} hint="Shown as chips in the About section." max={20} />
        <div className="grid gap-5 lg:grid-cols-2">
          <FileUpload label="Profile photo" value={values.photo} onChange={(v) => set("photo", v)} error={errors.photo} aspect="aspect-[4/5] max-w-56" />
          <FileUpload label="Resume / CV (PDF)" kind="document" value={values.cvUrl} onChange={(v) => set("cvUrl", v)} error={errors.cvUrl} />
        </div>
      </FormSection>

      <FormSection title="Contact">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Email" type="email" required value={values.email} onChange={(v) => set("email", v)} error={errors.email} />
          <TextField label="Location" value={values.location} onChange={(v) => set("location", v)} error={errors.location} />
          <TextField label="Phone (international format)" type="tel" value={values.phone} onChange={(v) => set("phone", v)} error={errors.phone} hint="Used for tel: and WhatsApp links, e.g. +8801725104909." />
          <TextField label="Phone (display)" value={values.phoneDisplay} onChange={(v) => set("phoneDisplay", v)} error={errors.phoneDisplay} hint="How the number is shown, e.g. +880 1725 104909." />
        </div>
        <TextAreaField label="WhatsApp pre-filled message" value={values.whatsappMessage} onChange={(v) => set("whatsappMessage", v)} error={errors.whatsappMessage} rows={2} maxLength={500} />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink-900">Social links</legend>
          <ul className="space-y-3">
            {values.socialLinks.map((link, index) => (
              <li key={index} className="grid gap-2 rounded-2xl border border-line bg-canvas/50 p-3 sm:grid-cols-[9rem_1fr_1.4fr_auto] sm:items-start">
                <select
                  value={link.platform}
                  onChange={(event) => updateSocial(index, { platform: event.target.value as SocialPlatform })}
                  aria-label={`Platform for social link ${index + 1}`}
                  className={inputClass}
                >
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                <div>
                  <input value={link.label} onChange={(event) => updateSocial(index, { label: event.target.value })} placeholder="Label, e.g. in/your-name" aria-label={`Label for social link ${index + 1}`} aria-invalid={errors[`socialLinks.${index}.label`] ? true : undefined} className={inputClass} />
                  {errors[`socialLinks.${index}.label`] ? <p className="mt-1 text-xs font-semibold text-ember-700">{errors[`socialLinks.${index}.label`]}</p> : null}
                </div>
                <div>
                  <input value={link.url} onChange={(event) => updateSocial(index, { url: event.target.value })} placeholder="https://" aria-label={`URL for social link ${index + 1}`} aria-invalid={errors[`socialLinks.${index}.url`] ? true : undefined} className={inputClass} />
                  {errors[`socialLinks.${index}.url`] ? <p className="mt-1 text-xs font-semibold text-ember-700">{errors[`socialLinks.${index}.url`]}</p> : null}
                </div>
                <button type="button" className={cn(btn.icon, "mt-1 hover:text-ember-700")} onClick={() => set("socialLinks", values.socialLinks.filter((_, i) => i !== index))} aria-label={`Remove social link ${index + 1}`}>
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => set("socialLinks", [...values.socialLinks, { platform: "website", label: "", url: "" }])} className={cn(btn.base, btn.secondary, "mt-3")}>
            <Plus aria-hidden className="size-4" />
            Add social link
          </button>
        </fieldset>
      </FormSection>

      <FormSection title="SEO defaults" description="Used for the home page and as fallbacks across the site.">
        <TextField label="Default page title" required value={values.seoTitle} onChange={(v) => set("seoTitle", v)} error={errors.seoTitle} maxLength={120} showCounter />
        <TextAreaField label="Default meta description" required value={values.seoDescription} onChange={(v) => set("seoDescription", v)} error={errors.seoDescription} rows={3} maxLength={200} showCounter hint="Aim for 120–160 characters." />
        <TagInput label="Keywords" values={values.seoKeywords} onChange={(v) => set("seoKeywords", v)} error={errors.seoKeywords} max={20} hint="A few relevant phrases. Search engines give these little weight; avoid stuffing." />
        <FileUpload label="Default social share image (optional)" value={values.ogImageUrl} onChange={(v) => set("ogImageUrl", v)} error={errors.ogImageUrl} hint="Recommended 1200×630. When empty, a branded image is generated automatically." aspect="aspect-[1200/630]" />
      </FormSection>

      <FormSection title="Branding">
        <div className="grid gap-5 lg:grid-cols-2">
          <FileUpload label="Site logo (optional)" value={values.logoUrl} onChange={(v) => set("logoUrl", v)} error={errors.logoUrl} hint="Replaces the “A.” mark in the header and footer. A square image works best." aspect="aspect-square max-w-40" />
          <FileUpload label="Favicon (optional)" kind="icon" value={values.faviconUrl} onChange={(v) => set("faviconUrl", v)} error={errors.faviconUrl} hint="When empty, the built-in icon is used." />
        </div>
      </FormSection>

      <FormSection title="Footer links" description="Extra links shown in the footer. Blog, Admin Login, navigation, and contact links are always included.">
        <ul className="space-y-3">
          {values.footerLinks.map((link, index) => (
            <li key={index} className="grid gap-2 rounded-2xl border border-line bg-canvas/50 p-3 sm:grid-cols-[1fr_1.6fr_auto] sm:items-start">
              <div>
                <input value={link.label} onChange={(event) => updateFooter(index, { label: event.target.value })} placeholder="Label" aria-label={`Label for footer link ${index + 1}`} aria-invalid={errors[`footerLinks.${index}.label`] ? true : undefined} className={inputClass} />
                {errors[`footerLinks.${index}.label`] ? <p className="mt-1 text-xs font-semibold text-ember-700">{errors[`footerLinks.${index}.label`]}</p> : null}
              </div>
              <div>
                <input value={link.url} onChange={(event) => updateFooter(index, { url: event.target.value })} placeholder="https://… or /blog" aria-label={`URL for footer link ${index + 1}`} aria-invalid={errors[`footerLinks.${index}.url`] ? true : undefined} className={inputClass} />
                {errors[`footerLinks.${index}.url`] ? <p className="mt-1 text-xs font-semibold text-ember-700">{errors[`footerLinks.${index}.url`]}</p> : null}
              </div>
              <button type="button" className={cn(btn.icon, "mt-1 hover:text-ember-700")} onClick={() => set("footerLinks", values.footerLinks.filter((_, i) => i !== index))} aria-label={`Remove footer link ${index + 1}`}>
                <Trash2 aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => set("footerLinks", [...values.footerLinks, { label: "", url: "" }])} className={cn(btn.base, btn.secondary, "w-fit")}>
          <Plus aria-hidden className="size-4" />
          Add footer link
        </button>
      </FormSection>

      <FormFooter pending={pending} dirty={dirty} submitLabel="Save settings" />
    </form>
  );
}
