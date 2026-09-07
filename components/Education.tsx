import Image from 'next/image'
import React from 'react'
import { getEducation } from "@/lib/content";

const fallback = [
    {
        id: '1',
        url: 'https://i.ibb.co.com/84kr4rX/school-building1.jpg',
        title: 'Brojomohon School',
        description: 'Secondary School Certificate',
        yearsAttended: '2016 - 2017',
        certificate: 'SSC',
    },
    {
        id: '2',
        url: 'https://i.ibb.co.com/2NYt23B/school-building2.jpg',
        title: 'Govt. Barishal College',
        description: 'Higher School Certificate',
        yearsAttended: '2018 - 2020',
        certificate: 'HSC',
    },
    {
        id: '3',
        url: 'https://i.ibb.co.com/3c8tyKb/school-building3.jpg',
        title: 'Govt. Brojomohon College (NU)',
        description: 'Bachelor of Accounting',
        yearsAttended: '2021 - 2026',
        certificate: 'BBA',
    },
];


async function Education({ items: propItems }: { items?: any[] }) {
    const remote = propItems ?? (await getEducation());
    const items = (remote?.length ? remote : fallback).map((e: any, i: number) => ({
        id: e._id ?? e.id ?? String(i),
        url: e.url ?? e.img ?? fallback[0].url,
        title: e.title,
        description: e.description ?? e.desc ?? '',
        yearsAttended: e.yearsAttended ?? '',
        certificate: e.certificate ?? '',
    }));
    return (
        <section id='education'>
            <h1 className="heading">
                Academic Institutions
                <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"> & Years of Study</span>
            </h1>

            <div className="group flex max-md:flex-col justify-center gap-2 w-[85%] mx-auto mb-10 my-20">
                {items.map((item: any, i: number) => {
                    return (
                        <article key={item.id ?? i} className="group/article relative w-full rounded-xl overflow-hidden md:group-hover:[&:not(:hover)]:w-[20%] md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%] transition-all duration-300 before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-gradient-to-t before:from-black/50 before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:group-hover:[&:not(:hover)]:after:opacity-100 md:group-focus-within:[&:not(:focus-within):not(:hover)]:after:opacity-100 after:absolute after:inset-0 after:bg-white/30 after:backdrop-blur after:rounded-lg after:transition-all focus-within:ring focus-within:ring-indigo-300" style={{ transitionTimingFunction: "cubic-bezier(.5,.85,.25,1.15)" }}>
                            <a
                                className="absolute inset-0 text-white z-10  p-3 flex flex-col justify-end"
                                href="#0"
                            >
                                <h1 className=" text-xl font-medium   md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 group-hover/article:delay-300 group-focus-within/article:delay-300" style={{ transitionTimingFunction: "cubic-bezier(.5,.85,.25,1.8)" }}>
                                    {item?.title}
                                </h1>
                                <h1 className=" text-xl font-medium   md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 group-hover/article:delay-300 group-focus-within/article:delay-300" style={{ transitionTimingFunction: "cubic-bezier(.5,.85,.25,1.8)" }}>
                                    {item?.yearsAttended}
                                </h1>
                                <span className=" text-3xl font-medium  md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 group-hover/article:delay-500 group-focus-within/article:delay-500" style={{ transitionTimingFunction: "cubic-bezier(.5,.85,.25,1.8)" }}>
                                    {item?.description}
                                </span>
                            </a>
                            <Image
                                className="object-cover h-72 md:h-[420px]  w-full"
                                src={item?.url}
                                width="960"
                                height="480"
                                alt="Image 01"
                            />
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default Education
