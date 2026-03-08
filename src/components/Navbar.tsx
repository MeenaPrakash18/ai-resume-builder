"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "glass py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-premium-gold/10"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
                    <div className="w-10 h-10 bg-premium-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all">
                        <Sparkles className="text-black w-6 h-6 animate-pulse" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white">
                        RESUME<span className="text-premium-gold">AI</span>
                        <span className="block text-[8px] tracking-[0.3em] text-premium-gold/50 font-bold -mt-1">ELITE EDITION</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/create"
                        className="btn-gold px-6 py-2.5 rounded-full text-sm font-bold tracking-wide flex items-center gap-2"
                    >
                        Start Building
                    </Link>
                </div>
            </div>
        </nav>
    );
}
