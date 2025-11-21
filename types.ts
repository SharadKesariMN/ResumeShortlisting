export enum AnalysisStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface CandidateAnalysis {
  id: string;
  fileName: string;
  name: string;
  email?: string;
  matchScore: number; // 0-100
  summary: string;
  keyStrengths: string[];
  missingSkills: string[];
  experienceYears: number;
  educationLevel?: string;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface JobContext {
  title: string;
  description: string;
}

export interface ProcessingStats {
  total: number;
  completed: number;
  success: number;
  failed: number;
}
