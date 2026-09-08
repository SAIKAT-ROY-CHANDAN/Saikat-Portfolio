import { skills as seedSkills } from "@/data";
import Skill from "@/models/Skill";

// Some live-DB rows exist under slightly different names than the seed data.
const CATEGORY_ALIASES: Record<string, string> = {
  "Postgres SQL": "database",
  Postman: "tools",
};

// Legacy rows (seeded before the `category` field existed) have no category.
// Map their name back to the default sector so they sort into the right group.
const defaultCategoryByName = new Map<string, string>([
  ...seedSkills.map((s) => [String(s.name), s.category ?? "frontend"] as const),
  ...Object.entries(CATEGORY_ALIASES),
]);

export async function backfillSkillCategories() {
  const missing = await Skill.find({ category: { $exists: false } })
    .select("name")
    .lean();
  if (!missing.length) return;

  const writes = missing.map((row: any) => ({
    updateOne: {
      filter: { _id: row._id },
      update: {
        $set: {
          category: defaultCategoryByName.get(row.name) ?? "frontend",
        },
      },
    },
  }));
  await Skill.bulkWrite(writes);
}