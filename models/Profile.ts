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
  },
  { timestamps: true }
);

const Profile = models.Profile || model("Profile", ProfileSchema);

export default Profile;
