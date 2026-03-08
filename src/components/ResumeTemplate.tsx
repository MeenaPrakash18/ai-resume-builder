import { FullResumeData } from "@/lib/schemas";
import { LucideIcon, Mail, Phone, MapPin, ExternalLink, FileText, Sparkles, Briefcase, GraduationCap, Layout } from "lucide-react";
import { ElementType, memo } from "react";

import { getTemplateById, TemplateColors, LayoutType } from "@/lib/templates";

interface ResumeTemplateProps {
    data: FullResumeData;
    aiContent: { summary: string; skills: string[] } | null;
    templateId: string;
}

const fontMap: Record<string, string> = {
    sans: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace',
    outfit: 'var(--font-outfit), sans-serif',
    montserrat: 'var(--font-montserrat), sans-serif',
    playfair: 'var(--font-playfair), serif',
    cinzel: 'var(--font-cinzel), serif',
    jetbrains: 'var(--font-jetbrains), monospace',
};

interface FieldProps {
    data: FullResumeData;
    fontStyle: string;
    baseFontSize: number;
    value?: string;
    fieldKey: string;
    defaults: { size?: number; color?: string; weight?: string; type?: string };
    className?: string;
    as?: ElementType;
}

const getStyle = (data: FullResumeData, fieldKey: string, fontStyle: string, baseFontSize: number, defaults: FieldProps["defaults"]) => {
    const type = data.fieldFontTypes?.[fieldKey] || defaults.type || fontStyle;
    const size = data.fieldFontSizes?.[fieldKey] || defaults.size || baseFontSize;
    const color = data.fieldColors?.[fieldKey] || defaults.color || "#1f2937";
    return {
        style: {
            fontSize: `${size}px`,
            color,
            fontWeight: defaults.weight || "normal",
            fontFamily: fontMap[type] || fontMap.sans,
        },
    };
};

const Field = ({ data, fontStyle, baseFontSize, value, fieldKey, defaults, className = "", as: Component = "span" }: FieldProps) => {
    if (!value) return null;
    const { style } = getStyle(data, fieldKey, fontStyle, baseFontSize, defaults);
    return <Component style={style} className={className}>{value}</Component>;
};

interface HeadingProps {
    children: string;
    fieldKey: string;
    icon?: LucideIcon;
    colors: TemplateColors;
    data: FullResumeData;
    light?: boolean;
}

const Heading = ({ children, fieldKey, icon: Icon, colors, data, light }: HeadingProps) => {
    const customColor = data.fieldColors?.[`heading_${fieldKey}`];
    const color = customColor || (light ? (colors.sidebarText || "#ffffff") : colors.headingColor);
    return (
        <div className="flex items-center gap-3 mb-4 border-b pb-2" style={{ borderColor: light ? "rgba(255,255,255,0.15)" : colors.headingBorder }}>
            {Icon && <Icon size={16} style={{ color }} className="shrink-0" />}
            <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{children}</h3>
        </div>
    );
};

/* ── Shared sub-components ── */
interface SharedProps {
    data: FullResumeData;
    aiContent: { summary: string; skills: string[] } | null;
    colors: TemplateColors;
    fontStyle: string;
    baseFontSize: number;
}

const ContactBar = ({ data, colors, fontStyle, baseFontSize, justify = "center" }: SharedProps & { justify?: string }) => (
    <div className={`flex flex-wrap ${justify === "start" ? "justify-start" : "justify-center"} gap-5 text-[9px] font-bold uppercase tracking-widest opacity-70`}>
        {data.personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={11} /><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.email} fieldKey="email" defaults={{ size: 9, color: colors.headerText }} /></div>}
        {data.personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={11} /><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.phone} fieldKey="phone" defaults={{ size: 9, color: colors.headerText }} /></div>}
        {data.personalInfo.location && <div className="flex items-center gap-1.5"><MapPin size={11} /><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.location} fieldKey="location" defaults={{ size: 9, color: colors.headerText }} /></div>}
    </div>
);

const SummaryBlock = ({ data, aiContent, colors }: SharedProps) => {
    if (!aiContent?.summary && !data.personalInfo.fullName) return null;
    return (
        <section>
            <Heading fieldKey="summary" icon={Sparkles} colors={colors} data={data}>Professional Summary</Heading>
            <p className="leading-relaxed text-justify opacity-90 italic border-l-2 pl-4" style={{ borderColor: colors.accentColor }}>
                {aiContent?.summary || "Dedicated professional committed to excellence and innovation."}
            </p>
        </section>
    );
};

