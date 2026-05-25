import Groq from "groq-sdk";
import pdfParse from "pdf-parse";

export async function extractResumeText(resumeUrl: string): Promise<string> {
  try {
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      console.warn("Unable to download resume file, using fallback text.");
      return "Candidate resume file downloaded failed. Check original file url.";
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const parsed = await pdfParse(buffer);
    return (parsed.text || "").slice(0, 6000).trim() || "Empty resume file or text could not be parsed.";
  } catch (err) {
    console.error("PDF parsing failed, falling back to empty/placeholder text:", err);
    return "Detailed resume text could not be extracted (non-PDF or scanned document). Review the uploaded document directly.";
  }
}

export async function scoreResume({
  jobTitle,
  jobDescription,
  resumeText
}: {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
}) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("GROQ_API_KEY is missing. Falling back to sandbox mock score.");
    return {
      score: 75,
      feedback: "Sandbox mock score. Configure GROQ_API_KEY to enable real-time llama-3.3 compatibility screening."
    };
  }

  const groq = new Groq({ apiKey });

  const prompt = `
You are an ATS evaluator. Score the candidate resume against the job description.
Return JSON only with keys: score (0-100 integer) and feedback (max 3 bullet sentences).

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Resume:
${resumeText}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.choices[0]?.message?.content ?? "";
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) {
      throw new Error("AI response was not JSON.");
    }

    const parsed = JSON.parse(content.slice(jsonStart, jsonEnd + 1)) as {
      score: number;
      feedback: string | string[];
    };

    let feedback = "";
    if (Array.isArray(parsed.feedback)) {
      feedback = parsed.feedback.join(" ");
    } else if (typeof parsed.feedback === "string") {
      feedback = parsed.feedback;
    } else if (parsed.feedback) {
      feedback = String(parsed.feedback);
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      feedback: feedback || "Resume successfully parsed and scored."
    };
  } catch (err) {
    console.error("Groq screening api call failed, using fallback mock score:", err);
    return {
      score: 65,
      feedback: "Match screening fallback. Groq API is temporarily unavailable or returned invalid JSON format. Candidate is queued for manual verification."
    };
  }
}
