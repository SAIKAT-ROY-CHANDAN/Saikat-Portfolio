"use client";
import { useState } from "react";
import Link from "next/link";
import { FollowerPointerCard } from "../ui/following-pointer";
import type { IBlog } from "@/types";
import { AuthorHeader, SourceActions, SourceBadge } from "./BlogSource";
import { FaArrowUpRightFromSquare, FaBookOpen } from "react-icons/fa6";

function cleanEscapes(s?: string) {
  return (s ?? "").replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n");
}

function stripHtml(html?: string) {
  return cleanEscapes(html ?? "").replace(/<[^>]*>/g, "").slice(0, 160);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function previewHtml(text?: string) {
  const raw = cleanEscapes(text ?? "").trim();
  if (!raw) return "No description available.";
  if (/<\/?[a-zA-Z][\s\S]*>/.test(raw)) return raw;
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<p>${escapeHtml(l)}</p>`)
    .join("");
}

export default function BlogGrid({ blogs }: { blogs: IBlog[] }) {
  const [active, setActive] = useState<IBlog | null>(null);

  if (!blogs.length) {
    return (
      <p className="text-center text-white-200 mt-10">
        No posts yet — publish your first blog or paste a LinkedIn / Facebook /
        X link from the dashboard.
      </p>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-10">
        {blogs.map((blog) => {
          const isSocial =
            !!blog.sourceUrl && blog.sourcePlatform !== "native";
          return (
            <div key={blog._id} className="w-80 mx-auto mt-10">
              <FollowerPointerCard
                title={
                  <div className="flex space-x-2 items-center">
                    <div className="size-5">
                      <img
                        src={blog.authorAvatar ?? "/IMG_20240315_180753.jpg"}
                        height={20}
                        width={20}
                        alt="author"
                        className="rounded-full border-2 border-white object-cover size-5"
                      />
                    </div>
                    <p>{blog.authorName ?? "Saikat Roy Chandan"}</p>
                  </div>
                }
              >
                <div
                  className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-[#04071D] hover:shadow-xl border border-white/[0.2] cursor-pointer"
                  onClick={() => isSocial && setActive(blog)}
                >
                  <div className="w-full h-[165px] bg-white-100 rounded-tr-lg rounded-tl-lg overflow-hidden relative">
                    <img
                      src={blog.coverImage || "/blog-demo.jpg"}
                      alt="thumbnail"
                      loading="lazy"
                      className="group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 h-full w-full"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SourceBadge blog={blog} />
                      {blog.postedAt && (
                        <span className="text-[11px] text-white-200">
                          {new Date(blog.postedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h2 className="font-bold my-3 line-clamp-2 text-lg text-white">
                      {blog.title}
                    </h2>
                    <AuthorHeader blog={blog} />
                    <div
                      className="font-normal my-3 text-sm text-white-100 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: previewHtml(blog.sourceText ?? blog.content),
                      }}
                    />
                    {!blog.sourceText && (
                      <p className="text-xs text-white-200 line-clamp-2">
                        {stripHtml(blog.content)}
                      </p>
                    )}
                    <div className="flex flex-row justify-between items-center mt-6">
                      <span className="text-sm text-white-200">
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString()
                          : "Date not available"}
                      </span>
                      {isSocial ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActive(blog);
                          }}
                          className="relative cursor-pointer z-10 px-6 py-2 bg-white text-black-100 font-bold rounded-xl block border border-white/[0.2] text-xs"
                        >
                          Open post
                        </button>
                      ) : (
                        <Link
                          href={`/blog/${blog?._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="relative cursor-pointer z-10 px-6 py-2 bg-white text-black-100 font-bold rounded-xl block border border-white/[0.2] text-xs"
                        >
                          Read More
                        </Link>
                      )}
                    </div>
                    {isSocial && <SourceActions blog={blog} />}
                  </div>
                </div>
              </FollowerPointerCard>
            </div>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#04071D] border border-white/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <SourceBadge blog={active} />
            <h3 className="text-white font-bold text-xl mt-3 line-clamp-3">
              {active.title}
            </h3>
            <AuthorHeader blog={active} />
            <p className="text-white-100 text-sm mt-3 line-clamp-4">
              {stripHtml(active.sourceText ?? active.content)}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <a
                href={active.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track={JSON.stringify({ kind: "blog-out", label: active.title })}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black-100 text-sm font-bold"
              >
                View source <FaArrowUpRightFromSquare size={13} />
              </a>
              <Link
                href={`/blog/${active._id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple/30 border border-purple/50 text-white text-sm font-bold"
              >
                <FaBookOpen size={14} /> Read here
              </Link>
            </div>
            <button
              onClick={() => setActive(null)}
              className="mt-4 w-full text-center text-xs text-white-200 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
