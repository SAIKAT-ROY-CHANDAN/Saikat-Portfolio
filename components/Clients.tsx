import { getTestimonials } from "@/lib/content";

const sortByPriority = (list: any[]) =>
  [...list].sort((a: any, b: any) => (a.priority ?? 1000) - (b.priority ?? 1000));

const initialsOf = (name?: string) =>
  (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

const Clients = async ({ items }: { items?: any[] }) => {
  const testimonials = sortByPriority(items ?? (await getTestimonials()));

  return (
    <section id="testimonials" className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05),transparent_60%)]" />

      <h1 className="heading mt-0">
        Kind words from{" "}
        <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          satisfied clients
        </span>
      </h1>
      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white-200">
        [ Client Signals // Testimonials ]
      </p>

      <div className="relative mx-auto mt-16 max-w-6xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any, i: number) => {
            const id = t._id ?? t.id ?? i;
            return (
              <div
                key={id}
                className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#04071D]/80 p-6 backdrop-blur transition duration-300 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]"
              >
                {/* HUD corner brackets */}
                <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-cyan-400/40" />
                <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cyan-400/40" />

                <span className="pointer-events-none select-none font-serif text-6xl leading-none text-transparent bg-gradient-to-b from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text">
                  &ldquo;
                </span>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-white-100">
                  {t.quote}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  {t.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.img}
                      alt={t.name ?? "testimonial"}
                      loading="lazy"
                      className="size-11 shrink-0 rounded-full border border-cyan-400/30 bg-white/5 object-cover"
                    />
                  ) : (
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-[#0a0f2c]/70 text-xs font-bold text-cyan-200">
                      {initialsOf(t.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {t.name || "Anonymous"}
                    </p>
                    {t.title && (
                      <p className="truncate text-[11px] text-white-200">
                        {t.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!testimonials.length && (
          <p className="mt-16 text-center text-sm text-white-200">
            No client signals yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Clients;