// import { NextResponse } from 'next/server';
// import Blog from "@/models/Blog";
// import { connectToDatabase } from "@/lib/dbConnect";


// export async function POST(req: Request) {
//     try {
//         await connectToDatabase();

//         const body = await req.json();

//         const newBlog = await Blog.create({
//             title: body.title,
//             tags: body.tags,
//             content: body.content,
//             coverImage: body.coverImage
//         });

//         return NextResponse.json({ message: "Blog created successfully!", blog: newBlog });
//     } catch (error) {
//         console.error("Error creating blog:", error);
//         return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
//     }
// }

// export async function GET() {
//     try {
//         await connectToDatabase()
//         const blog = await Blog.find({})

//         if (!blog) {
//             return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//         }
//         console.log(blog);
//         return NextResponse.json(blog);
//     } catch (error: any) {
//         console.error('Error fetching blog:', error);
//         return NextResponse.json({ error: 'Failed to fetch blog: ' + error.message }, { status: 500 });
//     }
// }


// export async function PUT(req: Request) {
//     try {
//         await connectToDatabase();
//         const { id, title, tags, content, coverImage } = await req.json();

//         const updatedBlog = await Blog.findByIdAndUpdate(
//             id,
//             { title, tags, content, coverImage },
//             { new: true }
//         );

//         if (!updatedBlog) {
//             return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//         }

//         return NextResponse.json({ message: "Blog updated successfully!", blog: updatedBlog });
//     } catch (error: any) {
//         console.error('Error updating blog:', error);
//         return NextResponse.json({ error: 'Failed to update blog: ' + error.message }, { status: 500 });
//     }
// }

// export async function DELETE(req: Request) {
//     try {
//         await connectToDatabase();
//         const { id } = await req.json();

//         const deletedBlog = await Blog.findByIdAndDelete(id); // Delete the blog by ID

//         if (!deletedBlog) {
//             return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//         }

//         return NextResponse.json({ message: "Blog deleted successfully!", blog: deletedBlog });
//     } catch (error: any) {
//         console.error('Error deleting blog:', error);
//         return NextResponse.json({ error: 'Failed to delete blog: ' + error.message }, { status: 500 });
//     }
// }
