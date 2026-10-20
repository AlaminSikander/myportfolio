import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper, Search, SearchX } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteUrl } from "@/data/site";
import { cn } from "@/lib/cn";
import { getBlogCategories, getPublishedPosts, getSettings } from "@/lib/content";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

const PER_PAGE = 9;

function readParams(params: Record<string, string | string[] | undefined>) {
  const q = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const category = typeof params.category === "string" ? params.category.slice(0, 60) : "";
  const page = Math.max(1, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);
  return { q, category, page };
}

function blogHref({ q, category, page }: { q?: string; category?: string; page?: number }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export async function generateMetadata({ searchParams }: PageProps<"/blog">): Promise<Metadata> {
  const [settings, params] = await Promise.all([getSettings(), searchParams]);
  const { q, category, page } = readParams(params);
  const base = pageMetadata({
    settings,
    title: category ? `${category} Articles` : "Blog",
    description: `Articles by ${settings.name} on software quality assurance, testing, SEO, and operations.`,
    path: blogHref({ category, page }),
  });
  // Search result pages are useful for visitors but should not be indexed.
  return q ? { ...base, robots: { index: false, follow: true } } : base;
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { q, category, page } = readParams(await searchParams);
  const [{ posts, total, page: current, pageCount }, categories] = await Promise.all([
    getPublishedPosts({ query: q, category, page, perPage: PER_PAGE }),
    getBlogCategories(),
  ]);
  const filtered = Boolean(q || category);

  const jsonLd = graph(
    {
      "@type": "Blog",
      "@id": `${siteUrl}/blog#blog`,
      url: `${siteUrl}/blog`,
      name: "Blog",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <SiteShell>
        <section aria-labelledby="blog-heading" className="relative overflow-hidden pt-28 pb-10 sm:pt-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
            <div className="animate-drift absolute -top-32 -left-24 size-[26rem] rounded-full bg-ember-200/40 blur-3xl" />
            <div className="animate-drift-slow absolute top-10 -right-32 size-[26rem] rounded-full bg-azure-100/70 blur-3xl" />
          </div>
          <div className="container-page">
            <p className="eyebrow text-ember-600">
              <span aria-hidden className="h-px w-8 bg-ember-500" />
              Blog
            </p>
            <h1 id="blog-heading" className="mt-4 max-w-3xl text-4xl leading-[1.1] font-extrabold sm:text-5xl">
              {category ? (
                <>
                  Articles on <span className="text-ember-600">{category}</span>
                </>
              ) : (
                <>
                  Notes on quality, search <span className="text-ember-600">&amp; operations</span>
                </>
              )}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              Practical writing on software testing, technical SEO, and keeping projects running smoothly.
            </p>

            <Form action="/blog" role="search" className="mt-8 flex max-w-xl gap-2">
              {category ? <input type="hidden" name="category" value={category} /> : null}
              <div className="relative flex-1">
                <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search articles"
                  aria-label="Search articles"
                  className="block min-h-12 w-full rounded-full border border-line-strong bg-white pr-4 pl-11 text-ink-950 shadow-soft transition-colors placeholder:text-subtle hover:border-ink-600 focus:border-ink-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="min-h-12 rounded-full bg-ink-900 px-6 font-display text-sm font-bold text-white transition-colors hover:bg-ink-700"
              >
                Search
              </button>
            </Form>

            {categories.length ? (
              <nav aria-label="Blog categories" className="mt-6">
                <ul className="flex flex-wrap gap-2">
                  {["", ...categories].map((item) => {
                    const active = item === category;
                    return (
                      <li key={item || "all"}>
                        <Link
                          href={blogHref({ q, category: item })}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors",
                            active ? "bg-ink-900 text-white shadow-soft" : "border border-line bg-white text-ink-700 hover:border-ink-900 hover:text-ink-950",
                          )}
                        >
                          {item || "All articles"}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}
          </div>
        </section>

        <section aria-label="Articles" className="pb-20 sm:pb-24">
          <div className="container-page">
            <p className="sr-only" aria-live="polite">
              {total} {total === 1 ? "article" : "articles"} found
            </p>
            {filtered && total > 0 ? (
              <p className="mb-6 text-sm text-muted">
                {total} {total === 1 ? "article" : "articles"}
                {q ? (
                  <>
                    {" "}
                    matching &ldquo;<span className="font-semibold text-ink-900">{q}</span>&rdquo;
                  </>
                ) : null}
                {" · "}
                <Link href="/blog" className="font-semibold text-ink-900 underline-offset-2 hover:underline">
                  Clear filters
                </Link>
              </p>
            ) : null}

            {posts.length ? (
              <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => (
                  <li key={post.id}>
                    <BlogCard post={post} priority={index < 3 && current === 1} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-ember-50 text-ember-600">
                  {filtered ? <SearchX aria-hidden className="size-7" /> : <Newspaper aria-hidden className="size-7" />}
                </span>
                <h2 className="mt-5 text-xl font-extrabold">{filtered ? "No articles found" : "Articles are coming soon"}</h2>
                <p className="mt-2 text-muted">
                  {filtered
                    ? "Try a different search term or browse all articles."
                    : "There are no published articles yet. Check back soon, or get in touch in the meantime."}
                </p>
                <Link
                  href={filtered ? "/blog" : "/#contact"}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ember-600 px-5 font-display text-sm font-bold text-white shadow-glow transition-colors hover:bg-ember-700"
                >
                  {filtered ? "View all articles" : "Get in touch"}
                </Link>
              </div>
            )}

            {pageCount > 1 ? (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
                {current > 1 ? (
                  <Link href={blogHref({ q, category, page: current - 1 })} rel="prev" className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line bg-white px-4 text-sm font-semibold hover:border-ink-900">
                    <ChevronLeft aria-hidden className="size-4" />
                    Newer
                  </Link>
                ) : null}
                <ol className="flex items-center gap-1">
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                    <li key={number}>
                      <Link
                        href={blogHref({ q, category, page: number })}
                        aria-current={number === current ? "page" : undefined}
                        aria-label={`Page ${number}`}
                        className={cn(
                          "grid size-11 place-items-center rounded-full text-sm font-bold transition-colors",
                          number === current ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-white",
                        )}
                      >
                        {number}
                      </Link>
                    </li>
                  ))}
                </ol>
                {current < pageCount ? (
                  <Link href={blogHref({ q, category, page: current + 1 })} rel="next" className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line bg-white px-4 text-sm font-semibold hover:border-ink-900">
                    Older
                    <ChevronRight aria-hidden className="size-4" />
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </section>
      </SiteShell>
    </>
  );
}
