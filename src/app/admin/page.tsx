"use client";

import { useEffect, useState } from "react";
import { Check, X, Shield, MapPin, Activity, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/admin/reports");
            if (res.ok) {
                const data = await res.json();
                setReports(data.reports);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reportId: string, status: "APPROVED" | "REJECTED") => {
        try {
            const res = await fetch("/api/admin/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, status }),
            });
            if (res.ok) fetchReports();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="flex-1 flex items-center justify-center p-8"><Activity className="w-8 h-8 text-brand-600 animate-pulse" /></div>;

    const pendingCount = reports.filter(r => r.status === "PENDING").length;

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8 pb-20 animate-in fade-in duration-500">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-brand-600" /> Civic Authority Portal
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and verify citizen reports across Madurai.</p>
                </div>
                <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-xl font-bold border border-amber-200 shadow-sm flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> {pendingCount} Pending Reviews
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Col: Analytics & Heatmap Mock */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MapPin className="w-32 h-32" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-300 mb-6 relative z-10">Area Cleanliness Index</h3>
                        <div className="space-y-4 relative z-10">
                            {[
                                { n: "Anna Nagar", s: 85, c: "bg-emerald-500" },
                                { n: "Simmakkal", s: 45, c: "bg-amber-500" },
                                { n: "K.K. Nagar", s: 20, c: "bg-red-500" }
                            ].map(area => (
                                <div key={area.n} className="space-y-1.5">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>{area.n}</span>
                                        <span>{area.s}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div className={`${area.c} h-2 rounded-full`} style={{ width: `${area.s}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Verification Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">Review Queue</h2>

                    {reports.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm">
                            <p className="text-slate-500 font-bold">No reports currently in the system.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reports.map((r: any) => (
                                <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md">

                                    <div className="w-full sm:w-48 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                                        <img src={r.imageUrl} alt="Waste" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                            <p className="text-white text-xs font-bold truncate flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {r.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 text-lg">Report by {r.user.name}</h4>
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${r.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                        r.status === "APPROVED" ? "bg-brand-50 text-brand-700 border-brand-200" :
                                                            "bg-red-50 text-red-700 border-red-200"
                                                    }`}>
                                                    {r.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-xs font-bold mt-3">
                                                {r.aiConfidence && (
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">AI Conf: {r.aiConfidence}%</span>
                                                )}
                                                {r.segregation && (
                                                    <span className={`${r.segregation === 'WET' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'} border px-2 py-1 rounded-md uppercase`}>
                                                        {r.segregation} Waste
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {r.status === "PENDING" && (
                                            <div className="flex gap-3 mt-4 sm:justify-end">
                                                <button onClick={() => updateStatus(r.id, "REJECTED")} className="flex-1 sm:flex-none px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors">
                                                    <X className="w-4 h-4" /> Reject
                                                </button>
                                                <button onClick={() => updateStatus(r.id, "APPROVED")} className="flex-1 sm:flex-none px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors">
                                                    <Check className="w-4 h-4" /> Approve & Award Points
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
