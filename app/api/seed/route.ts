import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Testimonial from "@/models/Testimonial";
import Education from "@/models/Education";
import Profile from "@/models/Profile";
import { projects, testimonials, workExperience, socialMedia } from "@/data";

/**
 * POST /api/seed — one-click seed from data/index.ts static content.
 * Protect in production: requires ?key=SEED_KEY or admin cookie.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const cookieRole = req.headers.get("cookie")?.includes("userRole=admin");
  if (
    process.env.SEED_KEY &&
    url.searchParams.get("key") !== process.env.SEED_KEY &&
    !cookieRole
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();

  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(
      projects.map((p) => ({
        title: p.title,
        des: p.des,
        img: p.img,
        iconLists: p.iconLists,
        link: p.link,
      }))
    );
  }
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(workExperience);
  }
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(testimonials);
  }
  if ((await Education.countDocuments()) === 0) {
    await Education.insertMany([
      {
        title: "Brojomohon School",
        description: "Secondary School Certificate",
        yearsAttended: "2016 - 2017",
        certificate: "SSC",
        url: "https://i.ibb.co.com/84kr4rX/school-building1.jpg",
      },
      {
        title: "Govt. Barishal College",
        description: "Higher School Certificate",
        yearsAttended: "2018 - 2020",
        certificate: "HSC",
        url: "https://i.ibb.co.com/2NYt23B/school-building2.jpg",
      },
      {
        title: "Govt. Brojomohon College (NU)",
        description: "Bachelor of Accounting",
        yearsAttended: "2021 - 2026",
        certificate: "BBA",
        url: "https://i.ibb.co.com/3c8tyKb/school-building3.jpg",
      },
    ]);
  }
  await Profile.findOneAndUpdate(
    { key: "main" },
    { key: "main", socials: socialMedia },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
