"use client";
import { useEffect, useState } from "react";
import { GrDownload } from "react-icons/gr";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

const Hero = ({ profile: propProfile }: { profile?: any } = {}) => {
  const [profile, setProfile] = useState<any>(propProfile ?? null);

  useEffect(() => {
    if (propProfile) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => {});
  }, [propProfile]);

  const cvLink =
    profile?.cvLink ??
    "https://drive.google.com/uc?export=download&id=1jZ7DFzizL6wO_HUPhHhtXL9Cv-Bw3nOO";
  const tagline = profile?.heroTagline ?? "Dynamic Web Magic with Saikat";
  const title =
    profile?.heroTitle ?? "Transforming Concepts into Seamless User Experiences";
  const subtitle =
    profile?.heroSubtitle ??
    "Hi! I'm Saikat, a React/Next.js Developer based in Bangladesh.";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = cvLink;
    link.setAttribute("download", "Saikat_Roy_Resume.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center pb-20 pt-24">
      {/* ----- full-bleed aurora glow (spans whole viewport, ignores container padding) ----- */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-clip">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_15%,rgba(139,92,246,0.18),transparent_50%),radial-gradient(100%_100%_at_15%_10%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(90%_90%_at_50%_100%,rgba(232,121,249,0.12),transparent_50%),radial-gradient(80%_80%_at_90%_90%,rgba(34,211,238,0.10),transparent_55%)]" />
        {/* slow drift layer for a little life */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[15%] top-[8%] h-[45vw] w-[45vw] max-h-[42rem] max-w-[42rem] rounded-full bg-purple-600/15 blur-[120px] animate-first" />
          <div className="absolute bottom-[4%] left-[30%] h-[40vw] w-[40vw] max-h-[36rem] max-w-[36rem] rounded-full bg-cyan-500/12 blur-[120px] animate-third" />
        </div>

        {/* subtle dot grid fading from center */}
        <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />

        {/* soft top haze */}
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_65%)]" />
      </div>

      {/* 3D moving background (runs in-browser, below content) */}
      <Hero3D />

      {/* centered content, no card */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-200 backdrop-blur-sm sm:text-[11px]">
            <span className="size-1.5 rounded-full bg-cyan-300 animate-pulse" />
            {tagline}
            <span className="size-1.5 rounded-full bg-purple-400 animate-pulse" />
          </span>
        </div>

        <TextGenerateEffect
          words={title}
          className="mt-8 text-[33px] leading-[1.15] sm:text-5xl lg:text-6xl"
        />

        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

        <p className="mx-auto mt-6 max-w-2xl text-sm text-white-200 md:mt-6 md:text-base md:tracking-wider lg:text-lg">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            onClick={handleDownload}
            className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-lg p-[1px] sm:w-60"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl">
              Download CV <GrDownload />
            </span>
          </a>

          <Link
            href="#projects"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-7 text-sm font-medium text-white-100 backdrop-blur transition hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white sm:w-auto"
          >
            Explore Projects
            <FaArrowRight
              size={13}
              className="text-cyan-300 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white-200/40">
          scroll
        </span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5">
          <span className="h-1.5 w-1 rounded-full bg-cyan-300 animate-bounce" />
        </span>
      </div>
    </section>
  );
};

export default Hero;