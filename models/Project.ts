import { model, models, Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    des: { type: String, required: true },
    img: { type: String, required: true },
    iconLists: { type: [String], default: [] },
    link: { type: String, required: true },
    priority: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

ProjectSchema.index({ priority: 1, createdAt: -1 });

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
