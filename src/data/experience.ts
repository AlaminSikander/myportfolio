import type { experiences } from "@/db/schema";

type ExperienceSeed = Omit<typeof experiences.$inferInsert, "id" | "createdAt" | "updatedAt">;

/** Initial work history. After seeding, the database (managed at /admin/experience) is the source of truth. */
export const experienceSeed: ExperienceSeed[] = [
  {
    company: "Astitva Lab",
    location: "Australia",
    jobTitle: "QA Engineer & Management Operations",
    startDate: "2026-02-01",
    endDate: null,
    current: true,
    accent: "teal",
    status: "published",
    summary:
      "Testing web and mobile applications end to end while supporting project coordination and day-to-day operations.",
    responsibilities: [
      "Functional, regression, integration, system, and UI/UX testing for web and mobile applications",
      "Creating and executing test cases, test scenarios, test plans, and checklists",
      "Identifying, documenting, prioritizing, and tracking software defects through the development lifecycle",
      "End-to-end testing across devices, browsers, platforms, and environments",
      "Reviewing business requirements, user flows, and Figma designs for functional and UI/UX issues",
      "Collaborating with developers, designers, product managers, and stakeholders to resolve issues",
      "Exploratory testing and edge-case investigation",
      "QA reporting, task coordination, recruitment support, interview scheduling, onboarding, and operational coordination",
    ],
    achievements: [],
    technologies: [],
  },
  {
    company: "Area71",
    location: "Dhaka, Bangladesh",
    jobTitle: "Supply Research Executive",
    startDate: "2025-06-01",
    endDate: "2026-01-01",
    current: false,
    accent: "ember",
    status: "published",
    summary: "Researching suppliers and markets, and turning the findings into clear reports for management decisions.",
    responsibilities: [
      "Market and supplier research to identify products and sourcing opportunities",
      "Comparing suppliers on pricing, quality, availability, reliability, and lead times",
      "Communicating with suppliers to collect quotations, specifications, and availability",
      "Monitoring market trends, pricing changes, and product demand",
      "Preparing research reports and summaries for management review",
      "Maintaining organized supplier, quotation, and product records",
    ],
    achievements: [],
    technologies: [],
  },
  {
    company: "Rokify",
    location: "Uttara, Dhaka",
    jobTitle: "SEO Executive",
    startDate: "2022-09-01",
    endDate: "2025-02-01",
    current: false,
    accent: "blue",
    status: "published",
    summary:
      "Planning and implementing on-page, off-page, and technical SEO work, and reporting on search performance.",
    responsibilities: [
      "Keyword research to identify relevant search opportunities",
      "On-page, off-page, and technical SEO implementation",
      "Optimizing content, meta titles, meta descriptions, headings, URLs, and internal linking",
      "Technical SEO audits with crawlability and indexing recommendations",
      "Link-building strategy and execution",
      "Google Analytics and Google Search Console monitoring and reporting",
      "Competitor research and SEO performance analysis",
    ],
    achievements: [],
    technologies: [],
  },
];
