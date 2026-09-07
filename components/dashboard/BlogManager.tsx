"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import { FaLinkedin, FaFacebook, FaXTwitter, FaPen, FaTrash, FaPlus, FaArrowLeft } from "react-icons/fa6";

const platformIcon = (p?: string) => {
  if (p === "linkedin") return <FaLinkedin size={12} />;
  if (p === "facebook") return <FaFacebook size={12} />;
  if (p === "x") return <FaXTwitter size={12} />;
  return null;
};

export default function BlogManager({ blogs = [] }: { blogs?: any[] }) {
  const router = useRouter();
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const addNew = () => {
    setEditingBlog(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const edit = (b: any) => {
    setEditingBlog(b);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    setBusy(true);
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingBlog(null);
    router.refresh();
  };

  if (showForm) {
    return (
      <div>
        <button
          onClick={handleSaved}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white-200 hover:text-white mb-5 transition"
        >
          <FaArrowLeft size={13} /> Back to all blogs
        </button>
        <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-6">
          <BlogEditor key={editingBlog?._id ?? "new"} editingBlog={editingBlog} onSaved={handleSaved} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">
          Blogs <span className="text-sm font-normal text-white-200">({blogs.length})</span>
        </h2>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <FaPlus /> New blog
        </button>
      </div>

      <div className="space-y-2">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
          >
            {b.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.coverImage}
                alt=""
                className="size-11 rounded-lg object-cover border border-white/10"
                loading="lazy"
              />
            ) : (
              <div className="size-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white-200 text-xs">
                {b.title?.charAt(0)?.toUpperCase() ?? "B"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white flex items-center gap-2 truncate">
                {b.title || "(untitled)"}
                {b.sourcePlatform && b.sourcePlatform !== "native" && (
                  <span className="text-purple-100 shrink-0">{platformIcon(b.sourcePlatform)}</span>
                )}
              </p>
              <p className="text-[11px] text-white-200 truncate">
                {b.postedAt
                  ? `${new Date(b.postedAt).toLocaleDateString()} · `
                  : ""}
                {b.sourceUrl ? "Repost" : "Original"}
              </p>
            </div>
            <button
              onClick={() => edit(b)}
              disabled={busy}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <FaPen size={10} /> Edit
            </button>
            <button
              onClick={() => remove(b._id)}
              disabled={busy}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <FaTrash size={10} /> Delete
            </button>
          </div>
        ))}
        {!blogs.length && (
          <p className="text-xs text-white-200">
            Nothing here yet — click &quot;New blog&quot; to publish your first post.
          </p>
        )}
      </div>
    </div>
  );
}