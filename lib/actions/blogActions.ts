'use server'

import Blog from "@/models/Blog";
import { connectToDatabase } from "../dbConnect";
import { IBlog } from "@/types";


export const createBlog = async (params: IBlog) => {
  try {
    await connectToDatabase();

    const newBlog = await Blog.create({
      title: params.title,
      tags: params.tags,
      content: params.content,
      coverImage: params.coverImage,
    });
    const plainBlog = newBlog.toObject();

    console.log(plainBlog, 'Blog created successfully');
    return plainBlog; // Return the plain object

  } catch (error) {
    console.error(error);
    throw error;
  }
};
