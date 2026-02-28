import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Leaf } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Madurai Clean-Coin",
  description: "A civic-tech gamified platform for validating waste segregation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-brand-600 font-bold text-xl">
              <Leaf className="w-6 h-6 stroke-[2.5]" />
              <span>Clean-Coin</span>
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/auth" className="text-sm font-medium hover:text-brand-600 transition-colors">
                Login
              </Link>
              <Link href="/auth" className="text-sm font-medium bg-brand-600 text-white px-5 py-2.5 rounded-full hover:bg-brand-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
