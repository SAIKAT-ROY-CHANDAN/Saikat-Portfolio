"use client";

import React, { useEffect, useMemo, useState } from "react";
import Icons from "@/Icons";
import { skills as fallbackSkills, skillCategories } from "@/data";

interface SkillItem {
    name?: string;
    icon?: string;
    category?: string;
}

const CATEGORY_KEYS = new Set<string>(
    skillCategories.map((c) => c.key)
);

function SkillIcon({ icon }: { icon?: string }) {
    const key = (icon ?? "").trim();
    const icons = Icons as Record<string, () => React.JSX.Element>;

    if (key && icons[key]) {
        const Comp = icons[key];
        return <Comp />;
    }

    if (key) {
        return (
            <img
                src={key}
                alt={key}
                loading="lazy"
                className="h-8 w-8 object-contain"
            />
        );
    }

    return <span className="text-xs font-bold text-cyan-300">?</span>;
}

export function Skills({ skills: propSkills }: { skills?: SkillItem[] } = {}) {
    const [skills, setSkills] = useState<SkillItem[]>(propSkills ?? []);

    useEffect(() => {
        if (propSkills && propSkills.length) return;
        fetch("/api/skills")
            .then((r) => r.json())
            .then((data) =>
                setSkills(
                    Array.isArray(data) && data.length ? data : fallbackSkills
                )
            )
            .catch(() => setSkills(fallbackSkills));
    }, [propSkills]);

    const list = useMemo<SkillItem[]>(
        () =>
            skills.length
                ? skills.map((s) => ({
                      name: s.name ? String(s.name) : "Skill",
                      icon: s.icon ?? "",
                      category:
                          s.category && CATEGORY_KEYS.has(s.category)
                              ? s.category
                              : "frontend",
                  }))
                : [],
        [skills]
    );

    const groups = useMemo(
        () =>
            skillCategories
                .map((c) => ({
                    ...c,
                    items: list.filter((s) => s.category === c.key),
                }))
                .filter((g) => g.items.length),
        [list]
    );

    if (!groups.length) return null;

    return (
        <section id="skills" className="relative overflow-hidden py-20">
            <style>{`
                @keyframes skill-scan {
                    0%   { top: -15%; opacity: 0; }
                    8%   { opacity: 1; }
                    92%  { opacity: 1; }
                    100% { top: 115%; opacity: 0; }
                }
                @keyframes skill-float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-6px); }
                }
            `}</style>

            <div className="pointer-events-none absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.07),transparent_60%)]" />
            <span className="skill-scan pointer-events-none absolute left-4 right-4 top-0 h-20 bg-gradient-to-b from-transparent via-cyan-400/[0.07] to-transparent" />
            <span className="pointer-events-none absolute left-1/2 top-2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <h1 className="heading mt-10">
                Technical{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Proficiencies
                </span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl px-4 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-white-200">
                System layered by domain &mdash; frontend, backend, data, ops
            </p>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {skillCategories.map((c) => (
                    <span
                        key={c.key}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                        style={{
                            borderColor: `${c.accent}40`,
                            color: c.accent,
                        }}
                    >
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                                background: c.accent,
                                boxShadow: `0 0 8px ${c.accent}`,
                            }}
                        />
                        {c.label}
                    </span>
                ))}
            </div>

            <div className="relative mx-auto mt-12 grid max-w-6xl gap-6 px-2 sm:px-4">
                {groups.map((g, gi) => (
                    <div
                        key={g.key}
                        className="relative rounded-3xl border bg-[#04071D]/60 p-5 backdrop-blur sm:p-8"
                        style={{
                            borderColor: `${g.accent}33`,
                            boxShadow: `0 0 60px ${g.accent}0d`,
                        }}
                    >
                        {/* HUD corner brackets */}
                        <span
                            className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 rounded-tl-3xl"
                            style={{ borderColor: `${g.accent}55` }}
                        />
                        <span
                            className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 rounded-tr-3xl"
                            style={{ borderColor: `${g.accent}55` }}
                        />
                        <span
                            className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 rounded-bl-3xl"
                            style={{ borderColor: `${g.accent}55` }}
                        />
                        <span
                            className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 rounded-br-3xl"
                            style={{ borderColor: `${g.accent}55` }}
                        />

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span
                                className="font-mono text-xs font-bold"
                                style={{ color: `${g.accent}cc` }}
                            >
                                0{gi + 1}
                            </span>
                            <span
                                className="h-1.5 w-1.5 animate-pulse rounded-full"
                                style={{
                                    background: g.accent,
                                    boxShadow: `0 0 12px ${g.accent}`,
                                }}
                            />
                            <div>
                                <h3
                                    className="text-lg uppercase tracking-[0.18em] sm:text-xl"
                                    style={{ color: g.accent }}
                                >
                                    {g.label}
                                </h3>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-white-200">
                                    {g.tagline}
                                </p>
                            </div>
                            <span
                                className="ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-widest"
                                style={{
                                    borderColor: `${g.accent}40`,
                                    color: g.accent,
                                }}
                            >
                                {String(g.items.length).padStart(2, "0")}
                            </span>
                        </div>

                        <div
                            className="mt-4 h-px w-full"
                            style={{
                                background: `linear-gradient(90deg, ${g.accent}70, transparent)`,
                            }}
                        />

                        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-6 sm:gap-x-7">
                            {g.items.map((s, i) => (
                                <div
                                    key={`${g.key}-${i}`}
                                    className="flex w-[92px] flex-col items-center gap-2"
                                    style={{
                                        animation:
                                            "skill-float 4s ease-in-out infinite",
                                        animationDelay: `${i * 0.25}s`,
                                    }}
                                >
                                    <div
                                        className="group relative flex h-16 w-16 items-center justify-center rounded-xl border bg-[#0a0f2c]/70 backdrop-blur transition duration-300 hover:scale-105 sm:h-[70px] sm:w-[70px]"
                                        style={{
                                            borderColor: `${g.accent}30`,
                                            boxShadow: `0 0 16px ${g.accent}14`,
                                        }}
                                    >
                                        <span
                                            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                                            style={{
                                                background: `linear-gradient(135deg, ${g.accent}22, transparent 70%)`,
                                            }}
                                        />
                                        <span
                                            className="flex h-8 w-8 items-center justify-center transition duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]"
                                            style={{ color: g.accent }}
                                        >
                                            <SkillIcon icon={s.icon} />
                                        </span>
                                    </div>
                                    <span className="max-w-[92px] break-words text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white-200">
                                        {s.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}