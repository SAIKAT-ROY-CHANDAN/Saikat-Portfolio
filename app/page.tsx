import { Suspense } from "react";
import Approach from "@/components/Approach";
import { BlogCard } from "@/components/BlogCard";
import Clients from "@/components/Clients";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import { Skills } from "@/components/Skills";
import { getHomepageData } from "@/lib/server-data";

export const dynamic = "force-dynamic";

function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="py-16 px-4 max-w-5xl mx-auto w-full animate-pulse">
      <div className="h-8 w-64 mx-auto rounded-lg bg-white/10" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/10" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  // One DB connection + one parallel batch (no HTTP self-fetch waterfall).
  // Still uncached => dashboard edits appear instantly.
  const data = await getHomepageData();

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Header />
        <Hero profile={data.profile} />
        <Suspense fallback={<SectionSkeleton />}>
          <Grid profile={data.profile} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <Experience items={data.experience} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RecentProjects projects={data.projects} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <BlogCard blogs={data.blogs} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Skills skills={data.skills} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <Clients items={data.testimonials} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <Education items={data.education} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton lines={2} />}>
          <Approach />
        </Suspense>
        <Suspense fallback={<SectionSkeleton lines={1} />}>
          <Footer profile={data.profile} />
        </Suspense>
      </div>
    </main>
  );
}
