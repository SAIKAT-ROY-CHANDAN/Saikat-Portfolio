import { model, models, Schema } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "" },
    category: {
      type: String,
      enum: ["frontend", "backend", "database", "devops", "tools"],
      default: "frontend",
    },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ name: 1 }, { unique: true });
SkillSchema.index({ priority: 1, createdAt: -1 });

const Skill = models.Skill || model("Skill", SkillSchema);

export default Skill;