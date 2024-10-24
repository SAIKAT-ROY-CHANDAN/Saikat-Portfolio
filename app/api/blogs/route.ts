import { NextResponse } from 'next/server';
import Blog from "@/models/Blog";
import { connectToDatabase } from "@/lib/dbConnect";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const body = await req.json();

        const newBlog = await Blog.create({
            title: body.title,
            tags: body.tags,
            content: body.content,
            coverImage: body.coverImage
        });

        return NextResponse.json({ message: "Blog created successfully!", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
