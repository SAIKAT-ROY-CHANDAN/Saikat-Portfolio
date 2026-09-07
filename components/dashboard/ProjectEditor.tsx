"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

interface ProjectEditorProps {
  project?: any | null;
  onSaved?: () => void;
}

const inputCls =
  "w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-transparent transition";
const labelCls = "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white-200 mb-1.5";

const ProjectEditor = ({ project = null, onSaved }: ProjectEditorProps) => {
  const isEdit = !!project;
  const id = project?._id ?? project?.id ?? null;

  const [title, setTitle] = useState(project?.title ?? "");
  const [des, setDes] = useState(project?.des ?? "");
  const [img, setImg] = useState(project?.img ?? "");
  const [iconLists, setIconLists] = useState<string>(
    Array.isArray(project?.iconLists) ? (project?.iconLists as string[]).join(", ") : ((project?.iconLists ?? "") as string)
  );
  const [link, setLink] = useState(project?.link ?? "");
  const [priority, setPriority] = useState(
    project?.priority != null ? String(project.priority) : ""
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const icons = iconLists
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = {
      title,
      des,
      img,
      iconLists: icons,
      link,
      priority:
        priority === "" || Number.isNaN(Number(priority))
          ? undefined
          : Number(priority),
    };
    try {
      const url = isEdit && id ? `/api/projects/${id}` : "/api/projects";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      onSaved?.();
    } catch {
      setMsg("Save failed — are you logged in as admin?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="Project title"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Priority / order</label>
            <input
              type="number"
              min={0}
              step={1}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputCls}
              placeholder="0 = shows first"
            />
            <p className="text-[11px] text-white-200 mt-1">
              Lower number appears first in the project grid.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Live link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={inputCls}
              placeholder="https://..."
              required
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Image URL</label>
          <input
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className={inputCls}
            placeholder="https://... or /path.png"
            required
          />
          {img && (
            <img
              src={img}
              alt="preview"
              className="mt-2 h-32 w-full object-cover rounded-xl border border-white/10"
              loading="lazy"
            />
          )}
        </div>

        <div>
          <label className={labelCls}>Icons (comma separated)</label>
          <input
            value={iconLists}
            onChange={(e) => setIconLists(e.target.value)}
            className={inputCls}
            placeholder="/next.svg, /tail.svg, /ts.svg"
          />
          {icons.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {icons.map((icon, i) => (
                <img
                  key={i}
                  src={icon}
                  alt={icon}
                  className="size-8 rounded-full border border-white/10 bg-black p-1.5"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={des}
            onChange={(e) => setDes(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Short project description"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-50 transition"
          >
            {busy && <FaSpinner className="animate-spin" />}
            {isEdit ? "Update Project" : "Create Project"}
          </button>
          {msg && <span className="text-xs text-red-300">{msg}</span>}
        </div>
      </div>
    </form>
  );
};

export default ProjectEditor;