import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Lock, Mail, Newspaper, Phone } from "lucide-react";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { SocialIcon } from "@/components/ui/Icons";
import { navItems } from "@/data/site";
import { isOptimizableImage } from "@/lib/images";
import type { SiteSettings } from "@/types";

const linkClass = "text-white/65 transition-colors hover:text-ember-400";

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative bg-ink-950 text-white">
      <div aria-hidden className="accent-line animate-shimmer h-1 w-full" />
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt=""
                width={36}
                height={36}
                unoptimized={!isOptimizableImage(settings.logoUrl)}
                className="size-9 rounded-xl bg-white object-contain"
              />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-xl bg-white font-display text-base font-extrabold text-ink-950">
                {settings.shortName.charAt(0)}
                <span className="text-ember-600">.</span>
              </span>
            )}
            <span className="font-display text-lg font-extrabold">{settings.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{settings.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-bold tracking-wider text-white uppercase">Navigate</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`/#${item.id}`} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/blog" className={`inline-flex items-center gap-1.5 ${linkClass}`}>
                <Newspaper aria-hidden className="size-3.5" />
                Blog
              </Link>
            </li>
            {settings.footerLinks.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                {isExternal(link.url) ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 ${linkClass}`}>
                    {link.label}
                    <ExternalLink aria-hidden className="size-3" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <a href={link.url} className={linkClass}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold tracking-wider text-white uppercase">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${settings.email}`} className={`inline-flex items-center gap-2 break-all ${linkClass}`}>
                <Mail aria-hidden className="size-4 shrink-0" />
                {settings.email}
              </a>
            </li>
            {settings.phone ? (
              <li>
                <a href={`tel:${settings.phone}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
                  <Phone aria-hidden className="size-4" />
                  {settings.phoneDisplay || settings.phone}
                </a>
              </li>
            ) : null}
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${linkClass}`}>
                  <SocialIcon platform={link.platform} className="size-4" />
                  {link.platform === "linkedin" ? "LinkedIn profile" : link.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-center text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © <CurrentYear /> {settings.name}. All rights reserved.
          </p>
          <Link
            href="/admin"
            rel="nofollow"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 self-center rounded-full px-2 text-white/50 transition-colors hover:text-ember-400 sm:self-auto"
          >
            <Lock aria-hidden className="size-3.5" />
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
