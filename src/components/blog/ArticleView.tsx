import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronRight, Clock, RefreshCw, UserRound } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { formatDate } from "@/lib/format";
import { isOptimizableImage } from "@/lib/images";
import type { BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";
import { ShareLinks } from "./ShareLinks";

export function ArticleView({ post, url, related = [] }: { post: BlogPost; url: string; related?: BlogPost[] }) {
  const updatedLater =
    post.publishedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 24 * 60 * 60 * 1000;

  return (
    <>
      <article className="relative overflow-hidden pt-28 pb-16 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <div className="animate-drift absolute -top-32 -left-24 size-[26rem] rounded-full bg-ember-200/40 blur-3xl" />
          <div className="animate-drift-slow absolute top-10 -right-32 size-[26rem] rounded-full bg-azure-100/70 blur-3xl" />
        </div>

        <div className="container-page max-w-3xl">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-ink-950">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link href="/blog" className="hover:text-ink-950">
                  Blog
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="max-w-[16rem] truncate font-semibold text-ink-900 sm:max-w-sm">
                {post.title}
              </li>
            </ol>
          </nav>

          <header className="mt-8">
            {post.category ? (
              <Link
                href={`/blog?category=${encodeURIComponent(post.category)}`}
                className="inline-flex rounded-full bg-ember-50 px-3 py-1 text-xs font-bold tracking-wide text-ember-700 uppercase transition-colors hover:bg-ember-100"
              >
                {post.category}
              </Link>
            ) : null}
            <h1 className="mt-4 text-[2.1rem] leading-[1.1] font-extrabold sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 text-sm text-ink-700">
              {post.author ? (
                <li className="inline-flex items-center gap-1.5">
                  <UserRound aria-hidden className="size-4 text-subtle" />
                  {post.author}
                </li>
              ) : null}
              {post.publishedAt ? (
                <li className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden className="size-4 text-subtle" />
                  <span>
                    Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </span>
                </li>
              ) : null}
              {updatedLater ? (
                <li className="inline-flex items-center gap-1.5">
                  <RefreshCw aria-hidden className="size-4 text-subtle" />
                  <span>
                    Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </span>
                </li>
              ) : null}
              <li className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-4 text-subtle" />
                {post.readingMinutes} min read
              </li>
            </ul>
          </header>

          {post.featuredImage ? (
            <div className="relative mt-8 aspect-[1200/630] overflow-hidden rounded-panel bg-ink-900 shadow-soft ring-1 ring-line">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                fill
                priority
                sizes="(min-width: 768px) 720px, 100vw"
                unoptimized={!isOptimizableImage(post.featuredImage)}
                className="object-cover"
              />
            </div>
          ) : null}

          <Markdown className="mt-10">{post.body}</Markdown>

          {post.tags.length ? (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-700">
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <ShareLinks url={url} title={post.title} />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full text-sm font-bold text-ink-900 transition-colors hover:text-ember-600"
            >
              <ArrowLeft aria-hidden className="size-4" />
              Back to all articles
            </Link>
          </div>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t border-line bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 id="related-title" className="text-2xl font-extrabold sm:text-3xl">
              Related articles
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <BlogCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
