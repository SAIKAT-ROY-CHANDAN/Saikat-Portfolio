import BoxReveal from "@/components/ui/box-reveal"
import { getSession } from "@auth0/nextjs-auth0"
import Link from "next/link"

const page = async () => {
    const session = await getSession()
    const user = session?.user

    if (user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <button className="bg-white-100 text-black-200">
                    <a href='api/auth/logout'>Logout</a>
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center">
            <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
                <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <p className="text-[3.5rem] font-semibold">
                        Welcome Master Logan<span className="text-[#5046e6]">.</span>
                    </p>
                </BoxReveal>

                <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <Link href="/api/auth/login">
                        <button className="mt-[1.6rem] bg-[#5046e6] px-6 py-3 font-black hover:bg-blue-700 rounded-lg border border-white-200">
                            Login
                        </button>
                    </Link>
                </BoxReveal>
            </div>
        </div>
    )
}

export default page