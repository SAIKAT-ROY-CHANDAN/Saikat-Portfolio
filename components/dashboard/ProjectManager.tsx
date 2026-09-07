"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectEditor from "./ProjectEditor";
import {
  FaPen,
  FaTrash,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa6";

export default function ProjectManager({
  projects = [],
}: {
  projects?: any[];
}) {
  const router = useRouter();
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const addNew = () => {
    setEditingProject(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const edit = (p: any) => {
    setEditingProject(p);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingProject(null);
    router.refresh();
  };

  if (showForm) {
    return (
      <div>
        <button
          onClick={handleSaved}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white-200 hover:text-white mb-5 transition"
        >
          <FaArrowLeft size={13} /> Back to all projects
        </button>
        <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-6">
          <ProjectEditor
            key={editingProject?._id ?? editingProject?.id ?? "new"}
            project={editingProject}
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
          Projects{" "}
          <span className="text-sm font-normal text-white-200">
            ({projects.length})
          </span>
        </h2>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <FaPlus /> New project
        </button>
      </div>

      {projects.some((p) => p.isDefault) && (
        <p className="text-[11px] text-white-200 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          Showing the default projects from the homepage. Create your own entry
          to take over this list.
        </p>
      )}

      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p._id ?? p.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-black-200 border border-white/10"
          >
            {p.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.img}
                alt=""
                className="size-11 rounded-lg object-cover border border-white/10"
                loading="lazy"
              />
            ) : (
              <div className="size-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white-200 text-xs">
                {p.title?.charAt(0)?.toUpperCase() ?? "P"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                {p.title || "(untitled)"}
                {p.priority != null && (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple/25 border border-purple/40 text-purple-100">
                    #{String(p.priority ?? p.id ?? "?").padStart(2, "0")}
                  </span>
                )}
                {p.isDefault && (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white-200">
                    default
                  </span>
                )}
              </p>
              <p className="text-[11px] text-white-200 truncate">
                {p.link ?? "no link"}
              </p>
            </div>
            {!p.isDefault && (
              <>
                <button
                  onClick={() => edit(p)}
                  disabled={busy}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <FaPen size={10} /> Edit
                </button>
                <button
                  onClick={() => remove(p._id ?? p.id)}
                  disabled={busy}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <FaTrash size={10} /> Delete
                </button>
              </>
            )}
          </div>
        ))}
        {!projects.length && (
          <p className="text-xs text-white-200">
            Nothing here yet — click &quot;New project&quot; to add your first
            one. Projects with a lower priority number show first.
          </p>
        )}
      </div>
    </div>
  );
}