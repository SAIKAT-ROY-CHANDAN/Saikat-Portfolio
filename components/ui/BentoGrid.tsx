"use client"
import dynamic from "next/dynamic";
import { BackgroundGradientAnimation } from "./GradientBg";
import MagicButton from "./MagicButton";
const GridGlobe = dynamic(() => import("./GridGlobe"), { ssr: false });
const Lottie = dynamic(
    () => import("lottie-react").then((m) => ({ default: m.default })),
    { ssr: false }
);
import { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import animationData from "@/data/confetti.json"
import Image from "next/image";
import { cn } from "@/lib/utils";
import Icons from "@/Icons";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

function SkillIcon({ icon, size = 16 }: { icon?: string; size?: number }) {
    const key = (icon ?? "").trim();
    const icons = Icons as Record<string, () => React.JSX.Element>;

    const style = { width: size, height: size };

    if (key && icons[key]) {
        const Comp = icons[key];
        return (
            <span
                className="inline-flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                style={style}
            >
                <Comp />
            </span>
        );
    }

    if (key) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={key}
                alt={key}
                loading="lazy"
                style={style}
                className="shrink-0 object-contain"
            />
        );
    }

    return null;
}

export const BentoGridItem = ({
    className,
    id,
    title,
    description,
    img,
    imgClassName,
    titleClassName,
    spareImg,
    tagline,
    subtitle,
    badge,
    globe,
    chips,
    skills,
}: {
    className?: string;
    id: number;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    img?: string;
    imgClassName?: string;
    titleClassName?: string;
    spareImg?: string;
    tagline?: string;
    subtitle?: string;
    badge?: string;
    globe?: boolean;
    chips?: string[];
    skills?: any[];
}) => {

    const isFeature = id === 1;

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        const text = "saikotroydev@gmail.com";
        navigator.clipboard.writeText(text);
        setCopied(true);
    };

    return (
        <div
            className={cn(
                "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
                className
            )}
            style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                    "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
        >
            <div className={`${id === 6 && "flex justify-center"} h-full`}>
                <div className="w-full h-full absolute">
                    {img && (
                        <Image
                            width={1080}
                            height={720}
                            src={img}
                            alt={img}
                            className={cn(imgClassName, "object-cover object-center ")}
                        />
                    )}
                </div>
                {isFeature && (
                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#04071D] via-[#04071D]/45 to-[#04071D]/5" />
                )}
                <div
                    className={`absolute right-0 -bottom-5 ${id === 5 && "w-full opacity-80"
                        } `}
                >
                    {spareImg && (
                        <Image
                            src={spareImg}
                            alt={spareImg}
                            width={1080}
                            height={720}
                            className="object-cover object-center w-full h-full"
                        />
                    )}
                </div>
                {id === 6 && (
                    // add background animation , remove the p tag
                    <BackgroundGradientAnimation>
                        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
                    </BackgroundGradientAnimation>
                )}

                <div
                    className={cn(
                        titleClassName,
                        "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
                    )}
                >
                    {isFeature && badge && (
                        <div className="pointer-events-none absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-sm">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {badge}
                        </div>
                    )}
                    {!isFeature && (
                        <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
                            {description}
                        </div>
                    )}
                    {tagline && (
                        <div className="font-mono text-[10px] lg:text-xs uppercase tracking-[0.3em] text-cyan-300 z-10 mt-2">
                            {tagline}
                        </div>
                    )}
                    <div
                        className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-10`}
                    >
                        {title}
                    </div>
                    {subtitle && (
                        <div className="font-mono text-[10px] lg:text-xs uppercase tracking-[0.2em] text-purple-300 z-10 mt-2">
                            {subtitle}
                        </div>
                    )}
                    {isFeature && description && (
                        <div className="font-sans text-sm text-[#C1C2D3] md:text-xs md:max-w-xs z-10 mt-3">
                            {description}
                        </div>
                    )}

                    {(globe || id === 2) && <GridGlobe />}
                    {id === 3 && skills && skills.length > 0 && (
                        <div className="z-10 mt-3 w-full">
                            <div className="grid w-full grid-cols-2 gap-1.5">
                                {skills
                                    .slice(0, 4)
                                    .map((s: any, i: number) => (
                                        <div
                                            key={s.name ?? i}
                                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#10132E]/80 px-2 py-1.5 transition-colors hover:border-cyan-400/30 hover:bg-[#161A31]"
                                        >
                                            <SkillIcon icon={s.icon} size={14} />
                                            <span className="truncate text-[11px] font-medium text-white-100">
                                                {s.name}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            {skills.length > 4 && (
                                <p className="mt-1.5 text-center text-[9px] uppercase tracking-[0.2em] text-white-200/50">
                                    +{skills.length - 4} more in skills
                                </p>
                            )}
                        </div>
                    )}
                    {chips && (
                        <div className="z-10 mt-5 flex flex-wrap gap-2">
                            {chips.map((chip) => (
                                <span
                                    key={chip}
                                    className="rounded-lg border border-white/10 bg-[#10132E] px-3 py-1.5 text-[11px] lg:text-xs text-white-200"
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>
                    )}
                    {id === 6 && (
                        <div className="mt-5 relative">
                            <div
                                className={`absolute -bottom-5 right-0 ${copied ? "block" : "block"
                                    }`}
                            >
                                {copied && (
                                    <Lottie
                                        animationData={animationData}
                                        loop
                                        autoplay
                                        style={{ height: 200, width: 400 }}
                                    />
                                )}
                            </div>

                            <MagicButton
                                title={copied ? "Email is Copied!" : "Copy my email address"}
                                icon={<IoCopyOutline />}
                                position="left"
                                handleClick={handleCopy}
                                otherClasses="!bg-[#161A31]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
