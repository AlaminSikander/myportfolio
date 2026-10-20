import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/types";

export function LatestPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <section id="blog" aria-labelledby="blog-title" className="section-pad relative bg-white">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="blog-title"
            eyebrow="From the blog"
            title={
              <>
                Notes on <span className="text-ember-600">quality, search &amp; operations</span>
              </>
            }
            description="Recent articles from my work in software testing, SEO, and team operations."
          />
          <ButtonLink href="/blog" variant="secondary" icon={<ArrowRight aria-hidden className="size-4" />} className="shrink-0 self-start lg:self-auto">
            View all articles
          </ButtonLink>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
