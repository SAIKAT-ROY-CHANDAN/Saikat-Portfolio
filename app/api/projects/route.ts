import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Project from "@/models/Project";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Project.find({}).sort({ priority: 1, createdAt: -1 });
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
    const item = await Project.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
