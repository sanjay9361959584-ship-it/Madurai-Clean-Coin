import Link from "next/link";
import { Camera, Coins, Map, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center w-full space-y-16 py-20">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-12 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4 border border-brand-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
          </span>
          Madurai City Initiative
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Upload. Earn. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-400">Transform.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Help keep Madurai clean! Segregate your waste, upload a photo, let our AI validate it, and earn Clean-Coins for a greener future.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <Link href="/auth" className="px-8 py-4 bg-brand-600 text-white rounded-full font-semibold shadow-xl shadow-brand-500/30 hover:bg-brand-700 transition-all hover:-translate-y-1">
            Join the Movement
          </Link>
          <Link href="/#how-it-works" className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Learn More
          </Link>
        </div>
      </div>

      <div id="how-it-works" className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto pt-16">
        <FeatureCard
          icon={<Camera className="w-8 h-8 text-brand-600" />}
          title="1. Capture"
          desc="Take a quick photo of your properly segregated waste bins."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-8 h-8 text-brand-600" />}
          title="2. AI Validation"
          desc="Our smart AI checks your upload for compliance instantly."
        />
        <FeatureCard
          icon={<Coins className="w-8 h-8 text-brand-600" />}
          title="3. Earn Rewards"
          desc="Get Clean-Coins directly to your wallet for playing your part."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-slate-100 group cursor-default">
      <div className="bg-brand-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
