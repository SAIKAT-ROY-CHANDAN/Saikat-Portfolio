import { FaLocationArrow } from "react-icons/fa"
import MagicButton from "./ui/MagicButton"
import { socialMedia } from "@/data"
import { getProfile } from "@/lib/content";
import Image from "next/image"


const Footer = async ({ profile: propProfile }: { profile?: any } = {}) => {
    const profile = propProfile ?? (await getProfile().catch(() => null));
    const socials = profile?.socials?.length ? profile.socials : socialMedia;
    const email = profile?.email ?? "saikotroydev@gmail.com";
    return (
        <footer className="w-full mb-[100px] md:mb-5 pb-10" id="contact">
            <div className="flex flex-col items-center">
                <h1 className="heading lg:max-w-[45vw]">Ready to take <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">your
                </span> digital presence to the next level
                </h1>
                <p className="text-white-200 md:mt-10 my-15 text-center">Reach out to me today and let&apos;s discuss how i can help you achieve your goal</p>
                <a href={`mailto:${email}`}>
                    <MagicButton
                        title="Let's get in touch"
                        icon={<FaLocationArrow />}
                        position="right"
                    />
                </a>
            </div>
            <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
                <p className="md:text-base text-sm md:font-normal font-light text-white-200">
                    Copyright © 2024 Saikat Roy
                </p>

                <div className="flex items-center md:gap-3 gap-6">
                    {socials.map((info: any, i: number) => (
                        <a
                            href={info.link}
                            key={info._id ?? info.id ?? i}
                            data-track={JSON.stringify({ kind: "social", label: info.link })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
                        >
                            <Image src={info.img} alt="icons" width={20} height={20} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer
