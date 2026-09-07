import { model, models, Schema } from "mongoose";

const AnalyticsEventSchema = new Schema(
  {
    type: { type: String, enum: ["pageview", "click"], required: true },
    page: { type: String, required: true },
    kind: { type: String, index: true },
    label: { type: String },
    target: { type: String },
    visitorId: { type: String },
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ type: 1, createdAt: -1 });
AnalyticsEventSchema.index({ kind: 1, label: 1 });
AnalyticsEventSchema.index({ visitorId: 1 });

const AnalyticsEvent =
  models.AnalyticsEvent || model("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;