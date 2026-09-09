"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa6";

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url
    .trim()
    .match(/(?:[?&]v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([\w-]{11,12})(?:[?&#/]|$)/);
  return match ? match[1] : null;
}

function IntroVideoPreview({ url }: { url: string }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <div className="mt-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="Intro video preview"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

const inputCls =
  "bg-gray-50 text-black-100 rounded-md p-2 text-sm border border-gray-300 w-full";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[#04071D] border border-white/10 overflow-hidden">
      <header className="px-4 py-3 bg-white/5">
        <h3 className="text-[11px] uppercase tracking-wider text-white-200 font-bold">
          {title}
        </h3>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

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
    introVideoUrl: profile?.introVideoUrl ?? "",
  });
  const [socials, setSocials] = useState<{ img: string; link: string }[]>(
    (profile?.socials ?? []).map((s: any) => ({
      img: s.img ?? "",
      link: s.link ?? "",
    }))
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async (nextForm = form, nextSocials = socials) => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nextForm, socials: nextSocials }),
      });
      let text = res.ok ? "Profile saved!" : "Save failed — admin login required.";
      if (!res.ok) {
        try {
          text = (await res.json())?.error ?? text;
        } catch {
          // keep default message
        }
      }
      setMsg(text);
      if (res.ok) router.refresh();
    } catch {
      setMsg("Save failed — check the connection.");
    } finally {
      setBusy(false);
    }
  };

  const deleteVideo = async () => {
    const next = { ...form, introVideoUrl: "" };
    setForm(next);
    await save(next);
  };

  const fieldRows: [keyof typeof form, string][] = [
    ["heroTagline", "Tagline"],
    ["heroTitle", "Hero title"],
    ["heroSubtitle", "Subtitle"],
    ["cvLink", "CV download link"],
    ["email", "Contact email"],
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Profile</h2>
      <p className="text-xs text-white-200 mb-5">
        Hero headline, contact info, intro video and social links.
      </p>

      <div className="flex flex-col gap-5">
        <Section title="Hero & headline">
          <div className="grid md:grid-cols-2 gap-3">
            {fieldRows.map(([key, label]) => (
              <label
                key={key}
                className="block md:col-span-2 text-[11px] font-semibold uppercase tracking-wider text-white-200"
              >
                {label}
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={label}
                  className={`${inputCls} mt-1.5`}
                />
              </label>
            ))}
          </div>
        </Section>

        <Section title="Intro video">
          <p className="text-xs text-white-200 mb-3">
            Paste a YouTube link to show a video introduction on the homepage.
            The section only appears when a link is set.
          </p>
          <div className="flex flex-col gap-3">
            <input
              value={form.introVideoUrl}
              onChange={(e) => setForm({ ...form, introVideoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputCls}
            />
            {form.introVideoUrl && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={deleteVideo}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-200 hover:bg-red-500/25 disabled:opacity-50"
                >
                  <FaTrash size={11} /> Delete video
                </button>
                <span className="text-[11px] text-white-200/70">
                  Removing it hides the section on the homepage.
                </span>
              </div>
            )}
            <IntroVideoPreview url={form.introVideoUrl} />
          </div>
        </Section>

        <Section title="Bento grid texts">
          <p className="text-xs text-white-200">
            The 6 “about me” grid boxes are edited on the{" "}
            <a className="underline text-white-100" href="/dashboard/bentogrid">
              Bento Grid
            </a>{" "}
            page.
          </p>
        </Section>

        <Section title="Social links">
          <div className="space-y-2 mb-3">
            {socials.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={s.img}
                  onChange={(e) =>
                    setSocials(
                      socials.map((x, j) => (j === i ? { ...x, img: e.target.value } : x))
                    )
                  }
                  placeholder="icon path (e.g. /git.svg)"
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={s.link}
                  onChange={(e) =>
                    setSocials(
                      socials.map((x, j) => (j === i ? { ...x, link: e.target.value } : x))
                    )
                  }
                  placeholder="https://..."
                  className={`${inputCls} flex-[1.5]`}
                />
                <button
                  onClick={() => setSocials(socials.filter((_, j) => j !== i))}
                  className="shrink-0 text-xs text-red-300 px-2 py-1.5"
                  aria-label="Remove social link"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSocials([...socials, { img: "", link: "" }])}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-purple/30 border border-purple/50 text-white"
          >
            <FaPlus size={11} /> Add social
          </button>
        </Section>

        <div className="flex items-center gap-3">
          <button
            onClick={() => save()}
            disabled={busy}
            className="bg-white text-black-100 font-bold text-sm px-6 py-2.5 rounded-xl disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save profile"}
          </button>
          {msg && (
            <span
              className={`text-xs ${
                msg.includes("Saved") ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {msg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}