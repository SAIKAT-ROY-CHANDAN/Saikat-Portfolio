import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Education from "@/models/Education";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json(await Education.find({}).sort({ createdAt: 1 }));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const item = await Education.create(await req.json());
  return NextResponse.json(item, { status: 201 });
}
