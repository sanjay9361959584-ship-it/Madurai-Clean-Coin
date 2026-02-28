"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, LogIn } from "lucide-react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, isLogin })
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setErrorMsg(data.error || "Authentication failed.");
            }
        } catch (error) {
            setErrorMsg("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <div className="inline-flex justify-center bg-brand-50 p-4 rounded-full mb-4">
                        <Leaf className="w-8 h-8 text-brand-600 stroke-[2.5]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-transparent">
                        {isLogin ? "Welcome Back" : "Join Clean-Coin"}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        {isLogin ? "Sign in to view your civic impact." : "Create an account to start earning rewards."}
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm font-bold text-center animate-pulse">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1 text-left">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow outline-none bg-slate-50 text-slate-900 font-medium"
                                placeholder="Gandhi S"
                            />
                        </div>
                    )}
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow outline-none bg-slate-50 text-slate-900 font-medium"
                            placeholder="citizen@madurai.gov.in"
                        />
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-bold text-slate-700">Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow outline-none bg-slate-50 text-slate-900 font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-4 mt-2 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 shadow-md shadow-brand-500/20"
                    >
                        {loading ? "Verifying..." : (isLogin ? "Secure Login" : "Create Account")}
                        {!loading && <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
                        className="text-brand-600 font-bold hover:underline"
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
