export type Gender = 'Male' | 'Female' | 'Other';

export type StudentStatus = 'Active' | 'Pending' | 'Inactive';

export type Course =
  | 'Computer Science'
  | 'Software Engineering'
  | 'Artificial Intelligence'
  | 'Cybersecurity'
  | 'Data Science'
  | 'Cloud Computing';

export interface Student {
  id: string; // Unique key for reconciliation & list rendering
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  course: Course;
  semester: string;
  status: StudentStatus;
  registeredAt: string;
  notes: string; // Captured via uncontrolled component (useRef)
  avatarColor: string;
}

export interface StudentFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender | '';
  course: Course | '';
  semester: string;
  agreeToTerms: boolean;
}

export type FormErrors = Partial<Record<keyof StudentFormData | 'notes', string>>;

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

export interface FilterState {
  searchQuery: string;
  course: string;
  status: string;
  sortBy: SortOption;
}
