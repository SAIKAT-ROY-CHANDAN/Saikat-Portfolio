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



export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        {/* <FloatingNav navItems={navItems} /> */}
        <Header />
        <Hero />
        <Grid />
        <Skills />
        <RecentProjects />
        <BlogCard />
        <Clients />
        <Experience />
        <Education />
        <Approach />
        <Footer />
      </div>
    </main>
  );
}
