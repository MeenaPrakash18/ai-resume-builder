import { NextResponse } from "next/server";
import { generateResumeContent } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { fullResumeSchema } from "@/lib/schemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Zod Validation
        const validationResult = fullResumeSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Invalid resume data. Please check all required fields are filled correctly.", details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const resumeData = validationResult.data;

        // 2. Generate AI Content (now includes built-in fallback)
        let aiContent;
        try {
            aiContent = await generateResumeContent(resumeData);
        } catch (aiError: unknown) {
            console.error("AI generation error (using emergency fallback):", aiError);
            // Emergency fallback — create a basic resume from user data
            aiContent = {
                summary: `${resumeData.personalInfo.fullName} is an experienced professional with a proven track record of delivering results. Bringing strong analytical and communication skills to every project, they are committed to driving innovation and achieving excellence.`,
                skills: ["Communication", "Problem Solving", "Team Collaboration", "Project Management", "Analytical Thinking", "Adaptability", "Time Management", "Leadership"],
            };
        }

        // 3. Save to Supabase (if configured)
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            try {
                const { error: dbError } = await supabase.from("resumes").insert([
                    {
                        full_name: resumeData.personalInfo.fullName,
                        contact_info: resumeData.personalInfo,
                        experience: resumeData.experience,
                        education: resumeData.education,
                        projects: resumeData.projects,
                        summary: aiContent.summary,
                        skills: aiContent.skills,
                    }
                ]);

                if (dbError) {
                    console.error("Supabase Error:", dbError);
                }
            } catch (e) {
                console.error("Failed to connect to Supabase", e);
            }
        }

        // 4. Return combined result
        return NextResponse.json({
            message: "Resume generated successfully",
            resumeData: aiContent,
        });

    } catch (error: unknown) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Something went wrong during resume generation. Please try again." },
            { status: 500 }
        );
    }
}
