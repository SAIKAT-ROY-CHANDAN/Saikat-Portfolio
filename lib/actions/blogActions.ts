// 'use server'

// import Blog from "@/models/Blog";
// import { connectToDatabase } from "../dbConnect";

// export const getBlogs = async () => {
//   try {
//     await connectToDatabase();

//     const blogs = await Blog.find()

//     const plainBlogs = blogs.map(blog => blog.toObject());

//     console.log(plainBlogs, 'Blogs fetched successfully');
//     return plainBlogs;

//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     throw new Error('Failed to fetch blogs');
//   }
// };
