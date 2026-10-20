import { ArrowUpRight, Mail } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SocialIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappUrl } from "@/lib/contact";
import type { SiteSettings, SocialPlatform } from "@/types";

type Channel = {
  label: string;
  value: string;
  href: string;
  icon: "mail" | "whatsapp" | SocialPlatform;
  external: boolean;
  tone: string;
};

function ChannelIcon({ icon }: { icon: Channel["icon"] }) {
  if (icon === "mail") return <Mail aria-hidden className="size-5" />;
  if (icon === "whatsapp") return <WhatsAppIcon className="size-5" />;
  return <SocialIcon platform={icon} className="size-5" />;
}

function contactChannels(settings: SiteSettings): Channel[] {
  const channels: Channel[] = [
    { label: "Email", value: settings.email, href: `mailto:${settings.email}`, icon: "mail", external: false, tone: "bg-ember-600" },
  ];
  if (settings.phone) {
    channels.push({
      label: "WhatsApp",
      value: settings.phoneDisplay || settings.phone,
      href: whatsappUrl(settings),
      icon: "whatsapp",
      external: true,
      tone: "bg-[#1da851]",
    });
  }
  for (const link of settings.socialLinks) {
    channels.push({
      label: link.platform === "linkedin" ? "LinkedIn" : link.label,
      value: link.platform === "linkedin" ? link.label : link.url.replace(/^https?:\/\/(www\.)?/, ""),
      href: link.url,
      icon: link.platform,
      external: true,
      tone: link.platform === "linkedin" ? "bg-azure-600" : "bg-ink-700",
    });
  }
  return channels;
}

export function Contact({ settings }: { settings: SiteSettings }) {
  const channels = contactChannels(settings);
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-ink-950 py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="animate-drift absolute -top-32 -left-24 size-[30rem] rounded-full bg-ember-600/25 blur-3xl" />
        <div className="animate-drift-slow absolute -right-24 -bottom-40 size-[30rem] rounded-full bg-azure-600/25 blur-3xl" />
      </div>

      <div className="container-page relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            tone="dark"
            eyebrow="Contact"
            title="Have a project or opportunity in mind?"
            description="Let's connect and discuss how my experience in software quality assurance, SEO, and operations can support your goals."
          />

          <RevealGroup as="ul" className="mt-10 space-y-3">
            {channels.map((channel) => {
              return (
                <RevealItem as="li" key={`${channel.label}-${channel.href}`}>
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={`${channel.label}: ${channel.value}${channel.external ? " (opens in a new tab)" : ""}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
                  >
                    <span className={`grid size-12 shrink-0 place-items-center rounded-xl text-white ${channel.tone}`}>
                      <ChannelIcon icon={channel.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold tracking-wider text-white/50 uppercase">
                        {channel.label}
                      </span>
                      <span className="block truncate font-display font-bold text-white sm:text-lg">
                        {channel.value}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember-400"
                    />
                  </a>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <Reveal delay={0.1} className="rounded-panel bg-white p-6 shadow-lift sm:p-9">
          <h3 className="text-xl font-extrabold sm:text-2xl">Send a message</h3>
          <p className="mt-1.5 mb-7 text-sm text-muted">Share a few details and I&apos;ll reply by email.</p>
          <ContactForm email={settings.email} />
        </Reveal>
      </div>
    </section>
  );
}
