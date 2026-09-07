import { model, models, Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    tags: { type: [String], default: [] },
    content: { type: String, required: true },
    coverImage: { type: String },
    // ---- social repost support: paste a LinkedIn/FB/X link ----
    sourceUrl: { type: String },
    sourcePlatform: {
      type: String,
      enum: ["native", "linkedin", "facebook", "x"],
      default: "native",
    },
    authorName: { type: String },
    authorHandle: { type: String },
    authorAvatar: { type: String },
    sourceText: { type: String },
    postedAt: { type: Date },
  },
  { timestamps: true }
);

BlogSchema.index({ createdAt: -1 });

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
