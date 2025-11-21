import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CandidateAnalysis } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Candidate's full name inferred from resume" },
    email: { type: Type.STRING, description: "Candidate's email address if available" },
    matchScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating fit for the role" },
    summary: { type: Type.STRING, description: "A concise 2-3 sentence executive summary of the candidate's fit" },
    keyStrengths: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Top 3-5 strengths relevant to the job description" 
    },
    missingSkills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Critical skills or qualifications missing from the resume" 
    },
    experienceYears: { type: Type.NUMBER, description: "Total years of relevant experience" },
    educationLevel: { type: Type.STRING, description: "Highest education degree found" },
  },
  required: ["name", "matchScore", "summary", "keyStrengths", "missingSkills", "experienceYears"],
};

export const analyzeResume = async (
  file: File, 
  jobDescription: string,
  fileId: string
): Promise<CandidateAnalysis> => {
  try {
    const base64Data = await fileToGenerativePart(file);
    
    // Using gemini-2.5-flash for speed and efficiency in text/document analysis
    const model = "gemini-2.5-flash";

    const response = await genAI.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: `
              You are an expert technical recruiter and HR hiring manager. 
              Analyze the attached resume against the following Job Description.
              
              JOB DESCRIPTION:
              ${jobDescription}
              
              Be strict but fair. Look for concrete evidence of skills, not just keywords.
              Provide the output in strictly valid JSON format matching the schema.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, // Low temperature for more consistent factual extraction
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    const data = JSON.parse(text);

    return {
      id: fileId,
      fileName: file.name,
      status: 'success',
      ...data
    };

  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    return {
      id: fileId,
      fileName: file.name,
      name: "Unknown Candidate",
      matchScore: 0,
      summary: "Failed to analyze resume.",
      keyStrengths: [],
      missingSkills: [],
      experienceYears: 0,
      status: 'error',
      errorMessage: error.message || "Unknown error"
    };
  }
};

// Helper to convert File to Base64 string (without metadata prefix)
const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
