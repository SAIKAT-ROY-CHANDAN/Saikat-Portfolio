import Image from "next/image";
import { FollowerPointerCard } from "./ui/following-pointer";
import { IBlog } from "@/types";
import Link from "next/link";

export async function BlogCard() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
        cache: 'no-store',
    });

    const blogs = await response.json();


    return (
        <section id="blog" className="py-20">
            <h1 className="heading">
                Insights & Innovations from
                <span className="text-purple"> My Tech Journey</span>
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-10">
                {blogs.map((blog: IBlog) => (
                    <div key={blog._id} className="w-80 mx-auto mt-10">
                        <FollowerPointerCard
                            title={
                                <TitleComponent
                                    title={'Saikat Roy Chandan'}
                                    avatar={`/IMG_20240315_180753.jpg`}
                                />
                            }
                        >
                            <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-[#04071D] hover:shadow-xl border border-white-[0.2]">
                                <div className="w-full aspect-w-16 aspect-h-10 h-[165px] bg-white-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
                                    <Image
                                        src={blog.coverImage || '/default-image.jpg'}
                                        width={1080}
                                        height={720}
                                        alt="thumbnail"
                                        objectFit="cover"
                                        className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200`}
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="font-bold my-4 line-clamp-2 text-lg text-white">
                                        {blog.title}
                                    </h2>
                                    <div
                                        className="font-normal my-4 text-sm text-white-100 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: blog.content || 'No description available.' }}
                                    />
                                    <div className="flex flex-row justify-between items-center mt-10">
                                        <span className="text-sm text-white-200">
                                            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Date not available'}
                                        </span>
                                        <Link href={`/blog/${blog?._id}`} className="relative cursor-pointer z-10 px-6 py-2 bg-white text-black-100 font-bold rounded-xl block border border-white-[0.2] text-xs">
                                            Read More
                                        </Link>
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
