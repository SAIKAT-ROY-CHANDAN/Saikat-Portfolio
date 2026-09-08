"use client";
import { useRef, useState } from "react";
import { FaSpinner, FaUpload } from "react-icons/fa6";
import Icons from "@/Icons";
import { compressImage, uploadImageToImgbb } from "@/utils/uploadImage";
import { skillCategories } from "@/data";

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
  const [category, setCategory] = useState(
    skillCategories.some((c) => c.key === skill?.category)
      ? skill.category
      : "frontend"
  );
  const [priority, setPriority] = useState(
    skill?.priority != null ? String(skill.priority) : ""
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const iconFileRef = useRef<HTMLInputElement>(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    setMsg(null);
    try {
      const compressed = await compressImage(file);
      const url = await uploadImageToImgbb(compressed);
      if (url) {
        setIcon(url);
        setMsg("Icon uploaded!");
      } else {
        setMsg("Icon upload failed — try a different image.");
      }
    } catch {
      setMsg("Icon upload failed — try a different image.");
    } finally {
      setUploadingIcon(false);
      if (iconFileRef.current) iconFileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = {
      name,
      icon: icon.trim(),
      category: category as string,
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
          <label className={labelCls}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            {skillCategories.map((c) => (
              <option key={c.key} value={c.key} className="bg-black-200 text-white">
                {c.label} — {c.tagline}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-white-200 mt-1">
            Groups this skill under one of the starfield sectors shown on the
            homepage.
          </p>
        </div>

        <div>
          <label className={labelCls}>Icon</label>
          <input
            type="file"
            accept="image/*"
            ref={iconFileRef}
            onChange={handleIconUpload}
            className="hidden"
          />
          <div className="flex gap-2">
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={inputCls}
              placeholder="react, css, nextjs ... or an image URL"
            />
            <button
              type="button"
              onClick={() => iconFileRef.current?.click()}
              disabled={uploadingIcon}
              className="shrink-0 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50 transition"
            >
              {uploadingIcon ? <FaSpinner className="animate-spin" /> : <FaUpload />}
              Upload
            </button>
          </div>
          <p className="text-[11px] text-white-200 mt-1">
            Use a built-in key (<span className="text-cyan-300">github, html,
            nodejs, nextjs, mongodb, typescript, javascript, redux, react,
            framermotion, firebase, express, yarn, npm, css, prisma,
            three, drizzle</span>), paste an image URL, or click{" "}
            <span className="text-white">Upload</span> to pick a logo file from
            your computer.
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