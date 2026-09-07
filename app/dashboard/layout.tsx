"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { dashboardNav } from "@/components/dashboard/nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-black-100">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/10 bg-[#04071D] px-4 py-6">
          <div className="px-2 mb-8">
            <Link href="/dashboard">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <LuLayoutDashboard className="text-purple" /> Dashboard
              </h1>
            </Link>
            <p className="text-xs text-white-200 mt-1">Saikat Roy</p>
          </div>
          <nav className="flex-1 space-y-1">
            {dashboardNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-white text-black-100"
                      : "text-white-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10"
          >
            <LuLogOut size={17} /> Logout
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 sm:px-8 py-6">
          {/* Mobile header + nav */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <LuLayoutDashboard className="text-purple" /> Dashboard
                </h1>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200"
              >
                Logout
              </button>
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {dashboardNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${
                      active
                        ? "bg-white text-black-100 border-white"
                        : "bg-black-200 text-white-100 border-white/10"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;