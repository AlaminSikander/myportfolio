import type { ReactNode } from "react";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { getSettings } from "@/lib/content";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

/** Shared chrome for public pages: progress bar, navigation, footer, and back-to-top button. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <ScrollProgress />
      <Navbar shortName={settings.shortName} logoUrl={settings.logoUrl} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <BackToTop />
    </>
  );
}
