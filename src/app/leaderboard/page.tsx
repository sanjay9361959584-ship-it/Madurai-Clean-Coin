"use client";

import { useEffect, useState } from "react";
import { Award, Medal, TrendingUp, Users } from "lucide-react";

export default function LeaderboardPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [areas, setAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/leaderboard");
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users);
                    setAreas(data.areas);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="flex-1 flex items-center justify-center p-8"><TrendingUp className="w-8 h-8 text-brand-600 animate-pulse" /></div>;

    return (
        <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-12 pb-20 animate-in fade-in duration-500">

            <div className="text-center space-y-4 pt-4">
                <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
                    <Award className="w-10 h-10 text-amber-500" /> Leaderboard
                </h1>
                <p className="text-slate-500 font-medium">See who is leading the green revolution in Madurai.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Top Citizens */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                        <Users className="w-5 h-5 text-brand-600" />
                        <h2 className="text-xl font-bold text-slate-800">Top Citizens</h2>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        {users.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-bold">No active citizens yet.</div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {users.map((u, i) => (
                                    <li key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${i === 0 ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-amber-500/20" :
                                                    i === 1 ? "bg-slate-200 text-slate-700 border border-slate-300" :
                                                        i === 2 ? "bg-orange-100 text-orange-800 border border-orange-200" :
                                                            "bg-brand-50 text-brand-700 border border-brand-100"
                                                }`}>
                                                {i === 0 ? <Medal className="w-5 h-5" /> : i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{u.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{u.streak} Day Streak</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900">{u.points} <span className="text-xs font-bold text-slate-400">pts</span></p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Cleanest Areas */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-xl font-bold text-slate-800">Cleanest Areas</h2>
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        {areas.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <p className="text-slate-500 font-bold mb-2">No areas found.</p>
                                <button onClick={() => fetch("/api/seed")} className="text-xs bg-slate-100 px-3 py-1 font-bold rounded-lg hover:bg-slate-200">Seed Demo Data</button>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {areas.map((a, i) => (
                                    <li key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-sm font-bold">
                                                #{i + 1}
                                            </div>
                                            <p className="font-bold text-slate-800">{a.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="w-24 bg-slate-100 rounded-full h-2 mb-1 overflow-hidden border border-slate-200">
                                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(a.cleanlinessScore / 5) * 100}%` }} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-500">Score: {a.cleanlinessScore.toFixed(1)}/5</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
