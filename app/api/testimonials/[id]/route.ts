import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  const item = await Testimonial.findByIdAndUpdate(
    params.id,
    await req.json(),
    { new: true }
  );
  return NextResponse.json(item);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToDatabase();
  await Testimonial.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
