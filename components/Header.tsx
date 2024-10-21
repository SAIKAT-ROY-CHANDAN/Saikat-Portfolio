'use client'
import { useEffect, useState } from "react";
import logo from '@/public/s-logo.svg'
import { navigation } from "@/data";
import Link from "next/link";
import { Button } from "./ui/MovingBorders";
import { usePathname } from "next/navigation";
import Image from "next/image";

// https://i.ibb.co.com/YyM8KX4/saikat-logo.png

const Header = () => {
    const pathname = usePathname()
    const [openNavigation, setOpenNavigation] = useState(false);
    const [hash, setHash] = useState("");

    const role = "admin-logan"

    useEffect(() => {
        if (typeof window !== "undefined") {
            setHash(window.location.hash);
        }
    }, [pathname]);

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
        } else {
            setOpenNavigation(true);
        }
    };

    const handleClick = () => {
        if (!openNavigation) return;

        setOpenNavigation(false);
    };


    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
                }`}
        >
            <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
                <Link href='/' className="block w-[12rem] xl:mr-8">
                    <Image src={logo} className="h-8" width={190} height={40} alt="switch" />
                </Link>

                <nav
                    className={`${openNavigation ? "flex bg-white/80" : "hidden"
                        } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
                >
                    <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
                        {navigation.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                onClick={handleClick}
                                className={`block relative hover:scale-105 hover:text-sec font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? "lg:hidden" : ""
                                    } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${item.link === hash
                                        ? "z-2 lg:text-n-1"
                                        : "lg:text-n-1/50"
                                    } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                </nav>
                {!role ?
                    <Link href="/dashboard" className="hidden hover:text-def hover:scale-105 duration-150 lg:flex">
                        Dashboard
                    </Link> : <></>
                }

                <Button
                    className="ml-auto lg:hidden"
                    onClick={toggleNavigation}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                    </svg>

                    <MenuSvg openNavigation={openNavigation} />
                </Button>
            </div>
        </div>
    )
}

export default Header


const MenuSvg = ({ openNavigation }: any) => {
    return (
        <svg
            className="overflow-visible"
            width="20"
            height="12"
            viewBox="0 0 20 12"
        >
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