import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { siteUrl } from "@/data/site";
import { getSettings } from "@/lib/content";
import { siteName } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const linkedin = settings.socialLinks.find((link) => link.platform === "linkedin");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.name}`,
    },
    description: settings.seoDescription,
    keywords: settings.seoKeywords,
    applicationName: siteName(settings),
    authors: [{ name: settings.name, url: linkedin?.url ?? siteUrl }],
    creator: settings.name,
    openGraph: {
      type: "website",
      siteName: siteName(settings),
      locale: "en_US",
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    icons: {
      icon: settings.faviconUrl ? [{ url: settings.faviconUrl }] : [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    formatDetection: { telephone: false },
    category: "portfolio",
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1230",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Skip to main content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
