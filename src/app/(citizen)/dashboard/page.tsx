"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, Coins, MapPin, Trophy, Leaf, History, CheckCircle, XCircle, Clock } from "lucide-react";

export default function CitizenDashboard() {
    const [user, setUser] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [userRes, reportsRes] = await Promise.all([
                    fetch("/api/auth"),
                    fetch("/api/reports")
                ]);

                if (userRes.ok) {
                    const { user } = await userRes.json();
                    setUser(user);
                }

                if (reportsRes.ok) {
                    const { reports } = await reportsRes.json();
                    setReports(reports);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Leaf className="w-8 h-8 text-brand-500 animate-spin" /></div>;
    if (!user) return <div className="p-8 text-center text-red-500 font-bold">Not authenticated. Please wait or log in again.</div>;

    return (
        <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Hello, {user.name}</h1>
                    <p className="text-slate-500 font-medium">Ready to clean up Madurai today?</p>
                </div>
                <div className="bg-brand-50 border border-brand-100 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <Trophy className="w-5 h-5 text-brand-600" />
                    <span className="font-bold text-brand-700">Lvl {Math.floor(user.points / 100) + 1}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Wallet Card */}
                <div className="bg-gradient-to-br from-brand-600 to-emerald-500 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-brand-500/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                        <Coins className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <p className="text-brand-100 font-bold text-xs uppercase tracking-widest">Clean-Coin Balance</p>
                        <h2 className="text-5xl font-extrabold tracking-tight">{user.points} <span className="text-xl font-medium opacity-80">pts</span></h2>
                        <div className="flex items-center gap-2 pt-4">
                            <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                                <Leaf className="w-4 h-4" /> {user.streak} Day Streak
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-4">
                    <Link href="/report" className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all group">
                        <div className="bg-brand-50 p-4 rounded-full group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
                            <Camera className="w-8 h-8 text-brand-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Report Waste</h3>
                            <p className="text-sm text-slate-500 font-medium">Snap a photo and earn points</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-slate-100 outline-dashed outline-2 outline-slate-200/50 rounded-3xl">
                        <div className="inline-flex justify-center bg-slate-50 p-4 rounded-full mb-4">
                            <Camera className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-bold">No reports yet. Start your journey!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reports.map((r: any) => (
                            <div key={r.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                                        <img src={r.imageUrl} alt="Report" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                                            {r.location}
                                            {r.segregation === "WET" && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Wet</span>}
                                            {r.segregation === "DRY" && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Dry</span>}
                                        </h4>
                                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> {new Date(r.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    {r.status === "PENDING" && <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">Pending</span>}
                                    {r.status === "APPROVED" && <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> +50 pts</span>}
                                    {r.status === "REJECTED" && <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rejected</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
