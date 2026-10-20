"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { LinkedInIcon, WhatsAppIcon } from "@/components/ui/Icons";

const linkClass =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-sm font-semibold text-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-950";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: LinkedInIcon },
    { label: "X", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`, icon: Share2 },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Share2 },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: WhatsAppIcon },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="mr-1 text-sm font-bold text-ink-900">Share</p>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={`Share on ${link.label} (opens in a new tab)`}
        >
          <link.icon aria-hidden className="size-4" />
          {link.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={linkClass}>
        {copied ? <Check aria-hidden className="size-4 text-mint-600" /> : <Link2 aria-hidden className="size-4" />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
