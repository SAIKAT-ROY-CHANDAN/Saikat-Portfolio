import { model, models, Schema } from "mongoose";

const EducationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    yearsAttended: { type: String, default: "" },
    certificate: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { timestamps: true }
);

EducationSchema.index({ createdAt: 1 });

const Education =
  models.Education || model("Education", EducationSchema);

export default Education;
