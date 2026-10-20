import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { siteUrl } from "@/data/site";
import { requireAdmin } from "@/lib/auth/dal";
import { getSettings } from "@/lib/content";
import { getAllPostCategories } from "../categories";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  await requireAdmin();
  const [settings, categories] = await Promise.all([getSettings(), getAllPostCategories()]);
  return (
    <>
      <PageHeader title="New post" description="Posts are saved as private drafts until you publish them." backHref="/admin/blog" backLabel="Blog" />
      <PostForm
        id={null}
        siteUrl={siteUrl}
        categories={categories}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          body: "",
          featuredImage: "",
          featuredImageAlt: "",
          author: settings.name,
          category: "",
          tags: [],
          status: "draft",
          publishedAt: "",
          seoTitle: "",
          seoDescription: "",
          ogImage: "",
        }}
      />
    </>
  );
}
