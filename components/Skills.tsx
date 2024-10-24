"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import Icons from "@/Icons";
import { AnimatedBeam } from "./ui/animated-beam";
import Image from "next/image";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function Skills() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);
    const div8Ref = useRef<HTMLDivElement>(null);
    const div9Ref = useRef<HTMLDivElement>(null);
    const div10Ref = useRef<HTMLDivElement>(null);
    const div11Ref = useRef<HTMLDivElement>(null);
    const div12Ref = useRef<HTMLDivElement>(null);
    const div13Ref = useRef<HTMLDivElement>(null);
    const div14Ref = useRef<HTMLDivElement>(null);
    const div15Ref = useRef<HTMLDivElement>(null);

    return (
        <section id="skills">
            <h1 className="heading mt-10">
                Technical
                <span className="text-purple"> Proficiencies</span>
            </h1>

            <div
                className="relative flex h-[500px] w-full justify-center overflow-hidden p-10 md:shadow-xl my-20"
                ref={containerRef}
            >
                <div className="flex size-full flex-col max-w-5xl h-[250px] items-stretch justify-between gap-10">
                    <div className="flex flex-row items-center justify-around">
                        <Circle ref={div14Ref}>
                            <Icons.css />
                        </Circle>
                        <Circle ref={div15Ref}>
                            <Icons.mongodb />
                        </Circle>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Circle ref={div1Ref}>
                            <Icons.nodejs />
                        </Circle>
                        <Circle ref={div8Ref}>
                            <Icons.mongodb />
                        </Circle>
                        <Circle ref={div9Ref}>
                            <Icons.redux />
                        </Circle>
                        <Circle ref={div5Ref}>
                            <Icons.typescript />
                        </Circle>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Circle ref={div2Ref}>
                            <Icons.github />
                        </Circle>
                        <Circle ref={div6Ref}>
                            <Icons.express />
                        </Circle>
                        <Circle ref={div4Ref} className="size-16">
                            <Icons.html />
                        </Circle>
                        <Circle ref={div6Ref}>
                            <Icons.javascript />
                        </Circle>
                        <Circle ref={div6Ref}>
                            <Icons.react />
                        </Circle>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <Circle ref={div3Ref}>
                            <Icons.nextjs />
                        </Circle>
                        <Circle ref={div10Ref}>
                            <Icons.framermotion />
                        </Circle>
                        <Circle ref={div11Ref}>
                            <Image width={1080} height={720} alt="mongoose" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongoose/mongoose-original.svg" />
                        </Circle>
                        <Circle ref={div7Ref}>
                            <Icons.firebase />
                        </Circle>
                    </div>
                    <div className="flex flex-row items-center justify-around">
                        <Circle ref={div12Ref}>
                            <Icons.yarn />
                        </Circle>
                        <Circle ref={div13Ref}>
                            <Icons.npm />
                        </Circle>
                    </div>
                </div>

                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div1Ref}
                    toRef={div4Ref}
                    curvature={-75}
                    endYOffset={-10}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div2Ref}
                    toRef={div4Ref}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div3Ref}
                    toRef={div4Ref}
                    curvature={75}
                    endYOffset={10}
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div5Ref}
                    toRef={div4Ref}
                    curvature={-75}
                    endYOffset={-10}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div6Ref}
                    toRef={div4Ref}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div7Ref}
                    toRef={div4Ref}
                    curvature={75}
                    endYOffset={10}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div8Ref}
                    toRef={div4Ref}
                    curvature={-85}
                    endYOffset={-20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div9Ref}
                    toRef={div4Ref}
                    curvature={-85}
                    endYOffset={-20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div10Ref}
                    toRef={div4Ref}
                    curvature={85}
                    endYOffset={20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div11Ref}
                    toRef={div4Ref}
                    curvature={85}
                    endYOffset={20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div12Ref}
                    toRef={div4Ref}
                    curvature={-50}
                    endYOffset={-20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div13Ref}
                    toRef={div4Ref}
                    curvature={-50}
                    endYOffset={-20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div14Ref}
                    toRef={div4Ref}
                    curvature={50}
                    endYOffset={20}
                    reverse
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div15Ref}
                    toRef={div4Ref}
                    curvature={50}
                    endYOffset={20}
                    reverse
                />
            </div>
        </section>
    );
}

