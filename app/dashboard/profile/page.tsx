import { connectToDatabase } from "@/lib/dbConnect";
import Profile from "@/models/Profile";
import ProfileManager from "@/components/dashboard/ProfileManager";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let profile: any = null;
  try {
    await connectToDatabase();
    const doc = await Profile.findOne({ key: "main" }).lean().exec();
    profile = doc ? JSON.parse(JSON.stringify(doc)) : null;
  } catch {
    profile = null;
  }
  return <ProfileManager profile={profile} />;
}