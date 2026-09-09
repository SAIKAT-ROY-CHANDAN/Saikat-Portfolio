"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CARD_COUNT = 6;

interface CardText {
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  chips: string;
}

const emptyCard = (): CardText => ({
  tagline: "",
  title: "",
  subtitle: "",
  description: "",
  badge: "",
  chips: "",
});

export default function GridManager({ gridTexts = [] }: { gridTexts?: any[] }) {
  const router = useRouter();
  const [cards, setCards] = useState<CardText[]>(
    Array.from({ length: CARD_COUNT }, (_, i) => {
      const c = gridTexts[i] ?? {};
      return {
        tagline: c.tagline ?? "",
        title: c.title ?? "",
        subtitle: c.subtitle ?? "",
        description: c.description ?? "",
        badge: c.badge ?? "",
        chips: Array.isArray(c.chips) ? c.chips.join(", ") : "",
      };
    })
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const setField = (i: number, field: keyof CardText, value: string) =>
    setCards(cards.map((c, j) => (j === i ? { ...c, [field]: value } : c)));

  const save = async () => {
    setBusy(true);
    setMsg(null);
    const payload = cards.map((c) => ({
      tagline: c.tagline,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      badge: c.badge,
      chips: c.chips
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gridTexts: payload }),
      });
      setMsg(
        res.ok
          ? "Bento grid saved!"
          : "Save failed — admin login required."
      );
      if (res.ok) router.refresh();
    } catch {
      setMsg("Save failed — check the connection.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "bg-gray-50 text-black-100 rounded-md p-2 text-sm border border-gray-300 w-full";

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Bento grid texts</h2>
      <p className="text-xs text-white-200 mb-4">
        Edit the 6 boxes on the homepage “about” grid. Leave a field empty to
        keep the default.
      </p>

      <div className="space-y-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#04071D] border border-white/10 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/5">
              <p className="text-[11px] uppercase tracking-wider text-white-200 font-bold">
                Box {i + 1}
              </p>
              <span className="text-[10px] text-white-200/50">
                {["Intro", "Globe", "Tech stack", "Values", "Learning", "CTA"][i]}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-3 p-4">
              <input
                value={c.tagline}
                onChange={(e) => setField(i, "tagline", e.target.value)}
                placeholder="Tagline (small label, e.g. Hi, I'm)"
                className={inputCls}
              />
              <input
                value={c.title}
                onChange={(e) => setField(i, "title", e.target.value)}
                placeholder="Title (e.g. Saikat Roy Chandan)"
                className={inputCls}
              />
              <input
                value={c.subtitle}
                onChange={(e) => setField(i, "subtitle", e.target.value)}
                placeholder="Subtitle (e.g. React · Next.js Developer)"
                className={inputCls}
              />
              <input
                value={c.badge}
                onChange={(e) => setField(i, "badge", e.target.value)}
                placeholder="Badge (e.g. Open to work)"
                className={inputCls}
              />
              <textarea
                value={c.description}
                onChange={(e) => setField(i, "description", e.target.value)}
                placeholder="Description"
                rows={2}
                className={`${inputCls} md:col-span-2`}
              />
              <input
                value={c.chips}
                onChange={(e) => setField(i, "chips", e.target.value)}
                placeholder="Chips, comma separated (e.g. Clean code, Mobile-first UX)"
                className={`${inputCls} md:col-span-2`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3 items-center">
        <button
          onClick={save}
          disabled={busy}
          className="bg-white text-black-100 font-bold text-sm px-5 py-2 rounded-xl disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save bento grid"}
        </button>
        {msg && <span className="text-xs text-white-100">{msg}</span>}
      </div>
    </div>
  );
}