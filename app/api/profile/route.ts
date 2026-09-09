import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import { socialMedia } from "@/data";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function GET() {
  try {
    await connectToDatabase();
    let profile = await Profile.findOne({ key: "main" });
    if (!profile) {
      profile = await Profile.create({ key: "main", socials: socialMedia });
    }
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({
      key: "main",
      heroTagline: "Dynamic Web Magic with Saikat",
      heroTitle: "Transforming Concepts into Seamless User Experiences",
      heroSubtitle:
        "Hi! I'm Saikat, a React/Next.js Developer based in Bangladesh.",
      cvLink:
        "https://drive.google.com/uc?export=download&id=1jZ7DFzizL6wO_HUPhHhtXL9Cv-Bw3nOO",
      email: "saikotroydev@gmail.com",
      socials: socialMedia,
    });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const body = await req.json();

  const FIELDS = [
    "heroTagline",
    "heroTitle",
    "heroSubtitle",
    "cvLink",
    "email",
    "introVideoUrl",
    "socials",
    "gridTexts",
    "aboutTexts",
  ] as const;

  const update: Record<string, unknown> = {};
  for (const f of FIELDS) {
    if (body[f] !== undefined) update[f] = body[f];
  }

  const profile = await Profile.findOneAndUpdate({ key: "main" }, update, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(profile);
}
