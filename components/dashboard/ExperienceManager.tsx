"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ExperienceEditor from "./ExperienceEditor";
import { FaArrowLeft, FaPen, FaPlus, FaTrash } from "react-icons/fa6";

const sortByPriority = (list: any[]) =>
  [...list].sort((a, b) => (a.priority ?? 99999) - (b.priority ?? 99999));

export default function ExperienceManager({
  entries = [],
}: {
  entries?: any[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const list = sortByPriority(entries);
  const hasDefaults = list.some((e) => e.isDefault);

  const addNew = () => {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const edit = (e: any) => {
    setEditing(e);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this experience entry?")) return;
    setBusy(true);
    const res = await fetch(`/api/experience/${id}`, {
      method: "DELETE",
    }).catch(() => null);
    setBusy(false);
    if (res && res.ok) router.refresh();
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
          <FaArrowLeft size={13} /> Back to all experience
        </button>
        <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-6">
          <ExperienceEditor
            key={editing?._id ?? editing?.id ?? "new"}
            experience={editing}
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
          Work experience{" "}
          <span className="text-sm font-normal text-white-200">
            ({list.length})
          </span>
        </h2>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <FaPlus /> New entry
        </button>
      </div>

      {hasDefaults && (
        <p className="text-[11px] text-white-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          Showing the default timeline from the homepage. Create your own entry
          to take over this list.
        </p>
      )}

      <div className="space-y-2">
        {list.map((e) => (
          <div
            key={e._id ?? e.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
          >
            {e.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={e.thumbnail}
                alt=""
                className="size-11 rounded-xl border border-white/10 bg-white/5 object-contain p-1.5"
                loading="lazy"
              />
            ) : (
              <div className="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white-200 text-xs">
                {e.title?.charAt(0)?.toUpperCase() ?? "E"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                {e.title || "(untitled)"}
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple/25 border border-purple/40 text-purple-100">
                  #{String(e.priority ?? e.id ?? "?").padStart(2, "0")}
                </span>
                {e.isDefault && (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white-200">
                    default
                  </span>
                )}
              </p>
              <p className="text-[11px] text-white-200 truncate">
                {[e.company, e.place, e.period].filter(Boolean).join(" · ") ||
                  e.desc ||
                  "no details"}
              </p>
            </div>
            {!e.isDefault && (
              <>
                <button
                  onClick={() => edit(e)}
                  disabled={busy}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <FaPen size={10} /> Edit
                </button>
                <button
                  onClick={() => remove(e._id ?? e.id)}
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
            Nothing here yet — click &quot;New entry&quot; to add your first
            role. Lower priority numbers appear first on the timeline.
          </p>
        )}
      </div>
    </div>
  );
}