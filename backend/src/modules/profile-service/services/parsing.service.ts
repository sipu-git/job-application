import { geminiModel } from "../../../shared/integrations/configs/genAi.config";

function extractJSON(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("AI did not return valid JSON.");
        }
        return JSON.parse(match[0]);
    }
}

function parseResumeInfos(data: any) {
    return {
        fullName: data?.fullName || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || data?.phone || "",
        address: data?.address || "",
        skills: Array.isArray(data?.skills)
            ? [...new Set(data.skills.map((s: string) => String(s).trim()))]
            : [],
        education: Array.isArray(data?.education)
            ? data.education.map((edu: any) => ({
                institution: edu?.institution || "",
                degree: edu?.degree || "",
                fieldOfStudy: edu?.fieldOfStudy || "",
                startDate: edu?.startDate || "",
                endDate: edu?.endDate || "",
            }))
            : [],
        experience: Array.isArray(data?.experience)
            ? data.experience.map((exp: any) => ({
                company: exp?.company || "",
                designation: exp?.designation || "",
                location: exp?.location || "",
                startDate: exp?.startDate || "",
                endDate: exp?.endDate || "",
                description: exp?.description || "",
            }))
            : [],
        certifications: Array.isArray(data?.certifications)
            ? data.certifications.map((cert: any) => ({
                title: cert?.title || "",
                issuer: cert?.issuer || "",
                year: cert?.year || "",
            }))
            : [],
        languages: Array.isArray(data?.languages)
            ? data.languages.map((l: string) => String(l))
            : [],
    };

}

export async function parseBYGenAi(rawText: string) {
    const prompt = `
You are a STRICT JSON extraction engine.

CRITICAL RULES:
- Output MUST be valid JSON.
- Output MUST start with { and end with }.
- NO markdown.
- NO explanation.
- NO extra text.
- NEVER return null.
- If data is missing, use "" or [].
- Do NOT fabricate information.

Extract structured data from the resume below.

STRICT OUTPUT FORMAT:

{
  "fullName": "",
  "email": "",
  "phoneNumber": "",
  "address": "",
  "skills": [],
  "education": [],
  "experience": [],
  "certifications": [],
  "languages": []
}

Resume:${rawText}`;
    const results = await geminiModel.generateContent(prompt);

    const response = results.response.text()
    const parseJsonData = extractJSON(response);
    const cleanData = parseResumeInfos(parseJsonData)
    return cleanData;
}

