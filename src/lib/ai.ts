import { FullResumeData } from "./schemas";

const SYSTEM_PROMPT = `
You are an expert ATS-optimized resume writer. Convert the user's details into a professional, concise, and highly effective resume summary and key skills list.
Return ONLY valid JSON in the following format, with no markdown formatting or extra text:

{
  "summary": "A professional 3-sentence summary highlighting the user's top achievements, value proposition, and career goals.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"]
}
`;

// Models to try, in order of preference
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

/**
 * Generate a basic fallback resume content from the user's own data
 * when the AI API is unavailable.
 */
function generateFallbackContent(data: FullResumeData): { summary: string; skills: string[] } {
  const name = data.personalInfo.fullName || "Professional";
  const roles = data.experience.experiences
    .filter((e) => e.role)
    .map((e) => e.role);
  const companies = data.experience.experiences
    .filter((e) => e.company)
    .map((e) => e.company);

  const roleText = roles.length > 0 ? roles[0] : "experienced professional";
  const companyText = companies.length > 0 ? ` with experience at ${companies.slice(0, 2).join(" and ")}` : "";

  const summary = `${name} is a dedicated ${roleText}${companyText}. With a strong track record of delivering results and a passion for excellence, ${name} brings valuable expertise to every project. Looking forward to contributing to innovative teams and driving impactful outcomes.`;

  // Extract skills from experience descriptions and project descriptions
  const commonSkills = [
    "Communication", "Problem Solving", "Team Collaboration",
    "Project Management", "Analytical Thinking", "Adaptability",
    "Time Management", "Leadership",
  ];

  return { summary, skills: commonSkills };
}

export async function generateResumeContent(data: FullResumeData) {
  const apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("No AI API key configured. Using fallback content generation.");
    return generateFallbackContent(data);
  }

  // Choose the endpoint based on the provider
  const provider = process.env.AI_API_PROVIDER?.toLowerCase() || (process.env.GROQ_API_KEY ? 'groq' : 'openrouter');

  const isGroq = provider === 'groq';
  const endpoint = isGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://openrouter.ai/api/v1/chat/completions";

  const modelsToTry = isGroq ? GROQ_MODELS : ["google/gemini-2.5-flash"];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(data) }
          ],
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || response.statusText;
        console.warn(`Model ${model} failed: ${errorMsg}`);
        lastError = new Error(errorMsg);

        // If it's an auth error, don't try other models
        if (response.status === 401 || response.status === 403) {
          console.warn("API key authentication failed. Using fallback.");
          return generateFallbackContent(data);
        }
        continue; // Try next model
      }

      const jsonResponse = await response.json();
      const content = jsonResponse.choices[0].message.content;

      const parsedContent = JSON.parse(content);

      // Safely extract the summary if the AI returned a nested object
      if (typeof parsedContent.summary === 'object' && parsedContent.summary !== null) {
        const summaryObj = parsedContent.summary as Record<string, string>;
        parsedContent.summary = Object.values(summaryObj)
          .map(val => String(val))
          .join(" ");
      }

      return parsedContent as { summary: string; skills: string[] };

    } catch (error: unknown) {
      const err = error as Error;
      console.warn(`Error with model ${model}:`, err.message);
      lastError = err;
      continue; // Try next model
    }
  }

  // All models failed — use fallback instead of crashing
  console.error("All AI models failed. Using fallback content.", lastError);
  return generateFallbackContent(data);
}
