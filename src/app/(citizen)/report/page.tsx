"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Loader2, UploadCloud, XCircle, MapPin } from "lucide-react";

export default function ReportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState<"UPLOAD" | "ANALYZING" | "RESULT">("UPLOAD");
    const [result, setResult] = useState<any>(null);
    const [location, setLocation] = useState<string>("Fetching location...");
    const router = useRouter();

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
                (err) => setLocation("Location not available")
            );
        } else {
            setLocation("Geolocation unsupported");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setStep("ANALYZING");

        if (location === "Fetching location...") getLocation(); // Fallback if user didn't hit button

        const formData = new FormData();
        formData.append("file", file);
        formData.append("location", location);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            setResult(data);
            setStep("RESULT");
        } catch (e) {
            alert("Processing Failed");
            setStep("UPLOAD");
        }
    };

    return (
        <div className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 text-center pt-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report Waste</h1>
                <p className="text-slate-500 font-medium">Take a real photo of the segregated waste.</p>
            </div>

            {step === "UPLOAD" && (
                <div className="bg-white border-2 border-dashed border-brand-200 rounded-3xl p-12 text-center space-y-6 hover:bg-brand-50/30 transition-colors shadow-sm">

                    <div className="flex justify-center flex-col items-center gap-2">
                        <button onClick={getLocation} className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-full flex gap-1.5 items-center hover:bg-slate-200 text-slate-700 transition">
                            <MapPin className="w-3.5 h-3.5" /> {location}
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-brand-50 p-5 rounded-full text-brand-600">
                            <Camera className="w-10 h-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-800">Select Image</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">Upload an actual image file from your device to be saved and analyzed.</p>
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="inline-flex cursor-pointer items-center justify-center px-8 py-4 bg-white border border-slate-200 shadow-sm rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95">
                            Choose Image
                        </label>
                        {file && <p className="mt-4 text-xs font-bold text-brand-600 bg-brand-50 py-1 px-3 rounded-full inline-block">{file.name}</p>}
                    </div>
                    {file && (
                        <div className="pt-4 animate-in fade-in zoom-in-95">
                            <button onClick={handleUpload} className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]">
                                <UploadCloud className="w-5 h-5" /> Analyze & Upload Reality
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === "ANALYZING" && (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center space-y-6 shadow-2xl shadow-brand-500/10 flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-800">Processing File...</h3>
                        <p className="text-sm font-medium text-slate-500">Writing file to server and validating image.</p>
                    </div>
                </div>
            )}

            {step === "RESULT" && result && (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-2xl shadow-brand-500/10 animate-in zoom-in-95 duration-500">
                    <div className="text-center space-y-3">
                        {result.valid ? (
                            <CheckCircle2 className="w-16 h-16 text-brand-500 mx-auto" />
                        ) : (
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        )}
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            {result.valid ? "Validation Successful" : "Validation Failed"}
                        </h2>
                        <p className="text-slate-500 font-medium">{result.reason}</p>
                    </div>

                    <div className="w-full h-40 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative mb-4">
                        <img src={result.publicUrl} className="w-full h-full object-cover" alt="Actual Uploaded File" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-[10px] font-mono truncate">
                            {result.publicUrl}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl grid grid-cols-2 gap-4 border border-slate-100">
                        <div className="space-y-1">
                            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">AI Confidence</span>
                            <p className="text-2xl font-black text-slate-800">{result.confidence}%</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Detected Type</span>
                            <p className="text-2xl font-black text-slate-800">{result.segregation}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => { setStep("UPLOAD"); setFile(null) }} className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors active:scale-95">
                            {result.valid ? "Return to Dashboard" : "Retake Photo"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
