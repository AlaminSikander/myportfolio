"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { FileSearch, Loader2, Send } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";
import { FormFooter } from "@/components/admin/FormFooter";
import { TagInput } from "@/components/admin/ListEditor";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { Field, FormSection, TextAreaField, TextField } from "@/components/admin/fields";
import { btn, inputClass } from "@/components/admin/styles";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slug";
import { savePost } from "./actions";

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
};

export function PostForm({
  id,
  initial,
  categories,
  siteUrl,
}: {
  id: number | null;
  initial: PostFormValues;
  categories: string[];
  siteUrl: string;
}) {
  const listId = useId();
  const { values, set, errors, pending, dirty, submit } = useAdminForm({
    initial,
    save: (data) => savePost(id, data),
    redirectTo: (newId) => (id === null && newId ? `/admin/blog/${newId}` : undefined),
  });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));
  const published = initial.status === "published";

  const previewTitle = values.seoTitle || values.title || "Post title";
  const previewDescription = values.seoDescription || values.excerpt || "The excerpt is used when no meta description is set.";

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <FormSection title="Article">
            <TextField
              label="Title"
              required
              value={values.title}
              onChange={(v) => {
                set("title", v);
                if (!slugEdited) set("slug", slugify(v));
              }}
              error={errors.title}
              maxLength={160}
            />
            <TextField
              label="Slug"
              required
              value={values.slug}
              onChange={(v) => {
                setSlugEdited(true);
                set("slug", v.toLowerCase().replace(/\s+/g, "-"));
              }}
              error={errors.slug}
              hint={`URL: ${siteUrl}/blog/${values.slug || "your-article"}`}
            />
            <TextAreaField
              label="Excerpt"
              required
              value={values.excerpt}
              onChange={(v) => set("excerpt", v)}
              error={errors.excerpt}
              rows={3}
              maxLength={300}
              showCounter
              hint="A one or two sentence summary shown on blog cards."
            />
            <MarkdownEditor label="Body" required value={values.body} onChange={(v) => set("body", v)} error={errors.body} />
          </FormSection>

          <FormSection title="Search engine & social preview" description="Optional. When empty, the title and excerpt are used.">
            <TextField
              label="SEO title"
              value={values.seoTitle}
              onChange={(v) => set("seoTitle", v)}
              error={errors.seoTitle}
              maxLength={70}
              showCounter
              hint="Aim for 50–60 characters."
            />
            <TextAreaField
              label="Meta description"
              value={values.seoDescription}
              onChange={(v) => set("seoDescription", v)}
              error={errors.seoDescription}
              rows={2}
              maxLength={160}
              showCounter
              hint="Aim for 120–160 characters that describe the article honestly."
            />
            <div className="rounded-2xl border border-line bg-canvas/50 p-4" aria-label="Search result preview">
              <p className="text-xs text-muted">Search result preview</p>
              <p className="mt-2 truncate text-xs text-ink-700">
                {siteUrl.replace(/^https?:\/\//, "")} › blog › {values.slug || "your-article"}
              </p>
              <p className="truncate text-lg text-[#1a0dab]">{previewTitle}</p>
              <p className="line-clamp-2 text-sm text-ink-700">{previewDescription}</p>
            </div>
            <FileUpload
              label="Social share image (optional)"
              value={values.ogImage}
              onChange={(v) => set("ogImage", v)}
              error={errors.ogImage}
              hint="Recommended 1200×630. Defaults to the featured image."
              aspect="aspect-[1200/630]"
            />
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Publishing">
            <div>
              <p className="text-sm font-semibold text-ink-900">Status</p>
              <p className="mt-1 text-sm text-ink-800">{published ? "Published" : "Draft — not visible to visitors"}</p>
            </div>
            <TextField
              label="Publication date"
              type="date"
              value={values.publishedAt}
              onChange={(v) => set("publishedAt", v)}
              error={errors.publishedAt}
              hint="Leave empty to use the moment you publish. Dates more than a day ahead schedule the post."
            />
            <TextField label="Author" value={values.author} onChange={(v) => set("author", v)} error={errors.author} />
            <Field label="Category" error={errors.category}>
              {(props) => (
                <>
                  <input
                    {...props}
                    list={listId}
                    value={values.category}
                    onChange={(event) => set("category", event.target.value)}
                    className={inputClass}
                    placeholder="e.g. QA Testing"
                  />
                  <datalist id={listId}>
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </>
              )}
            </Field>
            <TagInput label="Tags" values={values.tags} onChange={(v) => set("tags", v)} error={errors.tags} max={12} />
          </FormSection>

          <FormSection title="Featured image">
            <FileUpload label="Image" value={values.featuredImage} onChange={(v) => set("featuredImage", v)} error={errors.featuredImage} />
            <TextAreaField
              label="Alt text"
              value={values.featuredImageAlt}
              onChange={(v) => set("featuredImageAlt", v)}
              error={errors.featuredImageAlt}
              rows={2}
              maxLength={200}
            />
          </FormSection>
        </div>
      </div>

      <FormFooter
        pending={pending}
        dirty={dirty}
        cancelHref="/admin/blog"
        submitLabel={published ? "Update post" : "Save draft"}
      >
        {id !== null ? (
          <Link href={`/admin/blog/${id}/preview`} className={cn(btn.base, btn.secondary)} title="Preview the last saved version">
            <FileSearch aria-hidden className="size-4" />
            Preview
          </Link>
        ) : null}
        {published ? (
          <button type="button" disabled={pending} onClick={() => submit(undefined, { status: "draft" })} className={cn(btn.base, btn.ghost)}>
            Unpublish
          </button>
        ) : (
          <button type="button" disabled={pending} onClick={() => submit(undefined, { status: "published" })} className={cn(btn.base, btn.dark)}>
            {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
            Publish
          </button>
        )}
      </FormFooter>
    </form>
  );
}
