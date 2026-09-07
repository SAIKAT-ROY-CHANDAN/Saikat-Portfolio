"use client";
import { useRef, useState } from "react";
import { FaImage, FaSpinner, FaTrash, FaUpload } from "react-icons/fa6";
import { compressImage, uploadImageToImgbb } from "@/utils/uploadImage";

interface TestimonialEditorProps {
  testimonial?: any | null;
  onSaved?: () => void;
}

const inputCls =
  "w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-transparent transition";
const labelCls =
  "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white-200 mb-1.5";

const TestimonialEditor = ({
  testimonial = null,
  onSaved,
}: TestimonialEditorProps) => {
  const isEdit = !!testimonial;
  const id = testimonial?._id ?? testimonial?.id ?? null;

  const [name, setName] = useState(testimonial?.name ?? "");
  const [title, setTitle] = useState(testimonial?.title ?? "");
  const [img, setImg] = useState(testimonial?.img ?? "");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [priority, setPriority] = useState(
    testimonial?.priority != null ? String(testimonial.priority) : ""
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const compressed = await compressImage(file);
      const url = await uploadImageToImgbb(compressed);
      if (url) setImg(url);
      else setMsg("Image upload failed");
    } catch {
      setMsg("Image upload failed");
    } finally {
      setUploading(false);
      if (imgFileRef.current) imgFileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = {
      name,
      title,
      img,
      quote,
      priority:
        priority === "" || Number.isNaN(Number(priority))
          ? undefined
          : Number(priority),
    };
    try {
      const url = id ? `/api/testimonials/${id}` : "/api/testimonials";
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
            <label className={labelCls}>Client name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="e.g. Saurov Paul"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Role / title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="e.g. CTO at Unicorniz Innovation"
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
              Lower number appears first in the grid.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <label className={labelCls}>Client photo</label>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => imgFileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              {uploading ? <FaSpinner className="animate-spin" /> : <FaImage />}
              {img ? "Replace photo" : "Upload photo"}
            </button>
            {img && (
              <button
                type="button"
                onClick={() => setImg("")}
                className="inline-flex items-center gap-1 text-xs text-white-200 underline hover:text-white"
              >
                <FaTrash size={10} /> Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className={`${inputCls} mt-3`}
            placeholder="...or paste a photo URL"
          />
          <input
            ref={imgFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImgChange}
          />
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt="preview"
              loading="lazy"
              className="mt-3 size-16 rounded-full border border-white/10 bg-white/5 object-cover"
            />
          )}
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-white-200">
            <FaUpload size={11} className="text-purple-300" /> PNG, JPG or WebP
            (max 1 MB after compression)
          </p>
        </div>

        <div>
          <label className={labelCls}>Testimonial quote</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="What they said about working with you"
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
            {isEdit ? "Update Testimonial" : "Add Testimonial"}
          </button>
          {msg && <span className="text-xs text-red-300">{msg}</span>}
        </div>
      </div>
    </form>
  );
};

export default TestimonialEditor;