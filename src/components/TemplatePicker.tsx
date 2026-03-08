"use client";

import { motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { RESUME_TEMPLATES, ResumeTemplateConfig } from "@/lib/templates";

interface TemplatePickerProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export function TemplatePicker({ selectedId, onSelect }: TemplatePickerProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Choose Your Template</h3>
                    <p className="text-white/50 text-sm">Select a design that matches your style</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            onClick={onClick}
            className={`relative group text-left rounded-xl overflow-hidden transition-all duration-300 border-2 ${isSelected
                    ? "border-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]"
                    : "border-white/10 hover:border-white/30 hover:shadow-lg"
                }`}
        >
            {/* Color preview band */}
            <div
                className="h-20 w-full relative"
                style={{ background: template.previewGradient }}
            >
                {/* Mini resume mockup */}
                <div className="absolute inset-2 flex flex-col items-center justify-center gap-1">
                    <div
                        className="w-3/4 h-2 rounded-full opacity-80"
                        style={{ backgroundColor: template.colors.headerText }}
                    />
                    <div
                        className="w-1/2 h-1 rounded-full opacity-50"
                        style={{ backgroundColor: template.colors.headerText }}
                    />
                    <div className="flex gap-1 mt-1">
                        <div
                            className="w-6 h-1 rounded-full opacity-40"
                            style={{ backgroundColor: template.colors.headerText }}
                        />
                        <div
                            className="w-6 h-1 rounded-full opacity-40"
                            style={{ backgroundColor: template.colors.headerText }}
                        />
                    </div>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center shadow-lg"
                    >
                        <Check className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                )}
            </div>

            {/* Template info */}
            <div className="p-3 bg-[#0f0f0f]">
                <h4 className="text-sm font-semibold text-white/90 truncate">
                    {template.name}
                </h4>
                <p className="text-xs text-white/40 mt-0.5 truncate">
                    {template.description}
                </p>

                {/* Color swatches */}
                <div className="flex gap-1.5 mt-2">
                    {[
                        template.colors.headerBg,
                        template.colors.accentColor,
                        template.colors.headingBorder,
                        template.colors.skillBg,
                    ].map((color, i) => (
                        <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/10"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </motion.button>
    );
}
