import { connectToDatabase } from "@/lib/dbConnect";
import Experience from "@/models/Experience";
import { workExperience } from "@/data";
import ExperienceManager from "@/components/dashboard/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  let entries: any[] = [];
  try {
    await connectToDatabase();
    const docs = await Experience.find({})
      .sort({ priority: 1, createdAt: -1 })
      .lean()
      .exec();
    entries = docs.map((d) => ({
      _id: String(d._id),
      title: d.title,
      desc: d.desc,
      thumbnail: d.thumbnail,
      className: d.className,
      period: d.period ?? "",
      company: d.company ?? "",
      place: d.place ?? "",
      priority: d.priority ?? 1000,
    }));
  } catch {
    entries = [];
  }

  const list =
    entries.length > 0
      ? entries
      : workExperience.map((e) => ({ ...e, isDefault: true }));

  return <ExperienceManager entries={list} />;
}