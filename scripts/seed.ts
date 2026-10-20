import { count } from "drizzle-orm";
import { experienceSeed } from "../src/data/experience";
import { projectSeed } from "../src/data/projects";
import { defaultSettings } from "../src/data/site";
import { skillCategorySeed } from "../src/data/skills";
import { experiences, projects, siteSettings, skillCategories, skills } from "../src/db/schema";
import { connect } from "./db";

/** Inserts the original portfolio content into empty tables only, so it never overwrites admin edits. */
async function main() {
  const { db, close } = connect();
  try {
    const [settingsCount] = await db.select({ value: count() }).from(siteSettings);
    if (settingsCount.value === 0) {
      await db.insert(siteSettings).values({ id: 1, data: defaultSettings });
      console.log("Seeded site settings.");
    } else {
      console.log("Site settings already exist — skipped.");
    }

    const [experienceCount] = await db.select({ value: count() }).from(experiences);
    if (experienceCount.value === 0) {
      await db.insert(experiences).values(experienceSeed);
      console.log(`Seeded ${experienceSeed.length} experiences.`);
    } else {
      console.log("Experiences already exist — skipped.");
    }

    const [projectCount] = await db.select({ value: count() }).from(projects);
    if (projectCount.value === 0) {
      await db.insert(projects).values(projectSeed);
      console.log(`Seeded ${projectSeed.length} projects.`);
    } else {
      console.log("Projects already exist — skipped.");
    }

    const [categoryCount] = await db.select({ value: count() }).from(skillCategories);
    if (categoryCount.value === 0) {
      let total = 0;
      for (const [index, category] of skillCategorySeed.entries()) {
        const [row] = await db
          .insert(skillCategories)
          .values({
            slug: category.slug,
            label: category.label,
            description: category.description,
            accent: category.accent,
            icon: category.icon,
            sortOrder: index,
          })
          .returning({ id: skillCategories.id });
        await db
          .insert(skills)
          .values(category.skills.map((name, order) => ({ name, categoryId: row.id, sortOrder: order })));
        total += category.skills.length;
      }
      console.log(`Seeded ${skillCategorySeed.length} skill categories and ${total} skills.`);
    } else {
      console.log("Skills already exist — skipped.");
    }
  } finally {
    await close();
  }
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
