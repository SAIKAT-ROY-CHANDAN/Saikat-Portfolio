function getYouTubeId(url: string): string | null {
    if (!url) return null;
    const trimmed = url.trim();
    const match = trimmed.match(
        /(?:[?&]v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([\w-]{11,12})(?:[?&#/]|$)/
    );
    return match ? match[1] : null;
}

const isValidYouTubeUrl = (url: string) => /youtu\.?be/i.test(url);

const IntroVideo = ({ videoUrl }: { videoUrl?: string }) => {
    const url = videoUrl?.trim() ?? "";
    if (!url) return null;

    const id = getYouTubeId(url);

    return (
        <section id="intro" className="relative py-20">
            <h1 className="heading">
                A quick{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">introduction</span>
            </h1>
            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-white-200">
                hi, hello — in under a minute
            </p>

            <div className="mx-auto mt-12 w-full max-w-3xl px-4">
                {id ? (
                    <>
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#04071D] shadow-[0_0_60px_-15px_rgba(139,92,246,0.4)]">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${id}`}
                                title="Introduction video"
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#04071D] px-6 py-10 text-center">
                        <p className="text-sm text-white-100">
                            {isValidYouTubeUrl(url)
                                ? "Couldn't read this YouTube link. Make sure it's a standard watch/shorts/embed URL."
                                : "The intro video link doesn't look like a YouTube URL."}
                        </p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                        >
                            Open video on YouTube
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default IntroVideo;