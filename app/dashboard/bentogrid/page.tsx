import { connectToDatabase } from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import { gridItems } from "@/data";
import GridManager from "@/components/dashboard/GridManager";

export const dynamic = "force-dynamic";

export default async function BentoGridPage() {
  let gridTexts: any[] = [];
  try {
    await connectToDatabase();
    const doc: any = await Profile.findOne({ key: "main" }).lean().exec();
    const profile = doc ? JSON.parse(JSON.stringify(doc)) : null;
    gridTexts = Array.isArray(profile?.gridTexts) ? profile.gridTexts : [];
  } catch {
    gridTexts = [];
  }

  const defaults = gridItems.map((g) => ({
    tagline: g.tagline ?? "",
    title: g.title ?? "",
    subtitle: g.subtitle ?? "",
    description: g.description ?? "",
    badge: g.badge ?? "",
    chips: Array.isArray(g.chips) ? g.chips : [],
  }));

  const effective = defaults.map((d, i) => {
    const saved = gridTexts[i] ?? {};
    return {
      tagline: saved.tagline || d.tagline,
      title: saved.title || d.title,
      subtitle: saved.subtitle || d.subtitle,
      description: saved.description || d.description,
      badge: saved.badge || d.badge,
      chips:
        Array.isArray(saved.chips) && saved.chips.length
          ? saved.chips
          : d.chips,
    };
  });

  return <GridManager gridTexts={effective} />;
}