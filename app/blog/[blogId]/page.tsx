import Image from "next/image";

interface BlogDescriptionPageProps {
    params: {
        blogId: string;
    };
}

const BlogDescriptionPage = ({ params }: BlogDescriptionPageProps) => {
    const tags = ["Nature", "River", "Digital Art", "Scenery"];
    const contentDescription = "This image represents a beautiful digital art illustration of a serene river surrounded by lush greenery, captured in vibrant colors.This image represents a beautiful digital art illustration of a serene river surrounded by lush greenery, captured in vibrant colors.This image represents a beautiful digital art illustration of a serene river surrounded by lush greenery, captured in vibrant colors.This image represents a beautiful digital art illustration of a serene river surrounded by lush greenery, captured in vibrant colors.This image represents a beautiful digital art illustration of a serene river surrounded by lush greenery, captured in vibrant colors.This image represents a beautiful digital art illustration of a serene river surrounded by lush greenery, captured in vibrant colors.";

    return (
        <div className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
            <div>
                <Image
                    src='https://img.freepik.com/free-photo/digital-art-style-illustration-river-nature_23-2151825739.jpg?t=st=1729654123~exp=1729657723~hmac=52f412fa6fd10e39de1b8e3750f3923568d388844747c77c1963dfa032e8e1aa&w=1380'
                    width={1080}
                    height={220}
                    className="h-96 border rounded-md border-white-200 mt-8 object-center bg-center object-cover"
                    alt="cover-image"
                />

                <h1 className="font-bold text-4xl text-left mt-6 text-white">Beautiful Scenery</h1>

                {/* Mapping over tags array */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag, index) => (
                        <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Content description */}
                <p className="text-white-100 mt-4 text-left text-lg max-w-5xl">
                    {contentDescription}
                </p>
            </div>
        </div>
    );

}

export default BlogDescriptionPage