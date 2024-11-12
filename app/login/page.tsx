'use client'
import BoxReveal from "@/components/ui/box-reveal"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck } from 'lucide-react'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                document.cookie = `userEmail=${data.email}; path=/`;
                document.cookie = `userRole=${data.role}; path=/`;

                localStorage.setItem("userEmail", data.email);
                localStorage.setItem("userRole", data.role);

                setMessage(data.message);
                router.push('/')
            } else {
                setMessage(data.message || "Login failed");
            }
        } catch (error) {
            setMessage("Login failed due to a network error.");
        } finally {
            setLoading(false)
        }

    };


    return (
        <div className="flex items-center justify-center">
            <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
                <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                    <p className="text-[3.5rem] font-semibold">
                        Welcome Master Logan<span className="text-[#5046e6]">.</span>
                    </p>
                </BoxReveal>

                <form onSubmit={handleSubmit} className="mt-4">
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <div className="mb-4">
                            <label className="block mb-2 text-white">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </BoxReveal>

                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <div className="mb-4">
                            <label className="block mb-2 text-white">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </BoxReveal>

                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <button
                            disabled={loading}
                            type="submit"
                            className="mt-4 bg-[#5046e6] px-6 py-3 font-black hover:bg-blue-700 rounded-lg border border-white-200"
                        >
                            {!loading ? 'Login' : 'loading...'}
                        </button>
                    </BoxReveal>
                </form>
                {message && <div className="mt-4 flex gap-x-2 font-medium text-start text-lg text-gray-300">{message}<BadgeCheck strokeWidth={1} /></div>}
            </div>
        </div>
    )
}

export default LoginPage