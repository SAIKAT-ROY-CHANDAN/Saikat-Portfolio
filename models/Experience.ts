import { model, models, Schema } from "mongoose";

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    thumbnail: { type: String, default: "/exp1.svg" },
    className: { type: String, default: "md:col-span-2" },
    period: { type: String, default: "" },
    company: { type: String, default: "" },
    place: { type: String, default: "" },
    priority: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ priority: 1, createdAt: -1 });

const Experience =
  models.Experience || model("Experience", ExperienceSchema);

export default Experience;
