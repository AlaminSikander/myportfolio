import type { Project, ProjectCategory } from "@/types";

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  qa: "QA & Testing",
  seo: "SEO & Digital Marketing",
};

export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All Projects" },
  { id: "qa", label: "QA & Testing" },
  { id: "seo", label: "SEO & Digital Marketing" },
];

const seoScope = {
  heading: "SEO focus areas",
  items: [
    "Keyword research and search-intent mapping",
    "On-page optimization of titles, meta descriptions, headings, and internal links",
    "Technical SEO checks for crawlability and indexing",
    "Competitor research and performance reporting",
  ],
};

const qaScope = {
  heading: "QA focus areas",
  items: [
    "Functional and UI/UX testing of key pages and user flows",
    "Cross-browser and cross-device checks",
    "Defect documentation with clear reproduction steps",
    "Regression checks after fixes and updates",
  ],
};

export const projects: Project[] = [
  {
    slug: "truckall",
    name: "Truckall",
    url: "https://beta.truckall.au/",
    displayUrl: "beta.truckall.au",
    categories: ["qa"],
    accent: "teal",
    screenshot: "/images/projects/truckall.webp",
    summary:
      "Quality assurance for a fleet operations platform built for Australian truck contractors, currently in beta.",
    details: [
      {
        heading: "About the platform",
        items: [
          "A web application for truck contractor fleet management, workforce, and financial operations.",
          "The public beta opens on an authentication screen; the application itself sits behind sign-in.",
        ],
      },
      {
        heading: "QA focus areas",
        items: [
          "Functional, regression, and end-to-end testing of application workflows",
          "Reviewing requirements, user flows, and designs to flag issues early",
          "Testing across browsers, devices, and environments",
          "Logging, prioritizing, and tracking defects with the development team",
        ],
      },
    ],
  },
  {
    slug: "topspot-studio",
    name: "Topspot Studio",
    url: "https://topspotstudio.com/",
    displayUrl: "topspotstudio.com",
    categories: ["seo", "qa"],
    accent: "blue",
    screenshot: "/images/projects/topspot-studio.webp",
    summary:
      "SEO and website quality work for a studio that offers SEO, Local SEO, and web design to service businesses.",
    details: [
      {
        heading: "About the website",
        items: ["The website of an agency focused on SEO and web growth for service businesses."],
      },
      seoScope,
      qaScope,
    ],
  },
  {
    slug: "st-amar-bari-resort",
    name: "S T Amar Bari Resort",
    url: "http://stamarbari.com",
    displayUrl: "stamarbari.com",
    categories: ["seo", "qa"],
    accent: "ember",
    summary: "SEO and website quality checks for a resort website, covering search basics and the visitor experience.",
    details: [
      {
        heading: "About the website",
        items: ["The website of S T Amar Bari Resort, presenting the resort to prospective guests."],
      },
      seoScope,
      qaScope,
    ],
  },
  {
    slug: "anyhelpnow",
    name: "AnyHelpNow",
    url: "https://anyhelpnow.com/",
    displayUrl: "anyhelpnow.com",
    categories: ["seo"],
    accent: "blue",
    screenshot: "/images/projects/anyhelpnow.webp",
    summary:
      "SEO work for a German-language marketplace that connects customers with service providers across many categories.",
    details: [
      {
        heading: "About the website",
        items: [
          "A service marketplace covering categories such as home and garden, trades, cleaning, consulting, and automotive.",
        ],
      },
      seoScope,
    ],
  },
  {
    slug: "autoretouch",
    name: "AutoRetouch",
    url: "https://www.autoretouch.com/",
    displayUrl: "autoretouch.com",
    categories: ["seo"],
    accent: "teal",
    screenshot: "/images/projects/autoretouch.webp",
    summary:
      "SEO work for an AI-powered media platform that serves fashion and retail brands with automated image editing.",
    details: [
      {
        heading: "About the website",
        items: ["A software-as-a-service website for AI-assisted product photo and video production."],
      },
      seoScope,
    ],
  },
  {
    slug: "kolhub",
    name: "Kolhub",
    url: "https://kolhub.com/my",
    displayUrl: "kolhub.com/my",
    categories: ["seo"],
    accent: "ember",
    screenshot: "/images/projects/kolhub.webp",
    summary: "SEO work for the Malaysian site of an influencer marketing agency that connects brands with creators.",
    details: [
      {
        heading: "About the website",
        items: ["An influencer marketing agency website targeting brands and creators in Malaysia."],
      },
      seoScope,
    ],
  },
  {
    slug: "leantute",
    name: "Leantute",
    url: "https://leantute.com/",
    displayUrl: "leantute.com",
    categories: ["seo"],
    accent: "blue",
    screenshot: "/images/projects/leantute.webp",
    summary:
      "SEO work for a professional education provider offering industry-aligned programs with university partners.",
    details: [
      {
        heading: "About the website",
        items: ["An education website presenting career-focused programs, partners, and enrolment information."],
      },
      seoScope,
    ],
  },
];
