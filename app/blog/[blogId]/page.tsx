import Image from "next/image";

interface BlogDescriptionPageProps {
    params: {
        blogId: string;
    };
}

const BlogDescriptionPage = async ({ params }: BlogDescriptionPageProps) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${params?.blogId}`, {
        cache: 'no-store',
    });

    const blog = await response.json();

    return (
        <div className="relative bg-black-100 mb-10 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
            <div>
                <Image
                    src={blog.coverImage}
                    width={1080}
                    height={220}
                    className="h-96 border rounded-md border-white-200 mt-8 object-center bg-center object-cover"
                    alt="cover-image"
                />

                <h1 className="font-bold text-4xl text-left mt-6 text-white">{blog.title}</h1>

                {/* Mapping over tags array */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {blog.tags.map((tag: string, index: string) => (
                        <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Content description */}
                <div
                    dangerouslySetInnerHTML={{ __html: blog.content || 'No description available.' }}
                    className="text-white-100 mt-4 text-left text-lg max-w-5xl"
                />
            </div>
        </div>
    );

}

export default BlogDescriptionPage