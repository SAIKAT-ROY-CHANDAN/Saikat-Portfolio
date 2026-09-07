import { connectToDatabase } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import BlogManager from "@/components/dashboard/BlogManager";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    await connectToDatabase();
    blogs = JSON.parse(
      JSON.stringify(
        await Blog.find({}).sort({ createdAt: -1 }).lean().exec()
      )
    );
  } catch {
    blogs = [];
  }
  return <BlogManager blogs={blogs} />;
}