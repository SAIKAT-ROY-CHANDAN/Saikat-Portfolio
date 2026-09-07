"use client";
import { useRef, useState } from "react";
import { FaImage, FaSpinner, FaTrash, FaUpload } from "react-icons/fa6";
import { compressImage, uploadImageToImgbb } from "@/utils/uploadImage";

interface ExperienceEditorProps {
  experience?: any | null;
  onSaved?: () => void;
}

const inputCls =
  "w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-transparent transition";
const labelCls =
  "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white-200 mb-1.5";

const ExperienceEditor = ({ experience = null, onSaved }: ExperienceEditorProps) => {
  const isEdit = !!experience;
  const id = experience?._id ?? experience?.id ?? null;

  const [title, setTitle] = useState(experience?.title ?? "");
  const [period, setPeriod] = useState(experience?.period ?? "");
  const [company, setCompany] = useState(experience?.company ?? "");
  const [place, setPlace] = useState(experience?.place ?? "");
  const [thumbnail, setThumbnail] = useState(experience?.thumbnail ?? "");
  const [desc, setDesc] = useState(experience?.desc ?? "");
  const [priority, setPriority] = useState(
    experience?.priority != null ? String(experience.priority) : ""
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);

  const handleThumbChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const compressed = await compressImage(file);
      const url = await uploadImageToImgbb(compressed);
      if (url) setThumbnail(url);
      else setMsg("Image upload failed");
    } catch {
      setMsg("Image upload failed");
    } finally {
      setUploading(false);
      if (thumbFileRef.current) thumbFileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = {
      title,
      period,
      company,
      place,
      thumbnail,
      desc,
      priority:
        priority === "" || Number.isNaN(Number(priority))
          ? undefined
          : Number(priority),
    };
    try {
      const url = id ? `/api/experience/${id}` : "/api/experience";
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
            <label className={labelCls}>Role / title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="e.g. Lead Frontend Developer"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Company name</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputCls}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className={labelCls}>From — To (dates)</label>
            <input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={inputCls}
              placeholder="e.g. Oct 2023 — Present"
            />
          </div>
          <div>
            <label className={labelCls}>Workplace / location</label>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className={inputCls}
              placeholder="e.g. Remote, Dhaka"
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
              Lower number appears higher on the timeline.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <label className={labelCls}>Logo / image</label>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => thumbFileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              {uploading ? <FaSpinner className="animate-spin" /> : <FaImage />}
              {thumbnail ? "Replace image" : "Upload image"}
            </button>
            {thumbnail && (
              <button
                type="button"
                onClick={() => setThumbnail("")}
                className="inline-flex items-center gap-1 text-xs text-white-200 underline hover:text-white"
              >
                <FaTrash size={10} /> Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className={`${inputCls} mt-3`}
            placeholder="...or paste an image URL"
          />
          <input
            ref={thumbFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbChange}
          />
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt="preview"
              loading="lazy"
              className="mt-3 size-20 rounded-xl border border-white/10 bg-white/5 object-contain p-2"
            />
          )}
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-white-200">
            <FaUpload size={11} className="text-purple-300" /> PNG, JPG or WebP
            (max 1 MB after compression)
          </p>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="What you did in this role"
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
            {isEdit ? "Update Entry" : "Add Entry"}
          </button>
          {msg && <span className="text-xs text-red-300">{msg}</span>}
        </div>
      </div>
    </form>
  );
};

export default ExperienceEditor;