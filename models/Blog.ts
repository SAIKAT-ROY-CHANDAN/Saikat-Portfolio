import { model, models, Schema } from "mongoose";

const BlogSchema = new Schema({
    title: { type: String, required: true },
    tags: [String],
    content: { type: String, required: true },
    coverImage: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Check for an existing model or create a new one
const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;