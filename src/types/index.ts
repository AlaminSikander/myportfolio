export type Accent = "teal" | "blue" | "ember";

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
  company: string;
  location: string;
  role: string;
  period: string;
  start: string;
  current?: boolean;
  summary: string;
  accent: Accent;
  responsibilities: string[];
};

export type SkillCategory = {
  id: string;
  label: string;
  description: string;
  accent: Accent;
  skills: string[];
};

export type ProjectCategory = "qa" | "seo";

export type Project = {
  slug: string;
  name: string;
  url: string;
  displayUrl: string;
  categories: ProjectCategory[];
  summary: string;
  details: {
    heading: string;
    items: string[];
  }[];
  screenshot?: string;
  accent: Accent;
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
  group?: string;
  result: string;
};
