"use client";
import { useEffect, useState } from "react";
import logo from "@/public/s-logo.svg";
import { navigation } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [hash, setHash] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash);
      setUserRole(localStorage.getItem("userRole"));
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleNavigation = () => setOpenNavigation((v) => !v);

  const handleClick = () => {
    if (openNavigation) setOpenNavigation(false);
  };

  const isActive = (link: string) => link.startsWith("#") && link === hash;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] border-b transition-all duration-500 ${
        scrolled
          ? "border-white/10 bg-black-100/70 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* top scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="block w-8 lg:w-[10rem] shrink-0">
          <Image src={logo} className="h-8 w-auto" width={190} height={40} alt="Saikat Roy" />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          {navigation
            .filter((item) => !item.onlyMobile)
            .map((item, index) => (
              <Link
                key={index}
                href={item.link}
                onClick={handleClick}
                className={`group relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                  isActive(item.link)
                    ? "text-white"
                    : "text-white-200/70 hover:text-white"
                }`}
              >
                {item.title}
                <span
                  className={`absolute inset-x-4 bottom-0.5 h-px bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 transition-opacity ${
                    isActive(item.link)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-70"
                  }`}
                />
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          {userRole && (
            <Link
              href="/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-200 transition hover:border-purple-400/50 hover:bg-purple-500/10"
            >
              <span className="size-1.5 rounded-full bg-cyan-300 animate-pulse" />
              Dashboard
            </Link>
          )}

          <button
            className="ml-auto lg:hidden"
            onClick={toggleNavigation}
            aria-label="Toggle navigation"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>

      {/* bottom scan line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

      {/* Mobile menu */}
      {openNavigation && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col items-center justify-center gap-1 bg-black-100/95 backdrop-blur-xl">
          {navigation.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              onClick={handleClick}
              className={`block px-6 py-4 text-2xl font-bold uppercase tracking-[0.15em] transition-colors ${
                isActive(item.link) ? "text-white" : "text-white-200/70 hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          ))}
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white-200/50">
            Saikat Roy // Portfolio
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;

const MenuSvg = ({ openNavigation }: any) => {
  return (
    <svg className="overflow-visible" width="20" height="12">
      <rect
        className="transition-all origin-center"
        y={openNavigation ? "5" : "0"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        transform={`rotate(${openNavigation ? "45" : "0"})`}
      />
      <rect
        className="transition-all origin-center"
        y={openNavigation ? "5" : "10"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        transform={`rotate(${openNavigation ? "-45" : "0"})`}
      />
    </svg>
  );
};