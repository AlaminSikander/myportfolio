import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "dark" | "light" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-display font-bold whitespace-nowrap transition-all duration-300 ease-out focus-visible:outline-offset-4 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-ember-600 text-white shadow-glow hover:-translate-y-0.5 hover:bg-ember-700",
  secondary: "border border-line-strong bg-white text-ink-900 shadow-soft hover:-translate-y-0.5 hover:border-ink-900",
  dark: "bg-ink-900 text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink-800",
  light: "bg-white text-ink-950 shadow-soft hover:-translate-y-0.5 hover:bg-ember-50",
  ghost: "text-ink-900 hover:text-ember-600",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-6 text-[0.95rem]",
};

const chipStyles: Record<Variant, string> = {
  primary: "bg-white/20 text-white",
  secondary: "bg-ink-900 text-white",
  dark: "bg-white/15 text-white",
  light: "bg-ember-600 text-white",
  ghost: "bg-ember-50 text-ember-600",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconChip?: boolean;
  external?: boolean;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconChip = false,
  external = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const iconNode = icon ?? <ArrowUpRight aria-hidden className="size-4" />;
  return (
    <a
      href={href}
      className={cn(base, variants[variant], sizes[size], iconChip && "pr-2", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <span>{children}</span>
      {iconChip ? (
        <span
          className={cn(
            "grid size-8 place-items-center rounded-full transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-rotate-12",
            chipStyles[variant],
          )}
        >
          {iconNode}
        </span>
      ) : (
        <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
          {iconNode}
        </span>
      )}
    </a>
  );
}
