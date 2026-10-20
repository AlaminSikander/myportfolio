export const projectCategories = [
  { id: "qa", label: "QA & Testing", tone: "bg-mint-50 text-mint-700" },
  { id: "automation", label: "Automation Testing", tone: "bg-mint-50 text-mint-700" },
  { id: "api", label: "API Testing", tone: "bg-mint-50 text-mint-700" },
  { id: "seo", label: "SEO & Digital Marketing", tone: "bg-azure-50 text-azure-700" },
  { id: "development", label: "Development", tone: "bg-ember-50 text-ember-700" },
  { id: "operations", label: "Management & Operations", tone: "bg-ember-50 text-ember-700" },
] as const;

export const projectCategoryIds = projectCategories.map((category) => category.id) as [string, ...string[]];

export function projectCategoryLabel(id: string) {
  return projectCategories.find((category) => category.id === id)?.label ?? id;
}

export function projectCategoryTone(id: string) {
  return projectCategories.find((category) => category.id === id)?.tone ?? "bg-canvas text-ink-700";
}
