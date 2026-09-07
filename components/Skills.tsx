"use client";

import React, {
    createRef,
    RefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Icons from "@/Icons";
import { AnimatedBeam } from "./ui/animated-beam";
import { skills as fallbackSkills } from "@/data";

interface SkillItem {
    name?: string;
    icon?: string;
}

// Only this many beams render at once (perf + not too cluttered).
const MAX_BEAMS = 18;

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
                className="h-7 w-7 object-contain"
            />
        );
    }

    return <span className="text-xs font-bold text-cyan-300">?</span>;
}

export function Skills({ skills: propSkills }: { skills?: SkillItem[] } = {}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hubRef = useRef<HTMLDivElement>(null);

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
                  }))
                : [],
        [skills]
    );

    // Even count keeps the core perfectly centered between the rows.
    const total = list.length;
    const topCount = total ? Math.ceil(total / 2) : 0;
    const top = list.slice(0, topCount);
    const bottom = list.slice(topCount);

    const nodeRefs = useMemo<RefObject<HTMLDivElement>[]>(
        () => list.map(() => createRef<HTMLDivElement>()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [total]
    );

    if (!total) return null;

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
                @keyframes core-ping {
                    0%   { transform: scale(0.55); opacity: 0.7; }
                    80%  { transform: scale(1.25); opacity: 0; }
                    100% { transform: scale(1.25); opacity: 0; }
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

            <div
                ref={containerRef}
                className="relative mx-auto my-14 flex min-h-[620px] w-full max-w-5xl flex-col justify-between px-2 pb-4"
            >
                {/* HUD corner brackets */}
                <span className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-cyan-400/30" />
                <span className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-cyan-400/30" />
                <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-cyan-400/30" />
                <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-cyan-400/30" />

                {/* Top constellation row */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6 sm:gap-x-6">
                    {top.map((s, i) => (
                        <div
                            key={`top-${i}`}
                            className="flex w-[96px] flex-col items-center gap-2"
                            style={{ animation: "skill-float 4s ease-in-out infinite" }}
                        >
                            <div
                                ref={nodeRefs[i]}
                                className="group relative flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#0a0f2c]/70 shadow-[0_0_16px_rgba(34,211,238,0.12)] backdrop-blur transition duration-300 hover:border-purple-400/70 hover:shadow-[0_0_26px_rgba(167,139,250,0.35)] sm:h-16 sm:w-16"
                            >
                                <span className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-cyan-400/10 to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                                <span className="flex h-7 w-7 items-center justify-center text-cyan-200 transition group-hover:text-white">
                                    <SkillIcon icon={s.icon} />
                                </span>
                            </div>
                            <span className="max-w-[96px] break-words text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white-200">
                                {s.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Core hub */}
                <div className="relative z-[2] my-8 flex items-center justify-center">
                    <span className="absolute h-40 w-40 rounded-full border border-cyan-400/15 [animation:core-ping_3.2s_ease-out_infinite]" />
                    <span className="absolute h-52 w-52 rounded-full border border-purple-400/15 [animation:core-ping_3.2s_ease-out_infinite_1.6s]" />
                    <span className="absolute -inset-5 animate-[spin_16s_linear_infinite] rounded-full border border-dashed border-cyan-300/20" />

                    <div
                        ref={hubRef}
                        className="relative z-[3] flex h-24 w-24 items-center justify-center rounded-2xl border border-cyan-300/40 bg-[#04071D]/90 shadow-[0_0_44px_rgba(34,211,238,0.28)] backdrop-blur"
                    >
                        <span className="bg-gradient-to-br from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text font-mono text-3xl font-bold text-transparent">
                            {"</>"}
                        </span>
                        <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                    </div>
                </div>

                {/* Bottom constellation row */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6 sm:gap-x-6">
                    {bottom.map((s, i) => {
                        const idx = topCount + i;
                        return (
                            <div
                                key={`bottom-${i}`}
                                className="flex w-[96px] flex-col items-center gap-2"
                                style={{
                                    animation: "skill-float 4s ease-in-out infinite",
                                    animationDelay: `${i * 0.3}s`,
                                }}
                            >
                                <div
                                    ref={nodeRefs[idx]}
                                    className="group relative flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#0a0f2c]/70 shadow-[0_0_16px_rgba(34,211,238,0.12)] backdrop-blur transition duration-300 hover:border-purple-400/70 hover:shadow-[0_0_26px_rgba(167,139,250,0.35)] sm:h-16 sm:w-16"
                                >
                                    <span className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-cyan-400/10 to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />
                                    <span className="flex h-7 w-7 items-center justify-center text-cyan-200 transition group-hover:text-white">
                                        <SkillIcon icon={s.icon} />
                                    </span>
                                </div>
                                <span className="max-w-[96px] break-words text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white-200">
                                    {s.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Data beams: each node feeds into the core */}
                {list.slice(0, MAX_BEAMS).map((_, i) => {
                    const isTop = i < topCount;
                    return (
                        <AnimatedBeam
                            key={`beam-${i}`}
                            containerRef={containerRef}
                            fromRef={nodeRefs[i]}
                            toRef={hubRef}
                            curvature={isTop ? 60 : -60}
                            endYOffset={isTop ? -6 : 6}
                            reverse={i % 2 === 1}
                            pathColor="rgba(34,211,238,0.35)"
                            pathWidth={1.5}
                            pathOpacity={0.55}
                            gradientStartColor="#22d3ee"
                            gradientStopColor="#a78bfa"
                            duration={5 + (i % 4)}
                            delay={i * 0.35}
                        />
                    );
                })}
            </div>
        </section>
    );
}