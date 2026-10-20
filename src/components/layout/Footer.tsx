import { Mail, Phone } from "lucide-react";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { LinkedInIcon } from "@/components/ui/Icons";
import { navItems, person } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative bg-ink-950 text-white">
      <div aria-hidden className="accent-line animate-shimmer h-1 w-full" />
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="#home" className="inline-flex items-center gap-2.5 rounded-lg">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white font-display text-base font-extrabold text-ink-950">
              A<span className="text-ember-600">.</span>
            </span>
            <span className="font-display text-lg font-extrabold">{person.name}</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{person.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-bold tracking-wider text-white uppercase">Navigate</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-white/65 transition-colors hover:text-ember-400">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold tracking-wider text-white uppercase">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${person.email}`}
                className="inline-flex items-center gap-2 text-white/65 transition-colors hover:text-ember-400"
              >
                <Mail aria-hidden className="size-4" />
                {person.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${person.phone}`}
                className="inline-flex items-center gap-2 text-white/65 transition-colors hover:text-ember-400"
              >
                <Phone aria-hidden className="size-4" />
                {person.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/65 transition-colors hover:text-ember-400"
              >
                <LinkedInIcon className="size-4" />
                LinkedIn profile
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 text-center text-sm text-white/50 sm:text-left">
          <p>
            © <CurrentYear /> {person.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