const ExperienceBlock = ({ data, colors, fontStyle, baseFontSize }: SharedProps) => {
    if (data.experience.experiences.length === 0) return null;
    return (
        <section>
            <Heading fieldKey="experience" icon={Briefcase} colors={colors} data={data}>Experience</Heading>
            <div className="space-y-6">
                {data.experience.experiences.map((exp, i) => (
                    <div key={i} className="relative pl-5 border-l-2" style={{ borderColor: colors.accentColor }}>
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
                        <div className="flex justify-between items-baseline mb-0.5">
                            <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={exp.role} fieldKey={`exp_role_${i}`} defaults={{ size: 13, weight: "800", color: colors.bodyText }} className="uppercase tracking-tight" />
                            <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={exp.duration} fieldKey={`exp_duration_${i}`} defaults={{ size: 8, weight: "800", color: colors.subText }} className="uppercase tracking-widest" />
                        </div>
                        <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={exp.company} fieldKey={`exp_company_${i}`} defaults={{ size: 10, weight: "700", color: colors.accentColor }} className="block mb-2 italic" />
                        <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={exp.description} fieldKey={`exp_desc_${i}`} defaults={{ size: 10, color: colors.bodyText }} as="p" className="leading-relaxed whitespace-pre-line opacity-80" />
                    </div>
                ))}
            </div>
        </section>
    );
};

const ProjectsBlock = ({ data, colors, fontStyle, baseFontSize }: SharedProps) => {
    if (!data.projects.projects || data.projects.projects.length === 0) return null;
    return (
        <section>
            <Heading fieldKey="projects" icon={Layout} colors={colors} data={data}>Projects</Heading>
            <div className="space-y-4">
                {data.projects.projects.map((proj, i) => (
                    <div key={i} className="p-3 border rounded-lg" style={{ borderColor: colors.separatorColor }}>
                        <div className="flex justify-between items-center mb-1">
                            <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={proj.name} fieldKey={`proj_name_${i}`} defaults={{ size: 12, weight: "800", color: colors.bodyText }} className="uppercase" />
                            {proj.link && <ExternalLink size={12} style={{ color: colors.accentColor }} className="opacity-50" />}
                        </div>
                        <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={proj.description} fieldKey={`proj_desc_${i}`} defaults={{ size: 10, color: colors.bodyText }} as="p" className="leading-relaxed opacity-80" />
                    </div>
                ))}
            </div>
        </section>
    );
};

const SkillsBlock = ({ data, aiContent, colors, light }: SharedProps & { light?: boolean }) => {
    if (!aiContent?.skills || aiContent.skills.length === 0) return null;
    return (
        <section>
            <Heading fieldKey="skills" icon={Sparkles} colors={colors} data={data} light={light}>Skills</Heading>
            <div className="flex flex-wrap gap-1.5">
                {aiContent.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border" style={{
                        backgroundColor: light ? colors.skillBg : colors.skillBg,
                        color: light ? colors.skillText : colors.skillText,
                        borderColor: light ? "rgba(255,255,255,0.15)" : colors.skillBorder,
                    }}>
                        {skill}
                    </span>
                ))}
            </div>
        </section>
    );
};

const EducationBlock = ({ data, colors, fontStyle, baseFontSize, light }: SharedProps & { light?: boolean }) => {
    if (data.education.education.length === 0) return null;
    const textColor = light ? (colors.sidebarText || "#fff") : colors.bodyText;
    const subColor = light ? "rgba(255,255,255,0.6)" : colors.subText;
    return (
        <section>
            <Heading fieldKey="education" icon={GraduationCap} colors={colors} data={data} light={light}>Education</Heading>
            <div className="space-y-4">
                {data.education.education.map((edu, i) => (
                    <div key={i}>
                        <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={edu.school} fieldKey={`edu_school_${i}`} defaults={{ size: 10, weight: "800", color: textColor }} className="block uppercase leading-tight" />
                        <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={edu.degree} fieldKey={`edu_degree_${i}`} defaults={{ size: 9, weight: "600", color: subColor }} className="block mt-0.5 italic" />
                        <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={edu.year} fieldKey={`edu_year_${i}`} defaults={{ size: 8, weight: "800", color: subColor }} className="block mt-0.5 font-mono" />
                    </div>
                ))}
            </div>
        </section>
    );
};

