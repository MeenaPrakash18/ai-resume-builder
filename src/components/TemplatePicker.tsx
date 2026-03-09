"use client";

import { motion } from "framer-motion";
import { Check, Layout } from "lucide-react";
import { RESUME_TEMPLATES, ResumeTemplateConfig } from "@/lib/templates";

interface TemplatePickerProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center">
                        <Layout className="w-5 h-5 text-premium-gold" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white italic tracking-tight uppercase">
                            Elite <span className="text-premium-gold">Layouts</span>
                        </h3>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            {RESUME_TEMPLATES.length} Premium Templates
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-premium-gold/20">
                {RESUME_TEMPLATES.map((template, index) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedId === template.id}
                        onClick={() => onSelect(template.id)}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
}

function TemplateCard({
    template,
    isSelected,
    onClick,
    index,
}: {
    template: ResumeTemplateConfig;
    isSelected: boolean;
    onClick: () => void;
    index: number;
}) {
    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            onClick={onClick}
            className={`relative group text-left rounded-xl overflow-hidden transition-all duration-500 border-2 ${isSelected
                ? "border-premium-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-[1.02] z-10"
                : "border-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-premium-gold/30"
                }`}
        >
            {/* Color preview band */}
            <div
                className="h-24 w-full relative overflow-hidden"
                style={{ background: template.previewGradient }}
            >
                {/* Mini resume mockup */}
                <div className="absolute inset-2 flex flex-col items-center justify-center gap-1 bg-black/10 backdrop-blur-[2px] rounded-sm">
                    <div
                        className="w-3/4 h-2 rounded-full opacity-80"
                        style={{ backgroundColor: template.colors.headerText }}
                    />
                    <div
                        className="w-1/2 h-1 rounded-full opacity-50 mb-1"
                        style={{ backgroundColor: template.colors.headerText }}
                    />
                    <div className="space-y-1 w-full px-4">
                        <div className="h-0.5 w-full bg-white/20" />
                        <div className="h-0.5 w-full bg-white/10" />
                        <div className="h-0.5 w-2/3 bg-white/10" />
                    </div>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-premium-gold text-black flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </motion.div>
                )}
            </div>

            {/* Template info */}
            <div className="p-3 bg-zinc-900 border-t border-white/5">
                <h4 className="text-[10px] font-black text-white/90 truncate uppercase tracking-tighter">
                    {template.name}
                </h4>
                <p className="text-[8px] text-white/40 mt-0.5 truncate uppercase font-bold tracking-widest">
                    {template.layout.replace('-', ' ')}
                </p>

                {/* Color swatches */}
                <div className="flex gap-1.5 mt-2">
                    {[
                        template.colors.headerBg,
                        template.colors.accentColor,
                        template.colors.headingColor,
                    ].map((color, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </motion.button>
    );
}
