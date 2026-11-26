export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'
export type EmployeeStatus = 'Active' | 'Onboarding'

export interface WorkHistoryEntry {
  company: string
  position: string
  years: string
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  workEmail: string
  phone: string
  department: string
  jobTitle: string
  employmentType: EmploymentType
  startDate: string
  manager: string
  emergencyContactName: string
  emergencyContactPhone: string
  workHistory: WorkHistoryEntry[]
  status: EmployeeStatus
}

export type EmployeeInput = Omit<Employee, 'id' | 'status'>
export type EmployeeUpdate = Partial<EmployeeInput>
export type EmployeeListItem = Pick<
  Employee,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'workEmail'
  | 'department'
  | 'jobTitle'
  | 'startDate'
  | 'status'
>
