import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/layout/SiteShell";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { Overview } from "@/components/sections/Overview";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { siteUrl } from "@/data/site";
import { getExperiences, getLatestPosts, getProjects, getSettings, getSkillCategories } from "@/lib/content";
import { graph, pageMetadata, personJsonLd, siteName, websiteJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: settings.seoTitle,
    absoluteTitle: true,
    description: settings.seoDescription,
    path: "/",
    type: "profile",
  });
}

export default async function Home() {
  const [settings, experiences, skills, projects, latestPosts] = await Promise.all([
    getSettings(),
    getExperiences(),
    getSkillCategories(),
    getProjects(),
    getLatestPosts(3),
  ]);

  const jsonLd = graph(personJsonLd(settings, experiences, skills), websiteJsonLd(settings), {
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    url: siteUrl,
    name: siteName(settings),
    mainEntity: { "@id": `${siteUrl}/#person` },
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <SiteShell>
        <Hero settings={settings} current={experiences.find((job) => job.current)} projectCount={projects.length} />
        <Overview />
        <About about={settings.about} softSkills={settings.softSkills} />
        <Experience experience={experiences} />
        <Skills categories={skills} />
        <Projects projects={projects} />
        <Education />
        {latestPosts.length ? <LatestPosts posts={latestPosts} /> : null}
        <Contact settings={settings} />
      </SiteShell>
    </>
  );
}
