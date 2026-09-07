import { connectToDatabase } from "@/lib/dbConnect";
import Skill from "@/models/Skill";
import { skills as defaultSkills } from "@/data";
import SkillManager from "@/components/dashboard/SkillManager";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  let list: any[] = [];
  try {
    await connectToDatabase();
    list = JSON.parse(
      JSON.stringify(
        await Skill.find({}).sort({ priority: 1, createdAt: -1 }).lean().exec()
      )
    );
  } catch {
    list = [];
  }
  const entries = list.length
    ? list
    : defaultSkills.map((s) => ({ ...s, isDefault: true }));
  return <SkillManager skills={entries} />;
}