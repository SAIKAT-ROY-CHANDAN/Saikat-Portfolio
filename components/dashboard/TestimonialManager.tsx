"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TestimonialEditor from "./TestimonialEditor";
import { FaArrowLeft, FaPen, FaPlus, FaTrash } from "react-icons/fa6";

const sortByPriority = (list: any[]) =>
  [...list].sort((a, b) => (a.priority ?? 99999) - (b.priority ?? 99999));

const initialsOf = (name?: string) =>
  (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export default function TestimonialManager({
  items = [],
}: {
  items?: any[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const list = sortByPriority(items);
  const hasDefaults = list.some((t) => t.isDefault);

  const addNew = () => {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const edit = (t: any) => {
    setEditing(t);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setBusy(true);
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    router.refresh();
  };

  if (showForm) {
    return (
      <div>
        <button
          onClick={handleSaved}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white-200 hover:text-white mb-5 transition"
        >
          <FaArrowLeft size={13} /> Back to all testimonials
        </button>
        <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-6">
          <TestimonialEditor
            key={editing?._id ?? editing?.id ?? "new"}
            testimonial={editing}
            onSaved={handleSaved}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">
          Testimonials{" "}
          <span className="text-sm font-normal text-white-200">
            ({list.length})
          </span>
        </h2>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <FaPlus /> New testimonial
        </button>
      </div>

      {hasDefaults && (
        <p className="text-[11px] text-white-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          Showing the default testimonials from the homepage. Create your own
          entry to take over this list.
        </p>
      )}

      <div className="space-y-2">
        {list.map((t) => (
          <div
            key={t._id ?? t.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
          >
            {t.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.img}
                alt=""
                className="size-11 rounded-full border border-white/10 bg-white/5 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white-200 text-xs font-bold">
                {initialsOf(t.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                {t.name || "(untitled)"}
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple/25 border border-purple/40 text-purple-100">
                  #{String(t.priority ?? t.id ?? "?").padStart(2, "0")}
                </span>
                {t.isDefault && (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white-200">
                    default
                  </span>
                )}
              </p>
              <p className="text-[11px] text-white-200 truncate">
                {t.title || t.quote?.slice(0, 80) || "no details"}
              </p>
            </div>
            {!t.isDefault && (
              <>
                <button
                  onClick={() => edit(t)}
                  disabled={busy}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <FaPen size={10} /> Edit
                </button>
                <button
                  onClick={() => remove(t._id ?? t.id)}
                  disabled={busy}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <FaTrash size={10} /> Delete
                </button>
              </>
            )}
          </div>
        ))}
        {!list.length && (
          <p className="text-xs text-white-200">
            Nothing here yet — click &quot;New testimonial&quot; to add your
            first one. Lower priority numbers appear first.
          </p>
        )}
      </div>
    </div>
  );
}