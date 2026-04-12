export type UserRole = 'admin' | 'user' | 'guest';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  createdAt: number;
}

export interface InterviewSetup {
  role: string;
  level: 'entry' | 'mid' | 'senior' | 'lead';
  stack: string[];
  type: 'behavioral' | 'technical' | 'mixed';
  questionCount: number;
  focusAreas: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  setup: InterviewSetup;
  status: 'pending' | 'active' | 'completed';
  transcript: TranscriptMessage[];
  questions: string[];
  answers: string[];
  duration: number;
  score?: number;
  feedback?: InterviewFeedback;
  createdAt: number;
}

export interface TranscriptMessage {
  role: 'interviewer' | 'user';
  text: string;
  timestamp: number;
}

export interface InterviewFeedback {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  clarityScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
  practiceExercises: string[];
  summary: string;
  detailedAnalysis: string;
}
