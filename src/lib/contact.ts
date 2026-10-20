import type { SiteSettings } from "@/types";

export function whatsappUrl(settings: Pick<SiteSettings, "phone" | "whatsappMessage">) {
  const number = settings.phone.replace(/\D/g, "");
  const text = settings.whatsappMessage ? `?text=${encodeURIComponent(settings.whatsappMessage)}` : "";
  return `https://wa.me/${number}${text}`;
}
