export interface UserProfile {
  name: string;
  email: string;
  title: string;
  yearsExperience: number;
  skills: Skill[];
  desiredRoles: string[];
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  education: string;
  summary: string;
  resumeFileName: string;
  location: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: { min: number; max: number };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  tags: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  matchScore: number;
  applied: boolean;
  saved: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  appliedDate: string;
  status: 'queued' | 'submitted' | 'reviewed' | 'interview' | 'offer' | 'rejected';
  matchScore: number;
  coverLetter: string;
  salary: { min: number; max: number };
}

export type ViewType = 'profile' | 'discovery' | 'applications' | 'analytics';
