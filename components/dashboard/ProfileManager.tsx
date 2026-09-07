"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa6";

const ABOUT_COUNT = 6;

export default function ProfileManager({
  profile = null,
}: {
  profile?: any | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    heroTagline: profile?.heroTagline ?? "",
    heroTitle: profile?.heroTitle ?? "",
    heroSubtitle: profile?.heroSubtitle ?? "",
    cvLink: profile?.cvLink ?? "",
    email: profile?.email ?? "",
  });
  const [socials, setSocials] = useState<{ img: string; link: string }[]>(
    (profile?.socials ?? []).map((s: any) => ({
      img: s.img ?? "",
      link: s.link ?? "",
    }))
  );
  const [aboutTexts, setAboutTexts] = useState<{ title: string; description: string }[]>(
    Array.from(
      { length: ABOUT_COUNT },
      (_, i) => profile?.aboutTexts?.[i] ?? { title: "", description: "" }
    )
  );
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setMsg(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, socials, aboutTexts }),
    });
    setMsg(res.ok ? "Profile saved!" : "Save failed — admin login required.");
    if (res.ok) router.refresh();
  };

  const setAbout = (i: number, field: "title" | "description", value: string) =>
    setAboutTexts(aboutTexts.map((a, j) => (j === i ? { ...a, [field]: value } : a)));

  const inputCls =
    "bg-gray-50 text-black-100 rounded-md p-2 text-sm border border-gray-300";

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Hero, about & contact profile</h2>
      <div className="grid md:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#04071D] border border-white/10">
        {(
          [
            ["heroTagline", "Tagline"],
            ["heroTitle", "Hero title"],
            ["heroSubtitle", "Subtitle"],
            ["cvLink", "CV download link"],
            ["email", "Contact email"],
          ] as const
        ).map(([key, label]) => (
          <input
            key={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={label}
            className={`${inputCls} md:col-span-2`}
          />
        ))}

        <div className="md:col-span-2">
          <p className="text-sm text-white font-semibold mb-2">
            About section texts (6 boxes){" "}
            <span className="text-white-200 font-normal">
              — leave empty to keep the default
            </span>
          </p>
          {aboutTexts.map((a, i) => (
            <div key={i} className="border border-white/10 rounded-xl p-3 mb-3 bg-white/5">
              <p className="text-[11px] uppercase tracking-wider text-white-200 font-bold mb-2">
                Box {i + 1}
              </p>
              <input
                value={a.title}
                onChange={(e) => setAbout(i, "title", e.target.value)}
                placeholder={`Box ${i + 1} title`}
                className={`${inputCls} w-full mb-2`}
              />
              <input
                value={a.description}
                onChange={(e) => setAbout(i, "description", e.target.value)}
                placeholder={`Box ${i + 1} description (optional)`}
                className={`${inputCls} w-full`}
              />
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <p className="text-sm text-white font-semibold mb-2">
            Social links (icon path + URL)
          </p>
          {socials.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={s.img}
                onChange={(e) =>
                  setSocials(socials.map((x, j) => (j === i ? { ...x, img: e.target.value } : x)))
                }
                placeholder="/git.svg"
                className={`${inputCls} flex-1`}
              />
              <input
                value={s.link}
                onChange={(e) =>
                  setSocials(socials.map((x, j) => (j === i ? { ...x, link: e.target.value } : x)))
                }
                placeholder="https://..."
                className={`${inputCls} flex-[2]`}
              />
              <button
                onClick={() => setSocials(socials.filter((_, j) => j !== i))}
                className="text-xs text-red-300 px-2"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setSocials([...socials, { img: "", link: "" }])}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white"
          >
            <FaPlus size={11} /> Add social
          </button>
        </div>

        <div className="md:col-span-2 flex gap-3 items-center">
          <button
            onClick={save}
            className="bg-white text-black-100 font-bold text-sm px-5 py-2 rounded-xl"
          >
            Save profile
          </button>
          {msg && <span className="text-xs text-white-100">{msg}</span>}
        </div>
      </div>
    </div>
  );
}