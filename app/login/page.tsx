"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeCheck, Loader2 } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                try {
                    localStorage.setItem("userEmail", data.email || email);
                    localStorage.setItem("userRole", data.role || "admin");
                } catch (e) {}

                setMessage({ type: "success", text: data.message || "Login successful" });
                const params = new URLSearchParams(window.location.search);
                const next = params.get("next") || "/dashboard";
                const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
                router.replace(safe);
            } else {
                setMessage({ type: "error", text: data.message || "Login failed" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Login failed due to a network error." });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses =
        "w-full px-4 py-2.5 bg-black-200 text-white placeholder-white/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/70 focus:border-transparent transition";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back</h1>
                        <p className="mt-2 text-sm text-white-200">
                            Sign in to manage your portfolio
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-white-200">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-white-200">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClasses}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full mt-6 bg-purple text-black font-semibold py-2.5 rounded-lg transition hover:bg-purple/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {message && (
                        <div
                            className={`mt-6 flex items-center gap-2 text-sm font-medium ${
                                message.type === "error" ? "text-red-400" : "text-emerald-400"
                            }`}
                        >
                            {message.type === "success" && <BadgeCheck strokeWidth={1.5} className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
