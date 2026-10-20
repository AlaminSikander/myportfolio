import type { NavItem } from "@/types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const person = {
  name: "Md Al Amin Sikander",
  shortName: "Al Amin",
  initials: "AS",
  roles: ["Software QA Engineer", "SEO Specialist", "Management & Operations"],
  roleLine: "Software QA Engineer | SEO | Operations",
  email: "alamin.6534@gmail.com",
  phone: "+8801725104909",
  phoneDisplay: "+880 1725 104909",
  linkedin: "https://www.linkedin.com/in/al-amin-sikander/",
  location: "Dhaka, Bangladesh",
  cvPath: "/documents/Md-Al-Amin-Sikander-CV.pdf",
  photo: "/images/al-amin-sikander.webp",
  tagline:
    "Software QA Engineer, SEO Specialist, and Management & Operations professional helping teams ship reliable, discoverable digital products.",
} as const;

export const seo = {
  title: "Md Al Amin Sikander — Software QA Engineer, SEO Specialist & Operations Professional",
  description:
    "Portfolio of Md Al Amin Sikander, a Software QA Engineer with 4+ years across manual software testing, web and mobile application testing, technical SEO, digital marketing, and management and operations.",
  keywords: [
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
