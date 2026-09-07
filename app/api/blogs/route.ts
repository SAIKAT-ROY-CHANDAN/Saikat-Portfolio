import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const body = await req.json();
    const blog = await Blog.create({
      title: body.title,
      tags: Array.isArray(body.tags) ? body.tags : [],
      content: body.content,
      coverImage: body.coverImage ?? null,
      sourceUrl: body.sourceUrl || undefined,
      sourcePlatform: body.sourcePlatform || "native",
      authorName: body.authorName || undefined,
      authorHandle: body.authorHandle || undefined,
      authorAvatar: body.authorAvatar || undefined,
      sourceText: body.sourceText || undefined,
      postedAt: body.postedAt || undefined,
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
