"use client";

import { useForm, useFieldArray, useWatch, FormProvider, Control, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullResumeSchema, FullResumeData } from "@/lib/schemas";
import { RESUME_TEMPLATES } from "@/lib/templates";
import { ResumeTemplate } from "./ResumeTemplate";
import { useState, useRef, useEffect, memo } from "react";
import {
  Download,
  Sparkles,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Layout,
  Image as ImageIcon,
  FileText,
  Maximize2,
  Minimize2,
  Edit3,
  Eye,
  ArrowLeft,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  control?: Control<FullResumeData>;
  watchFields?: string[];
}

function FormSection({ title, icon: Icon, children, defaultOpen = false, control, watchFields = [] }: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Only watch fields if they are provided to avoid errors when control is missing or unnecessary re-renders
  const watchedValues = useWatch({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: watchFields as any,
    disabled: watchFields.length === 0
  });

  const isComplete = watchFields.length > 0 && Array.isArray(watchedValues) && watchedValues.every(v => !!v);

  return (
    <div className={`glass-card overflow-hidden border-premium-gold/10 transition-all duration-300 ${isOpen ? "ring-1 ring-premium-gold/20" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${isOpen ? "bg-premium-gold text-black border-premium-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-white/5 text-premium-gold border-white/10"}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black text-premium-gold uppercase tracking-[0.1em]">{title}</h3>
            {isComplete && <span className="text-[10px] text-premium-gold font-bold uppercase tracking-widest mt-0.5 block">Section Complete</span>}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-300 ${isOpen ? "rotate-180 text-premium-gold" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FontSizeDisplay = ({ control, register }: { control: Control<FullResumeData>, register: ReturnType<typeof useForm<FullResumeData>>["register"] }) => {
  const size = (useWatch({ control, name: "personalInfo.fontSize" }) as number) || 12;
  return (
    <>
      <label className="text-[10px] font-bold uppercase tracking-widest text-premium-gold/60">Font Size ({size}px)</label>
      <input
        type="range" min="10" max="18" step="0.5"
        {...register("personalInfo.fontSize", { valueAsNumber: true })}
        className="w-full accent-premium-gold bg-white/5 h-1 rounded-full appearance-none cursor-pointer"
      />
    </>
  );
};

const ColorPicker = ({ fieldKey, control, setValue }: { fieldKey: string, control: Control<FullResumeData>, setValue: UseFormSetValue<FullResumeData> }) => {
  const color = (useWatch({ control, name: `fieldColors.${fieldKey}` }) as string) || "#000000";
  return (
    <input
      type="color"
      value={color}
      onChange={(e) => setValue(`fieldColors.${fieldKey}`, e.target.value)}
      className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
    />
  );
};

const ProfileImagePreview = ({ control, handleImageUpload }: { control: Control<FullResumeData>, handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const image = useWatch({ control, name: "personalInfo.profileImage" }) as string;
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="relative group">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-premium-gold/30 bg-white/[0.02] flex items-center justify-center overflow-hidden group-hover:border-premium-gold/60 transition-colors">
          {image ? (
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
          ) : (
            <ImageIcon className="w-6 h-6 text-premium-gold/30" />
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-white/80">Profile Picture</p>
        <p className="text-[10px] text-white/40 mt-1">Upload JPEG or PNG (Max 1MB)</p>
      </div>
    </div>
  );
};

const ProgressTracker = ({ control }: { control: Control<FullResumeData> }) => {
  const pi = useWatch({ control, name: "personalInfo" });
  const experiences = useWatch({ control, name: "experience.experiences" }) as { company: string; role: string; duration: string; description: string }[];
  const education = useWatch({ control, name: "education.education" }) as { school: string; degree: string; year: string }[];

  const totalFields = 6;
  let filledFields = 0;

  if (pi?.fullName) filledFields++;
  if (pi?.email) filledFields++;
  if (pi?.jobTitle) filledFields++;
  if (pi?.location) filledFields++;
  if (experiences?.[0]?.company) filledFields++;
  if (education?.[0]?.school) filledFields++;

  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-[10px] font-bold text-premium-gold uppercase tracking-widest">Profile Strength</span>
      <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-premium-gold to-premium-gold-light"
        />
      </div>
    </div>
  );
};

const FieldStylingControls = ({ control, setValue, fieldKey, defaultSize = 12 }: { control: Control<FullResumeData>, setValue: UseFormSetValue<FullResumeData>, fieldKey: string, defaultSize?: number }) => {
  const type = (useWatch({ control, name: `fieldFontTypes.${fieldKey}` }) as string) || "sans";
  const size = (useWatch({ control, name: `fieldFontSizes.${fieldKey}` }) as number) || defaultSize;
  const color = (useWatch({ control, name: `fieldColors.${fieldKey}` }) as string) || "#000000";

  return (
    <div className="flex items-center gap-2">
      <select
        value={type}
        onChange={(e) => setValue(`fieldFontTypes.${fieldKey}`, e.target.value)}
        className="bg-black/40 border border-premium-gold/20 rounded px-1.5 py-0.5 text-[8px] text-premium-gold focus:outline-none"
      >
        <option value="sans">Sans</option>
        <option value="serif">Serif</option>
        <option value="mono">Mono</option>
      </select>
      <input
        type="number"
        value={size}
        onChange={(e) => setValue(`fieldFontSizes.${fieldKey}`, parseInt(e.target.value))}
        className="w-8 bg-black/40 border border-premium-gold/20 rounded px-1 py-0.5 text-[8px] text-premium-gold focus:outline-none"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setValue(`fieldColors.${fieldKey}`, e.target.value)}
        className="w-4 h-4 rounded cursor-pointer border-none bg-transparent p-0"
        title="Color"
      />
    </div>
  );
};

const labelClass = (error?: boolean) =>
  `block text-[10px] font-black tracking-widest uppercase mb-1.5 ${error ? "text-red-400" : "text-premium-gold"}`;

const TemplatePicker = memo(function TemplatePicker({ selectedTemplate, setSelectedTemplate }: { selectedTemplate: string, setSelectedTemplate: (id: string) => void }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mt-4">
      {RESUME_TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.description}
          onClick={() => setSelectedTemplate(t.id)}
          className={`group relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none ${selectedTemplate === t.id ? "border-premium-gold scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] z-10" : "border-white/5 grayscale opacity-50 hover:opacity-100 hover:grayscale-0"}`}
        >
          <div className="absolute inset-0" style={{ background: t.previewGradient }} />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
          <div className="absolute inset-2 border border-white/10 rounded sm opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="h-2 w-full bg-white/20 mb-1" />
            <div className="h-1 w-2/3 bg-white/10 mb-1" />
            <div className="h-4 w-full bg-white/5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/80 backdrop-blur-sm">
            <p className="text-[8px] font-bold text-white truncate text-center">{t.name}</p>
          </div>
          {selectedTemplate === t.id && (
            <motion.div layoutId="active-check" className="absolute top-1 right-1 bg-premium-gold text-black rounded-full p-0.5">
              <Sparkles className="w-2.5 h-2.5" />
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
});
TemplatePicker.displayName = "TemplatePicker";

interface ResumePreviewProps {
  control: Control<FullResumeData>;
  aiContent: { summary: string; skills: string[] } | null;
  templateId: string;
  showMobilePreview: boolean;
  setShowMobilePreview: (show: boolean) => void;
  maximizedPanel: 'form' | 'preview' | null;
  setMaximizedPanel: (panel: 'form' | 'preview' | null) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

const ResumePreview = memo(function ResumePreview({ control, aiContent, templateId, showMobilePreview, setShowMobilePreview, maximizedPanel, setMaximizedPanel, previewRef }: ResumePreviewProps) {
  const watchedData = useWatch({ control });
  const [debouncedData, setDebouncedData] = useState<FullResumeData>(watchedData as FullResumeData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(watchedData as FullResumeData);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedData]);

  return (
    <motion.div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, a')) return;
        setMaximizedPanel(maximizedPanel === 'preview' ? null : 'preview');
      }}
      className={`bg-zinc-900 overflow-y-auto transition-all duration-500 ease-in-out cursor-pointer ${maximizedPanel === 'preview' ? 'w-full block z-20' : maximizedPanel === 'form' ? 'hidden' : 'lg:flex-1 w-full bg-grid-white/[0.02]'} ${showMobilePreview ? 'fixed inset-0 z-[60] flex !bg-black' : 'hidden lg:flex'}`}
    >
      <div className="w-full max-w-4xl relative p-4 lg:p-8">
        <div className="sticky top-0 z-20 flex items-center justify-between mb-6">
          <button
            onClick={() => setMaximizedPanel(maximizedPanel === 'preview' ? null : 'preview')}
            className="p-3 bg-black/50 backdrop-blur-md border border-premium-gold/20 rounded-full text-premium-gold hover:bg-premium-gold hover:text-black transition-all focus:outline-none"
          >
            {maximizedPanel === 'preview' ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          {showMobilePreview && <button onClick={() => setShowMobilePreview(false)} className="p-3 bg-black/50 border border-white/10 rounded-full text-white focus:outline-none"><ArrowLeft className="w-5 h-5" /></button>}
        </div>

        <div id="resume-pdf-container" ref={previewRef} className="origin-top hover:shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all duration-500 bg-white shadow-2xl overflow-hidden rounded-sm mx-auto">
          <ResumeTemplate
            data={debouncedData}
            aiContent={aiContent}
            templateId={templateId}
          />
        </div>
      </div>
    </motion.div>
  );
});
ResumePreview.displayName = "ResumePreview";

export function ResumeForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<{ summary: string; skills: string[] } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("elite-gold");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [maximizedPanel, setMaximizedPanel] = useState<'form' | 'preview' | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<FullResumeData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fullResumeSchema) as any,
    mode: "onChange",
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        jobTitle: "",
        location: "",
        profileImage: "",
        fontStyle: "sans",
        fontSize: 12
      },
      experience: { experiences: [{ company: "", role: "", duration: "", description: "" }] },
      education: { education: [{ school: "", degree: "", year: "" }] },
      projects: { projects: [] },
      fieldColors: {},
      fieldFontSizes: {},
      fieldFontTypes: {},
      attachments: [],
    },
  });

  const { control, handleSubmit, formState: { errors }, setValue } = form;

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience.experiences" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education.education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects.projects" });
  const { fields: attachFields, remove: removeAttach } = useFieldArray({ control, name: "attachments" });

  const onGenerate = async (data: FullResumeData) => {
    setIsGenerating(true);
    toast.loading("AI is crafting your resume...", { id: "gen" });
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("API Limit Reached or Error");
      const result = await res.json();
      setAiContent(result.resumeData);
      toast.success("AI Enhancement Complete!", { id: "gen" });
    } catch (err) {
      console.error(err);
      toast.error("AI enhancement failed. Check API key.", { id: "gen" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("personalInfo.profileImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const current = form.getValues("attachments") || [];
        setValue("attachments", [...current, { name: file.name, data: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const downloadPDF = async () => {
    const el = document.getElementById("resume-pdf-container");
    if (!el) return;
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const [html2canvas, { jsPDF }] = await Promise.all([
        import("html2canvas").then(m => m.default),
        import("jspdf")
      ]);

      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const personalInfo = form.getValues("personalInfo");
      const name = personalInfo?.fullName;
      pdf.save(name ? `Resume_${name.replace(/\s+/g, "_")}.pdf` : "Resume.pdf");
      toast.success("PDF downloaded!", { id: "pdf" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.", { id: "pdf" });
    }
  };

  const inputClass = (error?: boolean) =>
    `w-full bg-white/[0.04] border ${error ? "border-red-500/40 focus:border-red-400" : "border-white/[0.08] focus:border-premium-gold/50"} rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 ${error ? "focus:ring-red-500/30" : "focus:ring-premium-gold/30"} transition-all duration-200`;

  return (
    <FormProvider {...form}>
      <div className="editor-layout">
        <button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="lg:hidden fixed bottom-6 right-6 z-50 btn-gold w-14 h-14 rounded-full shadow-2xl flex items-center justify-center focus:outline-none"
        >
          <Eye className="w-6 h-6" />
        </button>

        <motion.div
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('input, button, textarea, select, a')) return;
            setMaximizedPanel(maximizedPanel === 'form' ? null : 'form');
          }}
          className={`bg-zinc-950 overflow-y-auto scrollbar-thin scrollbar-thumb-premium-gold/20 transition-all duration-500 ease-in-out cursor-pointer ${maximizedPanel === 'form' ? 'w-full block z-20' : maximizedPanel === 'preview' ? 'hidden' : 'lg:w-[45%] w-full'}`}
        >
          <div className="flex-1 p-6 space-y-8">
            <div className="flex items-center gap-3 mb-2 px-2">
              <Sparkles className="w-5 h-5 text-premium-gold animate-pulse" />
              <h2 className="text-xl font-black text-white italic tracking-tight">RESUME <span className="text-premium-gold">ELITE</span></h2>
            </div>
            <header className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <Edit3 className="w-8 h-8 text-premium-gold" />
                  Resume <span className="text-premium-gold">Editor</span>
                </h2>
                <p className="text-white/40 text-sm mt-1 font-medium">Craft your elite profile</p>
              </div>
              <div className="flex items-center gap-4">
                <ProgressTracker control={control} />
                <button
                  onClick={() => setMaximizedPanel(maximizedPanel === 'form' ? null : 'form')}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-premium-gold transition-colors focus:outline-none"
                >
                  {maximizedPanel === 'form' ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </header>

            <div className="space-y-8">
              <div className="glass-card p-6 border-premium-gold/10">
                <div className="flex items-center justify-between mb-4">
                  <label className={labelClass()}><Layout className="w-4 h-4 inline-block mr-2 text-premium-gold" /> Select Elite Layout</label>
                  <span className="text-[10px] font-bold text-premium-gold/40 uppercase tracking-widest">{RESUME_TEMPLATES.length} Premium Templates</span>
                </div>
                <TemplatePicker
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                />
              </div>

              <div className="glass-card p-5 space-y-4 border-premium-gold/10 bg-premium-gold/[0.02]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-premium-gold/60">Font Style</label>
                    <select
                      {...form.register("personalInfo.fontStyle")}
                      className="w-full bg-black/40 border border-premium-gold/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="sans">Modern Sans</option>
                      <option value="serif">Classic Serif</option>
                      <option value="mono">Tech Mono</option>
                      <option value="outfit">Outfit (Thin & Sleek)</option>
                      <option value="montserrat">Montserrat (Bold)</option>
                      <option value="playfair">Playfair (Premium)</option>
                      <option value="cinzel">Cinzel (Luxury)</option>
                      <option value="jetbrains">JetBrains (Coder)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <FontSizeDisplay control={control} register={form.register} />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
                <FormSection title="Personal Profile" icon={User} defaultOpen={true} control={control} watchFields={['personalInfo.fullName', 'personalInfo.email']}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className={labelClass()}>Summary Heading Color</span>
                      <ColorPicker fieldKey="heading_summary" control={control} setValue={setValue} />
                    </div>
                    <ProfileImagePreview control={control} handleImageUpload={handleImageUpload} />
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className={labelClass()}>Full Name *</label>
                        <FieldStylingControls control={control} setValue={setValue} fieldKey="fullName" defaultSize={32} />
                      </div>
                      <input {...form.register("personalInfo.fullName")} className={inputClass(!!errors.personalInfo?.fullName)} placeholder="John Doe" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className={labelClass()}>Professional Title</label>
                        <FieldStylingControls control={control} setValue={setValue} fieldKey="jobTitle" defaultSize={16} />
                      </div>
                      <input {...form.register("personalInfo.jobTitle")} className={inputClass()} placeholder="Senior Engineer" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass()}>Email *</label>
                          <FieldStylingControls control={control} setValue={setValue} fieldKey="email" defaultSize={10} />
                        </div>
                        <input {...form.register("personalInfo.email")} className={inputClass(!!errors.personalInfo?.email)} placeholder="john@email.com" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className={labelClass()}>Phone</label>
                          <FieldStylingControls control={control} setValue={setValue} fieldKey="phone" defaultSize={10} />
                        </div>
                        <input {...form.register("personalInfo.phone")} className={inputClass()} placeholder="+1 555-0000" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className={labelClass()}>Location</label>
                        <FieldStylingControls control={control} setValue={setValue} fieldKey="location" defaultSize={10} />
                      </div>
                      <input {...form.register("personalInfo.location")} className={inputClass()} placeholder="New York, NY" />
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Experience" icon={Briefcase} defaultOpen={false} control={control} watchFields={['experience.experiences.0.company', 'experience.experiences.0.role']}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className={labelClass()}>Section Heading Color</span>
                      <ColorPicker fieldKey="heading_experience" control={control} setValue={setValue} />
                    </div>
                    {expFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-white/5 rounded-xl bg-white/[0.01] relative space-y-3">
                        <button type="button" onClick={() => removeExp(index)} className="absolute top-2 right-2 text-white/20 hover:text-red-400 focus:outline-none transition-colors"><Trash2 className="w-4 h-4" /></button>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className={labelClass()}>Company</label>
                              <FieldStylingControls control={control} setValue={setValue} fieldKey={`exp_company_${index}`} defaultSize={11} />
                            </div>
                            <input {...form.register(`experience.experiences.${index}.company`)} className={inputClass()} placeholder="Company" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className={labelClass()}>Role</label>
                              <FieldStylingControls control={control} setValue={setValue} fieldKey={`exp_role_${index}`} defaultSize={12} />
                            </div>
                            <input {...form.register(`experience.experiences.${index}.role`)} className={inputClass()} placeholder="Role" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClass()}>Duration</label>
                            <FieldStylingControls control={control} setValue={setValue} fieldKey={`exp_duration_${index}`} defaultSize={9} />
                          </div>
                          <input {...form.register(`experience.experiences.${index}.duration`)} className={inputClass()} placeholder="Jan 2020 - Present" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClass()}>Description</label>
                            <FieldStylingControls control={control} setValue={setValue} fieldKey={`exp_desc_${index}`} defaultSize={10} />
                          </div>
                          <textarea {...form.register(`experience.experiences.${index}.description`)} className={`${inputClass()} min-h-[80px]`} placeholder="Achievements..." />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => appendExp({ company: "", role: "", duration: "", description: "" })} className="w-full py-3 border border-dashed border-premium-gold/20 rounded-xl text-premium-gold/60 text-xs font-bold uppercase tracking-wider hover:bg-premium-gold/5 transition-colors">
                      <Plus className="w-4 h-4 inline-block mr-2" /> Add Experience
                    </button>
                  </div>
                </FormSection>

                <FormSection title="Education" icon={GraduationCap} defaultOpen={false} control={control} watchFields={['education.education.0.school', 'education.education.0.degree']}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className={labelClass()}>Section Heading Color</span>
                      <ColorPicker fieldKey="heading_education" control={control} setValue={setValue} />
                    </div>
                    {eduFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-white/5 rounded-xl bg-white/[0.01] relative space-y-3">
                        <button type="button" onClick={() => removeEdu(index)} className="absolute top-2 right-2 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClass()}>School/University</label>
                            <FieldStylingControls control={control} setValue={setValue} fieldKey={`edu_school_${index}`} defaultSize={11} />
                          </div>
                          <input {...form.register(`education.education.${index}.school`)} className={inputClass()} placeholder="University Name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className={labelClass()}>Degree</label>
                              <FieldStylingControls control={control} setValue={setValue} fieldKey={`edu_degree_${index}`} defaultSize={10} />
                            </div>
                            <input {...form.register(`education.education.${index}.degree`)} className={inputClass()} placeholder="Degree" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className={labelClass()}>Year</label>
                              <FieldStylingControls control={control} setValue={setValue} fieldKey={`edu_year_${index}`} defaultSize={10} />
                            </div>
                            <input {...form.register(`education.education.${index}.year`)} className={inputClass()} placeholder="Year" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => appendEdu({ school: "", degree: "", year: "" })} className="w-full py-3 border border-dashed border-premium-gold/20 rounded-xl text-premium-gold/60 text-xs font-bold uppercase tracking-wider hover:bg-premium-gold/5 transition-colors">
                      <Plus className="w-4 h-4 inline-block mr-2" /> Add Education
                    </button>
                  </div>
                </FormSection>

                <FormSection title="Projects" icon={Layout} defaultOpen={false} control={control} watchFields={['projects.projects.0.name']}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className={labelClass()}>Section Heading Color</span>
                      <ColorPicker fieldKey="heading_projects" control={control} setValue={setValue} />
                    </div>
                    {projFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-white/5 rounded-xl bg-white/[0.01] relative space-y-3">
                        <button type="button" onClick={() => removeProj(index)} className="absolute top-2 right-2 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClass()}>Project Name</label>
                            <FieldStylingControls control={control} setValue={setValue} fieldKey={`proj_name_${index}`} defaultSize={12} />
                          </div>
                          <input {...form.register(`projects.projects.${index}.name`)} className={inputClass()} placeholder="Project Name" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClass()}>Project Link</label>
                            <FieldStylingControls control={control} setValue={setValue} fieldKey={`proj_link_${index}`} defaultSize={9} />
                          </div>
                          <input {...form.register(`projects.projects.${index}.link`)} className={inputClass()} placeholder="Link (optional)" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className={labelClass()}>Description</label>
                            <FieldStylingControls control={control} setValue={setValue} fieldKey={`proj_desc_${index}`} defaultSize={10} />
                          </div>
                          <textarea {...form.register(`projects.projects.${index}.description`)} className={`${inputClass()} min-h-[80px]`} placeholder="Project Impact..." />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => appendProj({ name: "", description: "", link: "" })} className="w-full py-3 border border-dashed border-premium-gold/20 rounded-xl text-premium-gold/60 text-xs font-bold uppercase tracking-wider hover:bg-premium-gold/5 transition-colors">
                      <Plus className="w-4 h-4 inline-block mr-2" /> Add Project
                    </button>
                  </div>
                </FormSection>

                <FormSection title="Attachments" icon={FileText} defaultOpen={false} control={control}>
                  <div className="space-y-4">
                    {attachFields.map((field, index) => (
                      <div key={field.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-xs text-premium-gold font-medium truncate max-w-[250px]">{field.name}</span>
                        <button type="button" onClick={() => removeAttach(index)} className="text-white/20 hover:text-red-400 focus:outline-none"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <div className="relative">
                      <button type="button" className="w-full py-3 border border-dashed border-premium-gold/20 rounded-xl text-premium-gold/60 text-xs font-bold uppercase tracking-wider hover:bg-premium-gold/5">
                        <Plus className="w-4 h-4 inline-block mr-2" /> Upload PDF / Images
                      </button>
                      <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </FormSection>

                <div className="flex flex-col gap-4 pt-6">
                  <div className="relative group">
                    <button type="submit" disabled={isGenerating} className="w-full btn-gold py-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 focus:outline-none">
                      {isGenerating ? <div className="spinner-gold !border-black" /> : <Sparkles className="w-4 h-4" />}
                      {isGenerating ? "Processing..." : "Enhance with AI Elite"}
                    </button>
                    <div className="absolute -top-12 left-0 right-0 bg-black/90 border border-premium-gold/30 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-[10px] text-premium-gold/80 leading-relaxed backdrop-blur-md">
                      <HelpCircle className="w-3 h-3 inline mr-1 mb-0.5" />
                      <strong>AI Elite:</strong> Analyzes your experience and education to craft high-impact professional summaries.
                    </div>
                  </div>
                  <button type="button" onClick={downloadPDF} className="w-full py-4 border border-premium-gold/20 text-premium-gold rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-premium-gold/5 focus:outline-none focus:ring-1 focus:ring-premium-gold/30">
                    <Download className="w-4 h-4" /> Export Professional PDF
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <ResumePreview
          control={control}
          aiContent={aiContent}
          templateId={selectedTemplate}
          showMobilePreview={showMobilePreview}
          setShowMobilePreview={setShowMobilePreview}
          maximizedPanel={maximizedPanel}
          setMaximizedPanel={setMaximizedPanel}
          previewRef={previewRef}
        />
      </div>
    </FormProvider>
  );
}
