import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Experience from "@/models/Experience";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Experience.find({})
      .sort({ priority: 1, createdAt: -1 })
      .lean()
      .exec();
    return NextResponse.json(
      items.map((i) => ({ ...i, _id: String(i._id) }))
    );
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const item = await Experience.create(await req.json());
  return NextResponse.json(item, { status: 201 });
}