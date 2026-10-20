import type { NavItem, SiteSettings } from "@/types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Initial portfolio settings. After seeding, the database (managed at /admin/settings) is the source of truth;
 * these values remain as the fallback when no database is configured.
 */
export const defaultSettings: SiteSettings = {
  name: "Md Al Amin Sikander",
  shortName: "Al Amin",
  roles: ["Software QA Engineer", "SEO Specialist", "Management & Operations"],
  roleLine: "Software QA Engineer | SEO | Operations",
  tagline:
    "Software QA Engineer, SEO Specialist, and Management & Operations professional helping teams ship reliable, discoverable digital products.",
  about: [
    "I'm a versatile professional with **4+ years of experience** across quality assurance, SEO and digital marketing, e-commerce, supply research, and management operations. My background in Computer Science and Engineering gives me a solid technical foundation for all of it.",
    "As a **Software QA Engineer**, I approach quality as something built in from the start. I review business requirements, user flows, and Figma designs before development, then carry out functional, regression, integration, and UI/UX testing across browsers and devices — documenting defects clearly so teams can fix them quickly.",
    "My SEO experience keeps me interested in how websites are discovered. From keyword research to technical audits, metadata, and page speed, I enjoy making sites easier for search engines to crawl and for people to find.",
    "Alongside testing, I coordinate tasks and projects, support recruitment and onboarding, and prepare reports for management. I explain technical issues in plain language to non-technical stakeholders and rely on analytical thinking, attention to detail, and problem-solving to keep work moving.",
  ].join("\n\n"),
  email: "alamin.6534@gmail.com",
  phone: "+8801725104909",
  phoneDisplay: "+880 1725 104909",
  location: "Dhaka, Bangladesh",
  whatsappMessage:
    "Hi Al Amin, I came across your portfolio and would like to discuss a project or opportunity with you.",
  socialLinks: [
    { platform: "linkedin", label: "in/al-amin-sikander", url: "https://www.linkedin.com/in/al-amin-sikander/" },
  ],
  photo: "/images/al-amin-sikander.webp",
  cvUrl: "/documents/Md-Al-Amin-Sikander-CV.pdf",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
  seoTitle: "Md Al Amin Sikander — Software QA Engineer, SEO Specialist & Operations Professional",
  seoDescription:
    "Portfolio of Md Al Amin Sikander, a Software QA Engineer with 4+ years across manual software testing, web and mobile application testing, technical SEO, digital marketing, and management and operations.",
  seoKeywords: [
    "Md Al Amin Sikander",
    "Software QA Engineer",
    "Quality Assurance Engineer",
    "Manual Software Testing",
    "Web and Mobile Application Testing",
    "SEO Specialist",
    "Technical SEO",
    "Management and Operations",
    "Dhaka Bangladesh",
  ],
  footerLinks: [],
  softSkills: [
    "Analytical thinking",
    "Attention to detail",
    "Clear communication",
    "Problem-solving",
    "Team collaboration",
    "Time management",
  ],
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
