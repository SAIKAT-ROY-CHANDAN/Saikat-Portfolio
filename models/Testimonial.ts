import { model, models, Schema } from "mongoose";

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, default: "" },
    img: { type: String, default: "" },
    priority: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ priority: 1, createdAt: -1 });

const Testimonial =
  models.Testimonial || model("Testimonial", TestimonialSchema);

export default Testimonial;
