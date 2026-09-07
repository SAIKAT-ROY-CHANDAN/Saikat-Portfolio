import { cn } from "@/lib/utils";
import { FaLocationDot } from "react-icons/fa6";

const sortByPriority = (list: any[]) =>
  [...list].sort((a: any, b: any) => (a.priority ?? 1000) - (b.priority ?? 1000));

const Experience = async ({ items }: { items?: any[] }) => {
    const experience = sortByPriority(items ?? []);

    return (
        <section id="experience" className="relative overflow-hidden py-20">
            <style>{`
                @keyframes exp-ping {
                    0%   { transform: scale(0.6); opacity: 0.8; }
                    80%  { transform: scale(2.6); opacity: 0; }
                    100% { transform: scale(2.6); opacity: 0; }
                }
                @keyframes exp-scan {
                    0%   { top: -15%; opacity: 0; }
                    8%   { opacity: 1; }
                    92%  { opacity: 1; }
                    100% { top: 115%; opacity: 0; }
                }
            `}</style>

            <div className="pointer-events-none absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_60%)]" />
            <span className="exp-scan pointer-events-none absolute left-4 right-4 top-0 h-20 bg-gradient-to-b from-transparent via-purple-400/[0.07] to-transparent" />

            <h1 className="heading mt-10">
                My{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    work experience
                </span>
            </h1>
            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white-200">
                [ Mission Log // Timeline ]
            </p>

            <div className="relative mx-auto mt-16 max-w-5xl">
                {/* Data spine */}
                <span className="absolute left-6 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent md:left-1/2" />

                <div className="flex flex-col gap-10 md:gap-14">
                    {experience.map((card: any, i: number) => {
                        const id = card._id ?? card.id ?? i;
                        const right = i % 2 === 1;
                        return (
                            <div key={id} className="relative">
                                {/* Node on the spine */}
                                <span className="absolute left-6 top-8 -translate-x-1/2 md:left-1/2 md:top-10">
                                    <span className="block size-3 rounded-full border border-cyan-300 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                                    <span className="absolute inset-0 rounded-full bg-cyan-400/60 [animation:exp-ping_2.4s_ease-out_infinite]" />
                                </span>

                                <div
                                    className={cn(
                                        "flex pl-12 md:pl-0",
                                        right ? "md:justify-end" : "md:justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-full md:w-[calc(50%-2rem)]",
                                            right && "md:text-right"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "group relative rounded-2xl border border-cyan-400/15 bg-[#04071D]/80 p-5 backdrop-blur transition duration-300 hover:border-purple-400/50 hover:shadow-[0_0_28px_rgba(139,92,246,0.2)]",
                                                right ? "md:text-left" : ""
                                            )}
                                        >
                                            {/* HUD corner brackets */}
                                            <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-cyan-400/40" />
                                            <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan-400/40" />

                                            <div
                                                className={cn(
                                                    "flex items-start gap-3",
                                                    right && "md:flex-row-reverse"
                                                )}
                                            >
                                                {card.thumbnail && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={card.thumbnail}
                                                        alt={card.title ?? "experience"}
                                                        loading="lazy"
                                                        className="size-12 shrink-0 rounded-lg border border-white/10 bg-white/5 object-contain p-1.5"
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-white text-lg sm:text-xl">
                                                        {card.title}
                                                    </h3>
                                                    {card.company && (
                                                        <p className="mt-0.5 text-sm font-semibold text-purple-200">
                                                            {card.company}
                                                        </p>
                                                    )}
                                                    <div
                                                        className={cn(
                                                            "mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1",
                                                            right && "md:justify-end"
                                                        )}
                                                    >
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300">
                                                            {card.period || "Mission log"}
                                                        </span>
                                                        {card.place && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-white-200">
                                                                <FaLocationDot
                                                                    className="text-cyan-300"
                                                                    size={11}
                                                                />
                                                                {card.place}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <p
                                                className={cn(
                                                    "mt-3 text-sm leading-relaxed text-white-100",
                                                    right && "md:text-left"
                                                )}
                                            >
                                                {card.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!experience.length && (
                    <p className="mt-16 text-center text-sm text-white-200">
                        No mission records yet.
                    </p>
                )}
            </div>
        </section>
    );
};

export default Experience;