import { cache } from "react";
import { connectToDatabase } from "@/lib/dbConnect";
import { backfillSkillCategories } from "@/lib/skill-categories";
import Blog from "@/models/Blog";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Testimonial from "@/models/Testimonial";
import Education from "@/models/Education";
import Profile from "@/models/Profile";
import Skill from "@/models/Skill";
import { projects, skills, testimonials, workExperience, socialMedia } from "@/data";

const pick = <T,>(s: PromiseSettledResult<T>, fallback: T): T =>
  s.status === "fulfilled" ? s.value : fallback;

const toPlain = <T,>(rows: T[]): T[] =>
  JSON.parse(JSON.stringify(rows ?? [])) as T[];

/**
 * Single-connection, parallel DB batch for the homepage.
 * Replaces 6x HTTP self-fetches to /api/* (which forced dev to
 * compile every API route + open 6 connections per page load).
 * Still no-cache => dashboard edits show instantly.
 */
export const getHomepageData = cache(async () => {
  try {
    await connectToDatabase();
    await backfillSkillCategories();
  } catch {
    return {
      blogs: [],
      projects,
      experience: workExperience,
      testimonials,
      education: [],
      skills,
      profile: null,
    };
  }

  const [blogs, projectRows, expRows, testRows, eduRows, profile, skillRows] =
    await Promise.allSettled([
      Blog.find({}).sort({ createdAt: -1 }).limit(24).lean(),
      Project.find({}).sort({ createdAt: -1 }).limit(24).lean(),
      Experience.find({}).sort({ priority: 1, createdAt: -1 }).limit(12).lean(),
      Testimonial.find({}).sort({ priority: 1, createdAt: -1 }).limit(12).lean(),
      Education.find({}).sort({ createdAt: 1 }).limit(12).lean(),
      Profile.findOne({ key: "main" }).lean(),
      Skill.find({}).sort({ priority: 1, createdAt: -1 }).limit(40).lean(),
    ]);

  const blogList = toPlain<any>(pick(blogs, []));
  const projectList = toPlain<any>(pick(projectRows, []));
  const expList = toPlain<any>(pick(expRows, []));
  const testList = toPlain<any>(pick(testRows, []));
  const eduList = toPlain<any>(pick(eduRows, []));
  const prof = pick(profile, null) as any;
  const profPlain = prof ? JSON.parse(JSON.stringify(prof)) : null;
  const skillList = toPlain<any>(pick(skillRows, []));

  return {
    // Empty DB => static seed so the page never looks broken
    blogs: blogList,
    projects: projectList.length ? projectList : projects,
    experience: expList.length
      ? Array.from(new Map(expList.map((e) => [e.title, e])).values())
      : workExperience,
    testimonials: testList.length ? testList : testimonials,
    education: eduList,
    skills: skillList.length
      ? Array.from(new Map(skillList.map((s) => [s.name, s])).values())
      : skills,
    profile: profPlain ?? null,
  };
});

export async function getFallbackProfile() {
  return {
    key: "main",
    heroTagline: "Dynamic Web Magic with Saikat",
    heroTitle: "Transforming Concepts into Seamless User Experiences",
    heroSubtitle:
      "Hi! I'm Saikat, a React/Next.js Developer based in Bangladesh.",
    cvLink:
      "https://drive.google.com/uc?export=download&id=1jZ7DFzizL6wO_HUPhHhtXL9Cv-Bw3nOO",
    email: "saikotroydev@gmail.com",
    socials: socialMedia,
  };
}