const AttachmentsBlock = ({ data, colors, light }: { data: FullResumeData; colors: TemplateColors; light?: boolean }) => {
    if (!data.attachments || data.attachments.length === 0) return null;
    return (
        <section>
            <Heading fieldKey="attachments" icon={FileText} colors={colors} data={data} light={light}>Attachments</Heading>
            <div className="space-y-2">
                {data.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-bold opacity-70">
                        <FileText className="w-3 h-3" style={{ color: colors.accentColor }} />
                        <span className="truncate">{file.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

/* ── LAYOUT: Classic (centered header, 8/4 grid) ── */
const ClassicLayout = ({ data, aiContent, colors, fontStyle, baseFontSize }: SharedProps & { layout: LayoutType }) => (
    <>
        <header className="p-10 text-center border-b-4 border-double" style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderColor: colors.accentColor }}>
            <h1 className="mb-1"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.fullName} fieldKey="fullName" defaults={{ size: 32, weight: "900", color: colors.headerText }} className="tracking-tight uppercase" /></h1>
            <div className="mb-5 opacity-80"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.jobTitle} fieldKey="jobTitle" defaults={{ size: 16, weight: "600", color: colors.headerText }} className="uppercase tracking-[0.2em] italic" /></div>
            <ContactBar data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
        </header>
        <div className="px-10 py-8">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <SummaryBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <ExperienceBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <ProjectsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                </div>
                <div className="col-span-4 space-y-8">
                    <SkillsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <EducationBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <AttachmentsBlock data={data} colors={colors} />
                </div>
            </div>
        </div>
    </>
);

/* ── LAYOUT: Sidebar Left (colored sidebar with skills/edu, main content right) ── */
const SidebarLeftLayout = ({ data, aiContent, colors, fontStyle, baseFontSize }: SharedProps & { layout: LayoutType }) => (
    <div className="grid grid-cols-12 min-h-[1123px]">
        {/* Sidebar */}
        <div className="col-span-4 p-8 space-y-8" style={{ backgroundColor: colors.sidebarBg || colors.headerBg, color: colors.sidebarText || colors.headerText }}>
            <div className="text-center mb-6">
                <h1 className="mb-1"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.fullName} fieldKey="fullName" defaults={{ size: 22, weight: "900", color: colors.sidebarText || colors.headerText }} className="tracking-tight uppercase block" /></h1>
                <Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.jobTitle} fieldKey="jobTitle" defaults={{ size: 11, weight: "600", color: colors.sidebarText || colors.headerText }} className="uppercase tracking-[0.15em] italic opacity-70 block" />
            </div>
            {/* Contact */}
            <div className="space-y-2.5 text-[9px]">
                <div className="flex items-center gap-3 mb-4 border-b pb-2" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                    <Mail size={14} style={{ color: colors.accentColor }} />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: colors.sidebarText || "#fff" }}>Contact</h3>
                </div>
                {data.personalInfo.email && <div className="flex items-center gap-2 opacity-80"><Mail size={10} style={{ color: colors.accentColor }} /><span>{data.personalInfo.email}</span></div>}
                {data.personalInfo.phone && <div className="flex items-center gap-2 opacity-80"><Phone size={10} style={{ color: colors.accentColor }} /><span>{data.personalInfo.phone}</span></div>}
                {data.personalInfo.location && <div className="flex items-center gap-2 opacity-80"><MapPin size={10} style={{ color: colors.accentColor }} /><span>{data.personalInfo.location}</span></div>}
            </div>
            <SkillsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} light />
            <EducationBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} light />
            <AttachmentsBlock data={data} colors={colors} light />
        </div>
        {/* Main */}
        <div className="col-span-8 p-8 space-y-8" style={{ backgroundColor: colors.bodyBg, color: colors.bodyText }}>
            <SummaryBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <ExperienceBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <ProjectsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
        </div>
    </div>
);

/* ── LAYOUT: Compact (single-column, no sidebar, dense ATS-friendly) ── */
const CompactLayout = ({ data, aiContent, colors, fontStyle, baseFontSize }: SharedProps & { layout: LayoutType }) => (
    <>
        <header className="px-10 py-8 border-b-2" style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderColor: colors.accentColor }}>
            <h1 className="mb-0.5"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.fullName} fieldKey="fullName" defaults={{ size: 28, weight: "900", color: colors.headerText }} className="tracking-tight uppercase" /></h1>
            <div className="mb-4 opacity-70"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.jobTitle} fieldKey="jobTitle" defaults={{ size: 13, weight: "600", color: colors.headerText }} className="uppercase tracking-[0.15em]" /></div>
            <ContactBar data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} justify="start" />
        </header>
        <div className="px-10 py-6 space-y-6">
            <SummaryBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <SkillsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <ExperienceBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <EducationBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <ProjectsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
            <AttachmentsBlock data={data} colors={colors} />
        </div>
    </>
);

