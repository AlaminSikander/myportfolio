import type { Accent } from "@/types";

type SkillCategorySeed = {
  slug: string;
  label: string;
  description: string;
  accent: Accent;
  icon: string;
  skills: string[];
};

/** Initial skills. After seeding, the database (managed at /admin/skills) is the source of truth. */
export const skillCategorySeed: SkillCategorySeed[] = [
  {
    slug: "qa",
    label: "Quality Assurance",
    description: "Manual software testing across web and mobile, from requirements to release.",
    accent: "teal",
    icon: "shield",
    skills: [
      "Functional Testing",
      "Regression Testing",
      "Integration Testing",
      "System Testing",
      "UI/UX Testing",
      "Exploratory Testing",
      "End-to-End Testing",
      "Test Case Design",
      "Bug/Defect Reporting",
      "Requirements Analysis",
      "Figma Design Review",
      "Web and Mobile Testing",
      "Cross-Browser Testing",
      "QA Documentation",
    ],
  },
  {
    slug: "seo",
    label: "SEO & Digital Marketing",
    description: "Search research, optimization, and reporting with industry-standard tools.",
    accent: "blue",
    icon: "search",
    skills: [
      "Keyword Research",
      "On-Page SEO",
      "Technical SEO",
      "Off-Page SEO",
      "Link Building",
      "Competitor Analysis",
      "WordPress SEO",
      "Google Analytics",
      "Google Search Console",
      "SEMrush",
      "Ahrefs",
      "Moz",
      "Ubersuggest",
      "Rank Math",
      "Basic HTML/CSS",
      "Page Speed Optimization",
    ],
  },
  {
    slug: "ecommerce",
    label: "E-commerce & Research",
    description: "Product, supplier, and market research that supports sourcing decisions.",
    accent: "ember",
    icon: "cart",
    skills: [
      "Amazon FBA",
      "Product Research",
      "Supplier Research",
      "Supplier Sourcing",
      "Market Research",
      "Product and Supplier Analysis",
      "Pricing and Competitor Analysis",
    ],
  },
  {
    slug: "operations",
    label: "Management & Operations",
    description: "Coordination and people operations that keep teams moving.",
    accent: "ember",
    icon: "users",
    skills: [
      "Team Coordination",
      "Task and Project Coordination",
      "Recruitment Support",
      "Interview Scheduling",
      "Employee Onboarding",
      "Stakeholder Communication",
      "Project Reporting",
      "Meeting Coordination",
      "Administrative Support",
    ],
  },
  {
    slug: "it",
    label: "IT Support",
    description: "Hands-on support for systems, accounts, hardware, and everyday IT needs.",
    accent: "teal",
    icon: "monitor",
    skills: [
      "Software Installation and Configuration",
      "Hardware Setup and Troubleshooting",
      "Basic Network Support",
      "User Account Management",
      "Email Configuration",
      "Data Backup and Recovery",
      "System Maintenance",
    ],
  },
];
