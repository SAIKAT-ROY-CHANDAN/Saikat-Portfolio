import { connectToDatabase } from "@/lib/dbConnect";
import Education from "@/models/Education";
import ResourceManager from "@/components/dashboard/ResourceManager";

export const dynamic = "force-dynamic";

export default async function EducationPage() {
  let entries: any[] = [];
  try {
    await connectToDatabase();
    entries = JSON.parse(
      JSON.stringify(
        await Education.find({}).sort({ createdAt: 1 }).lean().exec()
      )
    );
  } catch {
    entries = [];
  }

  return (
    <ResourceManager
      title="Education"
      endpoint="/api/education"
      displayKey="title"
      entries={entries}
      fields={[
        { key: "title", label: "Institution", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "yearsAttended", label: "Years", type: "text" },
        { key: "certificate", label: "Certificate", type: "text" },
        { key: "url", label: "Image URL", type: "image" },
      ]}
    />
  );
}