/* ── LAYOUT: Modern Split (left-aligned banner, equal 6/6 columns) ── */
const ModernSplitLayout = ({ data, aiContent, colors, fontStyle, baseFontSize }: SharedProps & { layout: LayoutType }) => (
    <>
        <header className="p-10 text-left border-l-8" style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderColor: colors.accentColor }}>
            <h1 className="mb-1"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.fullName} fieldKey="fullName" defaults={{ size: 30, weight: "900", color: colors.headerText }} className="tracking-tight uppercase" /></h1>
            <div className="mb-4 opacity-80"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.jobTitle} fieldKey="jobTitle" defaults={{ size: 14, weight: "600", color: colors.headerText }} className="uppercase tracking-[0.2em] italic" /></div>
            <ContactBar data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} justify="start" />
        </header>
        <div className="px-10 py-8">
            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-8">
                    <SummaryBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <ExperienceBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                </div>
                <div className="space-y-8">
                    <SkillsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <EducationBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <ProjectsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <AttachmentsBlock data={data} colors={colors} />
                </div>
            </div>
        </div>
    </>
);

/* ── LAYOUT: Elegant Border (thick top/bottom accent bars, centered block header) ── */
const ElegantBorderLayout = ({ data, aiContent, colors, fontStyle, baseFontSize }: SharedProps & { layout: LayoutType }) => (
    <>
        {/* Top accent bar */}
        <div className="h-2" style={{ backgroundColor: colors.accentColor }} />
        <header className="p-10 text-left" style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
            <h1 className="mb-1"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.fullName} fieldKey="fullName" defaults={{ size: 34, weight: "900", color: colors.headerText }} className="tracking-tight uppercase" /></h1>
            <div className="mb-5 opacity-80"><Field data={data} fontStyle={fontStyle} baseFontSize={baseFontSize} value={data.personalInfo.jobTitle} fieldKey="jobTitle" defaults={{ size: 15, weight: "600", color: colors.headerText }} className="uppercase tracking-[0.25em] italic" /></div>
            <ContactBar data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} justify="start" />
        </header>
        {/* Bottom accent bar */}
        <div className="h-1" style={{ backgroundColor: colors.accentColor }} />
        <div className="px-10 py-8">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <SummaryBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <ExperienceBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <ProjectsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                </div>
                <div className="col-span-4 space-y-8 border-l-2 pl-8" style={{ borderColor: colors.accentColor }}>
                    <SkillsBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <EducationBlock data={data} aiContent={aiContent} colors={colors} fontStyle={fontStyle} baseFontSize={baseFontSize} />
                    <AttachmentsBlock data={data} colors={colors} />
                </div>
            </div>
        </div>
        <div className="h-2" style={{ backgroundColor: colors.accentColor }} />
    </>
);

/* ── Layout Selector Map ── */
const layoutMap: Record<LayoutType, React.FC<SharedProps & { layout: LayoutType }>> = {
    "classic": ClassicLayout,
    "sidebar-left": SidebarLeftLayout,
    "compact": CompactLayout,
    "modern-split": ModernSplitLayout,
    "elegant-border": ElegantBorderLayout,
};

/* ── Main Export ── */
export const ResumeTemplate = memo(function ResumeTemplate({ data, aiContent, templateId }: ResumeTemplateProps) {
    if (!data) return null;

    const template = getTemplateById(templateId);
    const { colors, layout } = template;
    const fontStyle = data.personalInfo.fontStyle || "sans";
    const baseFontSize = data.personalInfo.fontSize || 12;

    const LayoutComponent = layoutMap[layout] || ClassicLayout;

    return (
        <div
            className="w-full h-full shadow-2xl transition-all duration-500"
            style={{
                fontFamily: fontMap[fontStyle] || fontMap.sans,
                fontSize: `${baseFontSize}px`,
                minHeight: '1123px',
                backgroundColor: colors.bodyBg,
                color: colors.bodyText,
            }}
        >
            <LayoutComponent
                data={data}
                aiContent={aiContent}
                colors={colors}
                fontStyle={fontStyle}
                baseFontSize={baseFontSize}
                layout={layout}
            />
        </div>
    );
});
