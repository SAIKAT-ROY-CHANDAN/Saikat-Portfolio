import { connectToDatabase } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { projects as defaultProjects } from "@/data";
import ProjectManager from "@/components/dashboard/ProjectManager";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let list: any[] = [];
  try {
    await connectToDatabase();
    list = JSON.parse(
      JSON.stringify(
        await Project.find({}).sort({ priority: 1, createdAt: -1 }).lean().exec()
      )
    );
  } catch {
    list = [];
  }
  const entries = list.length
    ? list
    : defaultProjects.map((p) => ({ ...p, isDefault: true }));
  return <ProjectManager projects={entries} />;
}