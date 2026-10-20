import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slug";

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

const components: Components = {
  // The page already has its own <h1>, so Markdown headings start at <h2>.
  h1: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  a: ({ href = "", children }) =>
    isInternal(href) ? (
      <a href={href}>{children}</a>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ),
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element -- inline article images have unknown dimensions
      <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
    ) : null,
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

/** Renders untrusted Markdown safely: raw HTML is not parsed and the output is sanitized. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-article", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
