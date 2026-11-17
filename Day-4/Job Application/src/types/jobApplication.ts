export type JobPosition =
  | 'Frontend React Developer'
  | 'Fullstack Engineer'
  | 'UI/UX Product Designer'
  | 'DevOps & Cloud Engineer'
  | 'AI / ML Engineer'
  | 'Technical Product Manager';

export type ApplicationStatus =
  | 'Under Review'
  | 'Interviewing'
  | 'Offer Extended'
  | 'Rejected';

export type WorkArrangement = 'Remote' | 'Hybrid' | 'On-site';

export type ExperienceType = 'experienced' | 'fresh-grad';

export interface ExperiencedDetails {
  yearsOfExperience: number;
  currentCompany: string;
  currentJobTitle: string;
  noticePeriod: string;
}

export interface FreshGradDetails {
  university: string;
  major: string;
  graduationYear: number;
  gpa: string;
  capstoneProjectUrl: string;
}

export interface RemoteDetails {
  timezone: string;
  hasHomeOffice: boolean;
}

export interface OnsiteDetails {
  willingToRelocate: boolean;
  relocationTimeline: string;
}

export interface VisaDetails {
  requiresSponsorship: boolean;
  visaType?: string;
  visaExpiration?: string;
}

export interface JobApplication {
  id: string; // Unique reconciliation key (e.g. APP-2026-101)
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  position: JobPosition;
  workArrangement: WorkArrangement;
  status: ApplicationStatus;
  appliedDate: string;
  avatarColor: string;

  // CONDITIONAL FIELDS:
  experienceType: ExperienceType;
  experiencedDetails?: ExperiencedDetails;
  freshGradDetails?: FreshGradDetails;

  // CONDITIONAL WORK ARRANGEMENT:
  remoteDetails?: RemoteDetails;
  onsiteDetails?: OnsiteDetails;

  // CONDITIONAL VISA SPONSORSHIP:
  visaDetails: VisaDetails;

  // UNCONTROLLED COMPONENT FIELDS (via useRef):
  resumeFileName?: string;
  coverLetterNotes: string;
}

export interface JobApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  position: JobPosition | '';
  workArrangement: WorkArrangement;
  
  // Conditional 1: Experience
  experienceType: ExperienceType;
  yearsOfExperience: string;
  currentCompany: string;
  currentJobTitle: string;
  noticePeriod: string;
  university: string;
  major: string;
  graduationYear: string;
  gpa: string;
  capstoneProjectUrl: string;

  // Conditional 2: Work Arrangement
  timezone: string;
  hasHomeOffice: boolean;
  willingToRelocate: boolean;
  relocationTimeline: string;

  // Conditional 3: Visa Sponsorship
  requiresSponsorship: boolean;
  visaType: string;
  visaExpiration: string;

  // Agreement
  agreeToPrivacy: boolean;
}

export type FormErrors = Partial<Record<keyof JobApplicationFormData | 'resume' | 'coverLetter', string>>;

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'status';

export interface FilterState {
  searchQuery: string;
  position: string;
  status: string;
  workArrangement: string;
  experienceType: string;
  sortBy: SortOption;
}
