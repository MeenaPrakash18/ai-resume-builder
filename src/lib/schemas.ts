import { z } from "zod";

export const personalInfoSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    phone: z.string().default(""),
    jobTitle: z.string().default(""),
    location: z.string().default(""),
    profileImage: z.string().default(""), // Base64 string
    fontStyle: z.string().default("sans"),
    fontSize: z.number().min(10).max(18).default(12),
});

export const experienceSchema = z.object({
    experiences: z.array(
        z.object({
            company: z.string().min(1, "Company is required."),
            role: z.string().min(1, "Role is required."),
            duration: z.string().min(1, "Duration is required."),
            description: z.string().min(10, "Description should be at least 10 characters."),
        })
    ).min(1, "At least one experience is required."),
});

export const educationSchema = z.object({
    education: z.array(
        z.object({
            school: z.string().min(1, "School is required."),
            degree: z.string().min(1, "Degree is required."),
            year: z.string().min(1, "Graduation year is required."),
        })
    ).min(1, "At least one education entry is required."),
});

export const projectSchema = z.object({
    projects: z.array(
        z.object({
            name: z.string().min(1, "Project name is required."),
            description: z.string().min(10, "Description should be at least 10 characters."),
            link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
        })
    ).optional(),
});

export const certificationSchema = z.object({
    certifications: z.array(
        z.object({
            name: z.string().min(1, "Certification name is required."),
            issuer: z.string().min(1, "Issuer is required."),
            year: z.string().optional(),
        })
    ).optional(),
});

export const achievementSchema = z.object({
    achievements: z.array(
        z.object({
            title: z.string().min(1, "Achievement title is required."),
            description: z.string().min(5, "Description is required."),
        })
    ).optional(),
});

export const fullResumeSchema = z.object({
    personalInfo: personalInfoSchema,
    experience: experienceSchema,
    education: educationSchema,
    projects: projectSchema,
    certifications: certificationSchema.optional(),
    achievements: achievementSchema.optional(),
    fieldColors: z.record(z.string(), z.string()).optional().default({}),
    fieldFontSizes: z.record(z.string(), z.number()).optional().default({}),
    fieldFontTypes: z.record(z.string(), z.string()).optional().default({}),
    attachments: z.array(z.object({
        name: z.string(),
        data: z.string(), // Base64 or URL
    })).optional(),
});

export type FullResumeData = z.infer<typeof fullResumeSchema>;
