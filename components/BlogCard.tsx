import Image from "next/image";
import { FollowerPointerCard } from "./ui/following-pointer";


const blogContent = {
    slug: "amazing-tailwindcss-grid-layouts",
    author: "Manu Arora",
    date: "28th March, 2023",
    title: "Amazing Tailwindcss Grid Layout Examples",
    description:
        "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcs grid and React.",
    image: "/blog-demo.jpg",
    authorAvatar: "/pro-gamer.png",
};



export function BlogCard() {
    return (
        <section id="blog" className="py-20">
            <h1 className="heading">
                Insights & Innovations from
                <span className="text-purple"> My Tech Journey</span>
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="w-80 mx-auto mt-10">
                        <FollowerPointerCard
                            title={
                                <TitleComponent
                                    title={blogContent.author}
                                    avatar={blogContent.authorAvatar}
                                />
                            }
                        >
                            <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-[#04071D] hover:shadow-xl border border-white-[0.2]">
                                <div className="w-full aspect-w-16 aspect-h-10 bg-white-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
                                    <Image
                                        src={blogContent.image}
                                        width={1080}
                                        height={720}
                                        alt="thumbnail"
                                        // layout="fill"
                                        objectFit="cover"
                                        className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `}
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="font-bold my-4 text-lg text-white">
                                        {blogContent.title}
                                    </h2>
                                    <h2 className="font-normal my-4 text-sm text-white-100">
                                        {blogContent.description}
                                    </h2>
                                    <div className="flex flex-row justify-between items-center mt-10">
                                        <span className="text-sm text-white-200">{blogContent.date}</span>
                                        <div className="relative z-10 px-6 py-2 bg-white text-black-100 font-bold rounded-xl block border border-white-[0.2] text-xs">
                                            Read More
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FollowerPointerCard>
                    </div>
                ))}
            </div>
        </section>
    );
}

const TitleComponent = ({
    title,
    avatar,
}: {
    title: string;
    avatar: string;
}) => (
    <div className="flex space-x-2 items-center">
        <Image
            src={avatar}
            height="20"
            width="20"
            alt="thumbnail"
            className="rounded-full border-2 border-white"
        />
        <p>{title}</p>
    </div>
);
