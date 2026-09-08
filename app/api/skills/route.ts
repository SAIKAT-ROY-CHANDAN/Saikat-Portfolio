import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { backfillSkillCategories } from "@/lib/skill-categories";
import Skill from "@/models/Skill";
import { skills as seedSkills } from "@/data";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function GET() {
  try {
    await connectToDatabase();

    // Self-heal: collapse any accidental duplicate names (keeps the first
    // by priority/createdAt, deletes the rest).
    const dups = await Skill.aggregate<{ _id: string; ids: string[] }>([
      { $sort: { priority: 1, createdAt: 1, _id: 1 } },
      { $group: { _id: "$name", ids: { $push: "$_id" } } },
      { $match: { "ids.1": { $exists: true } } },
    ]);
    for (const d of dups) {
      await Skill.deleteMany({ _id: { $in: d.ids.slice(1) } });
    }

    // Seed defaults only when the collection is empty. Upserts on the unique
    // `name` key make a concurrent seed a no-op instead of a duplicate batch.
    if ((await Skill.countDocuments({})) === 0) {
      await Skill.bulkWrite(
        seedSkills.map((s, i) => ({
          updateOne: {
            filter: { name: s.name },
            update: { $setOnInsert: { ...s, priority: i + 1 } },
            upsert: true,
          },
        }))
      );
    }

    // Legacy rows seeded before the `category` field existed get a category
    // backfilled from the default sector mapping.
    await backfillSkillCategories();

    const items = await Skill.find({}).sort({ priority: 1, createdAt: -1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const item = await Skill.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}