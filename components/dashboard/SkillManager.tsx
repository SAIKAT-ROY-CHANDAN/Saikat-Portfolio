"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SkillEditor from "./SkillEditor";
import { FaArrowLeft, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import Icons from "@/Icons";
import { skillCategories } from "@/data";

function catMetaOf(s: any) {
  return (
    skillCategories.find((c) => c.key === s?.category) ?? skillCategories[0]
  );
}

function SkillIcon({ icon }: { icon?: string }) {
  const key = (icon ?? "").trim();
  const icons = Icons as Record<string, () => React.JSX.Element>;

  if (key && icons[key]) {
    const Comp = icons[key];
    return <Comp />;
  }

  if (key) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={key}
        alt={key}
        loading="lazy"
        className="size-6 object-contain"
      />
    );
  }

  return null;
}

export default function SkillManager({
  skills = [],
}: {
  skills?: any[];
}) {
  const router = useRouter();
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<any[]>(skills);

  // Keep the local list in sync if the server page re-renders.
  useEffect(() => {
    setItems(skills);
  }, [skills]);

  const reload = async () => {
    // Refetch from the API so a save/delete is reflected instantly in the
    // grouped list, instead of relying only on router.refresh().
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) setItems(data);
      }
    } catch {
      // ignore network hiccups; router.refresh() below still re-renders
    }
    router.refresh();
  };

  const addNew = () => {
    setEditingSkill(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const edit = (s: any) => {
    setEditingSkill(s);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    setBusy(true);
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    setBusy(false);
    reload();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingSkill(null);
    reload();
  };

  if (showForm) {
    return (
      <div>
        <button
          onClick={handleSaved}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white-200 hover:text-white mb-5 transition"
        >
          <FaArrowLeft size={13} /> Back to all skills
        </button>
        <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-6">
          <SkillEditor
            key={editingSkill?._id ?? editingSkill?.id ?? "new"}
            skill={editingSkill}
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
          Skills{" "}
          <span className="text-sm font-normal text-white-200">
            ({items.length})
          </span>
        </h2>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <FaPlus /> New skill
        </button>
      </div>

      {items.some((s) => s.isDefault) && (
        <p className="text-[11px] text-white-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          Showing the default skills from the homepage. Create your own entry to
          take over this list.
        </p>
      )}

      <div className="space-y-8">
        {skillCategories
          .map((c) => ({
            ...c,
            items: items.filter((s) => catMetaOf(s).key === c.key),
          }))
          .filter((g) => g.items.length)
          .map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: group.accent,
                    boxShadow: `0 0 8px ${group.accent}`,
                  }}
                />
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: group.accent }}
                >
                  {group.label}
                </h3>
                <span className="text-[10px] font-mono text-white-200">
                  ({group.items.length})
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: `${group.accent}30` }}
                />
              </div>

              <div className="space-y-2">
                {group.items.map((s) => (
                  <div
                    key={s._id ?? s.id ?? s.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
                  >
                    <div
                      className="flex size-11 items-center justify-center rounded-xl border bg-[#0a0f2c]/70"
                      style={{
                        borderColor: `${catMetaOf(s).accent}40`,
                        color: catMetaOf(s).accent,
                      }}
                    >
                      <SkillIcon icon={s.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                        {s.name || "(untitled)"}
                        {s.priority != null && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple/25 border border-purple/40 text-purple-100">
                            #{String(s.priority).padStart(2, "0")}
                          </span>
                        )}
                        {s.isDefault && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white-200">
                            default
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-white-200 truncate">
                        {s.icon || "no icon"}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border"
                      style={{
                        color: catMetaOf(s).accent,
                        borderColor: `${catMetaOf(s).accent}40`,
                        background: `${catMetaOf(s).accent}14`,
                      }}
                    >
                      {catMetaOf(s).label}
                    </span>
                    {!s.isDefault && (
                      <>
                        <button
                          onClick={() => edit(s)}
                          disabled={busy}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          <FaPen size={10} /> Edit
                        </button>
                        <button
                          onClick={() => remove(s._id ?? s.id)}
                          disabled={busy}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          <FaTrash size={10} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        {!items.length && (
          <p className="text-xs text-white-200">
            Nothing here yet — click &quot;New skill&quot; to add your first
            one. Skills with a lower priority number show first.
          </p>
        )}
      </div>
    </div>
  );
}