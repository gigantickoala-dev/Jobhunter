export type ApplicationStatus = 
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  url: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes: string;
  contactName: string;
  contactEmail: string;
  tags: string[];
  createdAt: string;
}

export type ViewMode = 'dashboard' | 'applications' | 'add';

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  saved: { label: 'Saved', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  applied: { label: 'Applied', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  screening: { label: 'Screening', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  interview: { label: 'Interview', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  offer: { label: 'Offer', color: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
  withdrawn: { label: 'Withdrawn', color: 'text-slate-700', bgColor: 'bg-slate-100' },
};
