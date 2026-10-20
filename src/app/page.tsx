import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Overview } from "@/components/sections/Overview";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { person, seo, siteUrl } from "@/data/site";
import { experience } from "@/data/experience";
import { skillCategories } from "@/data/skills";

const currentJob = experience.find((job) => job.current);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: person.name,
      alternateName: person.shortName,
      url: siteUrl,
      image: `${siteUrl}${person.photo}`,
      email: `mailto:${person.email}`,
      telephone: person.phone,
      jobTitle: person.roles,
      description: seo.description,
      sameAs: [person.linkedin],
      address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
      ...(currentJob ? { worksFor: { "@type": "Organization", name: currentJob.company } } : {}),
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "IUBAT — International University of Business Agriculture and Technology",
      },
      knowsAbout: skillCategories.flatMap((category) => category.skills).slice(0, 30),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: `${person.name} — Portfolio`,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: seo.title,
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Overview />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
