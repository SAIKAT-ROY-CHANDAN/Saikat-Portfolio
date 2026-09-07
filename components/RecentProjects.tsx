import { FaLocationArrow } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "./ui/SafeImage";
import { getProjects } from "@/lib/content";

const RecentProjects = async ({ projects: propProjects }: { projects?: any[] }) => {
  const projects = (propProjects ?? (await getProjects()))
    .slice()
    .sort((a: any, b: any) => (a.priority ?? 99999) - (b.priority ?? 99999));

  return (
    <div className="py-10" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">recent projects</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20 mt-10 px-4 max-w-7xl mx-auto">
        {projects.map((p: any) => {
          const id = p._id ?? p.id;
          const title = p.title;
          const des = p.des ?? p.description ?? "";
          const img = p.img;
          const iconLists: string[] = Array.isArray(p.iconLists)
            ? p.iconLists
            : typeof p.iconLists === "string"
              ? p.iconLists.split(",").map((s: string) => s.trim()).filter(Boolean)
              : [];
          const link = p.link ?? "#";
          return (
            <div key={id} className="h-[28rem]">
              <Link
                href={link}
                target={link.startsWith("http") ? "_blank" : undefined}
                rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
                data-track={JSON.stringify({ kind: "project", label: title })}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.12] bg-[#04071d]/90 p-6 sm:p-7 transition-all duration-500 hover:-translate-y-2 hover:border-purple/60 hover:shadow-[0_24px_70px_-20px_rgba(161,106,255,0.45)]"
              >
                <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple/25 blur-[90px] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#13162d]">
                  <Image
                    width={1080}
                    height={720}
                    src="/bg.png"
                    alt="bg"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <SafeImage
                    width={1080}
                    height={720}
                    src={img}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04071d] to-transparent" />
                </div>

                <h3 className="mt-5 font-bold text-lg sm:text-xl text-white line-clamp-1 transition-colors duration-300 group-hover:text-purple-200">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-white-100/90 font-light leading-relaxed line-clamp-2">
                  {des}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6">
                  <div className="flex items-center">
                    {iconLists.map((icon, index) => (
                      <div
                        key={icon}
                        className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border border-white/[0.2] bg-black/60 transition-transform duration-300 group-hover:translate-y-[-2px]"
                        style={{ transform: `translateX(-${5 * index * 2}px)` }}
                      >
                        <Image width={1080} height={720} src={icon} alt={icon} className="p-2" />
                      </div>
                    ))}
                  </div>

                  <span className="flex items-center gap-2 text-sm font-semibold text-purple">
                    Check Live Site
                    <FaLocationArrow
                      color="#CBACF9"
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProjects;