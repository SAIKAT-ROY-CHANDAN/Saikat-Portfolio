import {
  LuBriefcase,
  LuCpu,
  LuFolderKanban,
  LuGraduationCap,
  LuLayoutDashboard,
  LuMessageSquareQuote,
  LuPenLine,
  LuUser,
} from "react-icons/lu";

export const dashboardNav = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LuLayoutDashboard,
    description: "Site analytics",
  },
  {
    href: "/dashboard/blogs",
    label: "Blogs",
    icon: LuPenLine,
    description: "Write and manage posts",
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: LuFolderKanban,
    description: "Showcase and reorder work",
  },
  {
    href: "/dashboard/skills",
    label: "Skills",
    icon: LuCpu,
    description: "Manage the tech starfield",
  },
  {
    href: "/dashboard/experience",
    label: "Experience",
    icon: LuBriefcase,
    description: "Job history timeline",
  },
  {
    href: "/dashboard/testimonials",
    label: "Testimonials",
    icon: LuMessageSquareQuote,
    description: "Client feedback",
  },
  {
    href: "/dashboard/education",
    label: "Education",
    icon: LuGraduationCap,
    description: "Degrees and study",
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: LuUser,
    description: "Hero, about & contact",
  },
] as const;