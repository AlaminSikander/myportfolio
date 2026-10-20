"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";
import { ToastProvider } from "./Toast";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const COLLAPSE_KEY = "admin-sidebar-collapsed";
const COLLAPSE_EVENT = "admin-sidebar-collapse";

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                active ? "bg-white text-ink-950 shadow-soft" : "text-white/70 hover:bg-white/10 hover:text-white",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon aria-hidden className={cn("size-5 shrink-0", active && "text-ember-600")} />
              <span className={cn(collapsed && "sr-only")}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarFooter({ collapsed, email }: { collapsed: boolean; email: string }) {
  return (
    <div className="space-y-1 border-t border-white/10 pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        title={collapsed ? "View website" : undefined}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white",
          collapsed && "justify-center px-0",
        )}
      >
        <ExternalLink aria-hidden className="size-5 shrink-0" />
        <span className={cn(collapsed && "sr-only")}>View website</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <form action={logout}>
        <button
          type="submit"
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut aria-hidden className="size-5 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>Log out</span>
        </button>
      </form>
      {!collapsed ? <p className="truncate px-3 pt-2 text-xs text-white/45">Signed in as {email}</p> : null}
    </div>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className={cn("flex items-center gap-2.5 rounded-lg text-white", collapsed && "justify-center")}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white font-display text-base font-extrabold text-ink-950">
        A<span className="text-ember-600">.</span>
      </span>
      <span className={cn("font-display text-base font-extrabold", collapsed && "sr-only")}>Portfolio Admin</span>
    </Link>
  );
}

function subscribeToCollapse(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(COLLAPSE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(COLLAPSE_EVENT, onChange);
  };
}

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribeToCollapse,
    () => window.localStorage.getItem(COLLAPSE_KEY) === "1",
    () => false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "0" : "1");
    window.dispatchEvent(new Event(COLLAPSE_EVENT));
  };

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-canvas">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden flex-col bg-ink-950 p-4 transition-[width] duration-300 lg:flex",
            collapsed ? "w-[4.75rem]" : "w-64",
          )}
          aria-label="Admin navigation"
        >
          <div className={cn("flex items-center justify-between gap-2 pb-6", collapsed && "flex-col")}>
            <Brand collapsed={collapsed} />
            <button
              type="button"
              onClick={toggleCollapsed}
              className="grid size-9 place-items-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              {collapsed ? <PanelLeftOpen aria-hidden className="size-5" /> : <PanelLeftClose aria-hidden className="size-5" />}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto" aria-label="Admin sections">
            <NavLinks collapsed={collapsed} />
          </nav>
          <SidebarFooter collapsed={collapsed} email={email} />
        </aside>

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink-900"
            aria-label="Open admin menu"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-nav"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <span className="font-display font-extrabold text-ink-950">Portfolio Admin</span>
          <span className="size-11" aria-hidden />
        </header>

        <AnimatePresence>
          {mobileOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                id="admin-mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="Admin menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-ink-950 p-4"
              >
                <div className="flex items-center justify-between pb-6">
                  <Brand collapsed={false} />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="grid size-10 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                    aria-label="Close admin menu"
                    autoFocus
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto" aria-label="Admin sections">
                  <NavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
                </nav>
                <SidebarFooter collapsed={false} email={email} />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[4.75rem]" : "lg:pl-64")}>
          <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
