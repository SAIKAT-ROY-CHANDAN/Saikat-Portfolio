"use client";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import Icons from "@/Icons";

interface SkillEditorProps {
  skill?: any | null;
  onSaved?: () => void;
}

const inputCls =
  "w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-transparent transition";
const labelCls =
  "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white-200 mb-1.5";

function IconPreview({ icon }: { icon: string }) {
  const key = (icon ?? "").trim();
  const icons = Icons as Record<string, () => React.JSX.Element>;

  if (key && icons[key]) {
    const Comp = icons[key];
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#0a0f2c]/70 p-2">
        <Comp />
      </div>
    );
  }

  if (key) {
    return (
      <img
        src={key}
        alt={key}
        loading="lazy"
        className="h-16 w-16 rounded-xl border border-cyan-400/20 bg-[#0a0f2c]/70 object-contain p-2"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-white-200">
      ?
    </div>
  );
}

const SkillEditor = ({ skill = null, onSaved }: SkillEditorProps) => {
  const isEdit = !!skill;
  const id = skill?._id ?? skill?.id ?? null;

  const [name, setName] = useState(skill?.name ?? "");
  const [icon, setIcon] = useState(skill?.icon ?? "");
  const [priority, setPriority] = useState(
    skill?.priority != null ? String(skill.priority) : ""
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = {
      name,
      icon: icon.trim(),
      priority:
        priority === "" || Number.isNaN(Number(priority))
          ? undefined
          : Number(priority),
    };
    try {
      const url = id ? `/api/skills/${id}` : "/api/skills";
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
            <label className={labelCls}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="e.g. React, Tailwind, Docker"
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
              Lower number appears closer in the starfield.
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Icon</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className={inputCls}
            placeholder="react, css, nextjs ... or an image URL"
          />
          <p className="text-[11px] text-white-200 mt-1">
            Use a built-in key (<span className="text-cyan-300">github, html,
            nodejs, nextjs, mongodb, typescript, javascript, redux, react,
            framermotion, firebase, express, yarn, npm, css, prisma</span>) or
            any image URL, e.g. a{" "}
            <span className="text-white">
              cdn.jsdelivr.net/gh/devicons/devicon/...svg
            </span>{" "}
            link.
          </p>
          <div className="mt-3">
            <IconPreview icon={icon} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 bg-white text-black-100 font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-50 transition"
          >
            {busy && <FaSpinner className="animate-spin" />}
            {isEdit ? "Update Skill" : "Add Skill"}
          </button>
          {msg && <span className="text-xs text-red-300">{msg}</span>}
        </div>
      </div>
    </form>
  );
};

export default SkillEditor;