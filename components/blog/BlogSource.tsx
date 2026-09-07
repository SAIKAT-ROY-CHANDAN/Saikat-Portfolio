"use client";
import Link from "next/link";
import { FaLinkedin, FaFacebook, FaXTwitter, FaArrowUpRightFromSquare, FaBookOpen } from "react-icons/fa6";
import type { IBlog } from "@/types";
import { platformLabel } from "@/lib/social";

export function PlatformIcon({ platform, size = 14 }: { platform?: string; size?: number }) {
  if (platform === "linkedin") return <FaLinkedin size={size} />;
  if (platform === "facebook") return <FaFacebook size={size} />;
  if (platform === "x") return <FaXTwitter size={size} />;
  return null;
}

export function SourceBadge({ blog }: { blog: IBlog }) {
  if (!blog.sourceUrl || blog.sourcePlatform === "native") return null;
  return (
    <span className="inline-flex items-center gap-1.5 bg-purple/20 border border-purple/40 text-purple-100 px-2.5 py-1 rounded-full text-[11px] font-medium">
      <PlatformIcon platform={blog.sourcePlatform} />
      {platformLabel(blog.sourcePlatform)} repost
    </span>
  );
}

export function AuthorHeader({ blog, light = false }: { blog: IBlog; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mt-3">
      {blog.authorAvatar ? (
        <img
          src={blog.authorAvatar}
          alt={blog.authorName ?? "author"}
          width={32}
          height={32}
          className="rounded-full object-cover size-8 border border-white/20"
          loading="lazy"
        />
      ) : (
        <div className="size-8 rounded-full bg-purple/30 border border-purple/40 flex items-center justify-center text-xs font-bold text-white">
          {(blog.authorName ?? "S").charAt(0)}
        </div>
      )}
      <div className="leading-tight">
        <p className={`text-sm font-semibold ${light ? "text-black-100" : "text-white"}`}>
          {blog.authorName ?? "Saikat Roy Chandan"}
        </p>
        {blog.authorHandle && (
          <p className={`text-xs ${light ? "text-black-200" : "text-white-200"}`}>
            {blog.authorHandle}
          </p>
        )}
      </div>
      <span className="ml-auto text-white-200">
        <PlatformIcon platform={blog.sourcePlatform} />
      </span>
    </div>
  );
}

export function SourceActions({ blog }: { blog: IBlog }) {
  if (!blog.sourceUrl) return null;
  const id = blog._id;
  return (
    <div className="flex gap-2 mt-4">
      <a
        href={blog.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-track={JSON.stringify({ kind: "blog-out", label: blog.title })}
        onClick={(e) => e.stopPropagation()}
        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black-100 text-xs font-bold border border-white/20 hover:opacity-90"
      >
        View source <FaArrowUpRightFromSquare size={11} />
      </a>
      <Link
        href={`/blog/${id}`}
        onClick={(e) => e.stopPropagation()}
        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple/25 text-white text-xs font-bold border border-purple/40 hover:bg-purple/35"
      >
        <FaBookOpen size={12} /> Read here
      </Link>
    </div>
  );
}
