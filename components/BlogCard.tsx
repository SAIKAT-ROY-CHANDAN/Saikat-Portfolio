import BlogGrid from "./blog/BlogGrid";
import { getBlogs } from "@/lib/content";

export async function BlogCard({ blogs: propBlogs }: { blogs?: any[] }) {
  const blogs = propBlogs ?? (await getBlogs());

  return (
    <section id="blog" className="py-20">
      <h1 className="heading">
        Insights & Innovations from
        <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"> My Tech Journey</span>
      </h1>
      <p className="text-center text-white-200 mt-4 text-sm">
        Original writing plus reposts from LinkedIn, Facebook and X — open a
        card to view the source or read it here.
      </p>
      <BlogGrid blogs={blogs} />
    </section>
  );
}
