import { model, models, Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    heroTagline: { type: String, default: "Dynamic Web Magic with Saikat" },
    heroTitle: {
      type: String,
      default: "Transforming Concepts into Seamless User Experiences",
    },
    heroSubtitle: { type: String, default: "Hi! I'm Saikat, a React/Next.js Developer based in Bangladesh." },
    cvLink: {
      type: String,
      default:
        "https://drive.google.com/uc?export=download&id=1jZ7DFzizL6wO_HUPhHhtXL9Cv-Bw3nOO",
    },
    email: { type: String, default: "saikotroydev@gmail.com" },
    introVideoUrl: { type: String, default: "" },
    socials: {
      type: [{ img: String, link: String }],
      default: [],
    },
    aboutTexts: {
      type: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    gridTexts: {
      type: [
        {
          tagline: { type: String, default: "" },
          title: { type: String, default: "" },
          subtitle: { type: String, default: "" },
          description: { type: String, default: "" },
          badge: { type: String, default: "" },
          chips: { type: [String], default: [] },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// During dev hot-reload Mongoose caches the compiled model, so schema edits
// would be silently ignored (strict mode strips new fields on save).
// Delete any cached model so the latest schema always takes effect.
if (models.Profile) {
  delete models.Profile;
}

const Profile = models.Profile || model("Profile", ProfileSchema);

export default Profile;
