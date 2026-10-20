export type Accent = "teal" | "blue" | "ember";

export type ContentStatus = "draft" | "published";

export type NavItem = {
  id: string;
  label: string;
};

export type FocusArea = {
  title: string;
  description: string;
  accent: Accent;
  icon: "shield" | "search" | "workflow";
  points: string[];
};

export type Experience = {
  id: number;
  company: string;
  location: string;
  role: string;
  employmentType?: string | null;
  period: string;
  start: string;
  end?: string | null;
  current: boolean;
  summary: string;
  accent: Accent;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
};

export type SkillItem = {
  name: string;
  icon?: string | null;
  proficiency?: string | null;
};

export type SkillCategory = {
  id: string;
  label: string;
  description: string;
  accent: Accent;
  icon: string;
  skills: SkillItem[];
};

export type ProjectDetailGroup = {
  heading: string;
  items: string[];
};

export type Project = {
  slug: string;
  name: string;
  url: string | null;
  displayUrl: string;
  githubUrl?: string | null;
  categories: string[];
  summary: string;
  content: string;
  details: ProjectDetailGroup[];
  screenshot?: string | null;
  imageAlt?: string;
  gallery: { url: string; alt: string }[];
  technologies: string[];
  startDate?: string | null;
  completedDate?: string | null;
  featured: boolean;
  accent: Accent;
  updatedAt?: string;
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
  group?: string;
  result: string;
};

export type SocialPlatform = "linkedin" | "github" | "x" | "facebook" | "instagram" | "youtube" | "website";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
};

export type FooterLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  roles: string[];
  roleLine: string;
  tagline: string;
  about: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  location: string;
  whatsappMessage: string;
  socialLinks: SocialLink[];
  photo: string;
  cvUrl: string;
  logoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  footerLinks: FooterLink[];
  softSkills: string[];
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string | null;
  featuredImageAlt: string;
  author: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  publishedAt: string | null;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
  readingMinutes: number;
};
