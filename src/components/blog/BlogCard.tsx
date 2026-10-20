import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/format";
import { isOptimizableImage } from "@/lib/images";
import type { BlogPost } from "@/types";

export function BlogCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-ember-400 hover:shadow-lift">
      <div className="p-3 pb-0">
        <div className="relative aspect-[1200/630] overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-line">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              fill
              sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 92vw"
              priority={priority}
              unoptimized={!isOptimizableImage(post.featuredImage)}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-900 via-ink-800 to-ember-700">
              <div aria-hidden className="bg-grid-dark absolute inset-0" />
              <Newspaper aria-hidden className="relative size-10 text-white/70" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted">
          {post.category ? (
            <span className="rounded-full bg-ember-50 px-2.5 py-1 font-bold tracking-wide text-ember-700 uppercase">{post.category}</span>
          ) : null}
          {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> : null}
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {post.readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 text-xl font-extrabold">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:rounded-panel focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span aria-hidden className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ink-900 transition-colors group-hover:text-ember-600">
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
