"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    defaultOpen?: boolean;
    isComplete?: boolean;
}

export function FormSection({
    title,
    icon: Icon,
    children,
    defaultOpen = false,
    isComplete = false,
}: FormSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/[0.1]">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isComplete
                        ? "bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
                        : "bg-premium-gold/10 text-premium-gold group-hover:bg-premium-gold group-hover:text-black shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        }`}>
                        {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-premium-gold/80 group-hover:text-premium-gold transition-colors">
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                >
                    <ChevronDown className="w-4 h-4 text-premium-gold/30 group-hover:text-premium-gold" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
