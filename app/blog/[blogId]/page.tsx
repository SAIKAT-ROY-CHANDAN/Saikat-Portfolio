import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { SourceBadge } from "@/components/blog/BlogSource";
import { platformLabel } from "@/lib/social";
import { FaArrowUpRightFromSquare, FaClock, FaArrowLeft } from "react-icons/fa6";

export const dynamic = "force-dynamic";

interface BlogDescriptionPageProps {
  params: {
    blogId: string;
  };
}

async function getBlog(id: string) {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const candidates = [
    `${proto}://${host}/api/blogs/${id}`,
    `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch {
      continue;
    }
  }
  return null;
}

const clean = (s: string) =>
  s.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatBody = (content: string) => {
  const text = clean(content);
  if (/<\/?[a-zA-Z][\s\S]*>/.test(text)) return text;
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
};

const readMinutes = (content?: string) => {
  const words = (content ?? "")
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const BlogDescriptionPage = async ({ params }: BlogDescriptionPageProps) => {
  const blog = await getBlog(params?.blogId);
  if (!blog) notFound();

  const isSocial = !!blog.sourceUrl && blog.sourcePlatform !== "native";

  const body =
    blog.content && blog.content !== "Repost" ? blog.content : "";
  const showQuote = !!blog.sourceText && blog.sourceText !== body;
  const quote = showQuote ? clean(blog.sourceText) : null;
  const readMin = readMinutes(body || blog.sourceText);

  return (
    <div className="relative bg-black-100 flex justify-center overflow-clip mx-auto">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.04),transparent_55%)]" />

      <div className="relative w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white-200 hover:text-white transition"
        >
          <FaArrowLeft size={13} /> Back to all posts
        </Link>

        {/* Cover */}
        <div className="relative mt-8">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            {blog.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.coverImage}
                alt={blog.title ?? "cover"}
                className="h-56 sm:h-80 w-full object-cover"
              />
            ) : (
              <div className="h-56 sm:h-80 w-full bg-[#04071D] bg-grid-white/[0.04] flex items-center justify-center">
                <span className="font-serif text-7xl bg-gradient-to-br from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {blog.title?.charAt(0)?.toUpperCase() ?? "B"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <SourceBadge blog={blog} />
          {blog.postedAt && (
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white-200 border border-white/10 rounded-full px-2.5 py-1">
              <FaClock size={10} className="text-cyan-300" />
              {new Date(blog.postedAt).toLocaleDateString()}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white-200 border border-white/10 rounded-full px-2.5 py-1">
            <FaClock size={10} className="text-purple-300" /> {readMin} min read
          </span>
        </div>

        <h1 className="mt-5 text-3xl sm:text-5xl font-bold leading-tight text-white">
          {blog.title}
        </h1>

        {/* Author strip */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#04071D]/80 p-4">
          {blog.authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.authorAvatar}
              alt={blog.authorName ?? "author"}
              className="size-11 rounded-full border border-cyan-400/30 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-full border border-cyan-400/30 bg-[#0a0f2c]/70 text-sm font-bold text-cyan-200">
              {(blog.authorName ?? "Saikat Roy Chandan").charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">
              {blog.authorName ?? "Saikat Roy Chandan"}
            </p>
            {blog.authorHandle && (
              <p className="text-xs text-white-200">@{blog.authorHandle}</p>
            )}
            {blog.postedAt && (
              <p className="text-[11px] text-white-200">
                Posted {new Date(blog.postedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {blog.sourceUrl && (
            <a
              href={blog.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track={JSON.stringify({ kind: "blog-out", label: blog.title })}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-white text-black-100 hover:opacity-90 transition"
            >
              View source <FaArrowUpRightFromSquare size={11} />
            </a>
          )}
        </div>

        {/* Tags */}
        {!!blog.tags?.length && (
          <div className="mt-5 flex flex-wrap gap-2">
            {(blog.tags ?? []).map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {quote && (
          <blockquote className="mt-8 rounded-r-xl border-l-4 border-purple bg-white/[0.03] p-5 text-white-200 text-lg italic leading-relaxed">
            {quote}
          </blockquote>
        )}

        {body ? (
          <article
            dangerouslySetInnerHTML={{ __html: formatBody(body) }}
            className="mt-8 text-white-100 text-lg leading-relaxed [&_p]:my-4 [&_h1]:mt-8 [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:mb-1 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_a]:text-purple-300 [&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-cyan-200 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-purple [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:my-4 [&_img]:rounded-xl"
          />
        ) : !showQuote ? (
          <p className="mt-8 text-white-100 text-lg">
            No description available.
          </p>
        ) : null}

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6 flex-wrap gap-3">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple hover:text-purple-200 transition"
          >
            <FaArrowLeft size={11} /> Back to all posts
          </Link>
          {isSocial && blog.sourceUrl && (
            <a
              href={blog.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track={JSON.stringify({ kind: "blog-out", label: blog.title })}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-purple/25 text-white border border-purple/40 hover:bg-purple/35 transition"
            >
              Originally posted on {platformLabel(blog.sourcePlatform)}{" "}
              <FaArrowUpRightFromSquare size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDescriptionPage;