"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems } from "@/data/site";
import { cn } from "@/lib/cn";
import { isOptimizableImage } from "@/lib/images";

type NavLink = { key: string; label: string; href: string; sectionId?: string };

export function Navbar({ shortName, logoUrl }: { shortName: string; logoUrl?: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingTarget = useRef<string | null>(null);

  const links: NavLink[] = navItems.flatMap((item) => {
    const link = { key: item.id, label: item.label, href: isHome ? `#${item.id}` : `/#${item.id}`, sectionId: item.id };
    return item.id === "contact" ? [{ key: "blog", label: "Blog", href: "/blog" }, link] : [link];
  });
  const activeKey = isHome ? active : pathname.startsWith("/blog") ? "blog" : "";
  const contactHref = isHome ? "#contact" : "/#contact";

  // Closing the menu animates the header, which cancels a native smooth scroll,
  // so mobile links defer scrolling until the exit animation has finished.
  const navigateFromMenu = (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (!isHome || !link.sectionId) {
      setOpen(false);
      return;
    }
    event.preventDefault();
    pendingTarget.current = link.sectionId;
    setOpen(false);
  };

  const scrollToPendingTarget = () => {
    const id = pendingTarget.current;
    pendingTarget.current = null;
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
    window.history.pushState(null, "", `#${id}`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-line/80 bg-white/85 shadow-[0_6px_24px_-12px_rgb(11_18_48/0.18)] backdrop-blur-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <a
          href={isHome ? "#home" : "/"}
          className="group flex items-center gap-2.5 rounded-lg"
          aria-label={isHome ? `${shortName} — back to top` : `${shortName} — home`}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={36}
              height={36}
              unoptimized={!isOptimizableImage(logoUrl)}
              className="size-9 rounded-xl object-contain transition-transform duration-300 group-hover:-rotate-6"
            />
          ) : (
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-xl bg-ink-900 font-display text-base font-extrabold text-white transition-transform duration-300 group-hover:-rotate-6"
            >
              {shortName.charAt(0)}
              <span className="text-ember-400">.</span>
            </span>
          )}
          <span className="font-display text-lg font-extrabold tracking-tight text-ink-950">
            {shortName}
            <span className="text-ember-600">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive = activeKey === (link.sectionId ?? link.key);
            const className = cn(
              "relative rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:px-3.5",
              isActive ? "text-ink-950" : "text-muted hover:text-ink-950",
            );
            const content = (
              <>
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-ink-900/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                {link.label}
              </>
            );
            return (
              <li key={link.key}>
                {link.sectionId ? (
                  <a href={link.href} aria-current={isActive ? "true" : undefined} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link href={link.href} aria-current={isActive ? "page" : undefined} className={className}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={contactHref}
            className="group hidden items-center gap-1.5 rounded-full bg-ember-600 py-2.5 pr-2.5 pl-4.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-700 sm:inline-flex"
          >
            Let&apos;s Talk
            <span className="grid size-6 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight aria-hidden className="size-3.5" />
            </span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink-900 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence onExitComplete={scrollToPendingTarget}>
        {open ? (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <ul className="container-page flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto py-4">
              {links.map((link, index) => {
                const isActive = activeKey === (link.sectionId ?? link.key);
                return (
                  <motion.li
                    key={link.key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index + 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={(event) => navigateFromMenu(event, link)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-xl px-4 font-display text-base font-semibold transition-colors",
                        isActive ? "bg-ember-50 text-ember-700" : "text-ink-900 hover:bg-canvas",
                      )}
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden className="size-4 opacity-50" />
                    </a>
                  </motion.li>
                );
              })}
              <li className="pt-2 sm:hidden">
                <a
                  href={contactHref}
                  onClick={(event) =>
                    navigateFromMenu(event, { key: "contact", label: "Contact", href: contactHref, sectionId: "contact" })
                  }
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ember-600 font-display font-bold text-white"
                >
                  Let&apos;s Talk <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
