import type { Employee, EmployeeInput, EmployeeStatus } from '../types/employee'

const storageKey = 'peopleflow.employees'

const starterEmployees: Employee[] = [
  {
    id: 'emp-001',
    firstName: 'Olivia',
    lastName: 'Rhye',
    workEmail: 'olivia.rhye@acme.io',
    phone: '+1 (415) 555-0132',
    department: 'Design',
    jobTitle: 'Product Designer',
    employmentType: 'Full-time',
    startDate: '2022-03-14',
    manager: 'Marcus Chen',
    emergencyContactName: 'Sam Rhye',
    emergencyContactPhone: '+1 (415) 555-0140',
    workHistory: [{ company: 'Layers', position: 'Visual Designer', years: '3' }],
    status: 'Active',
  },
  {
    id: 'emp-002',
    firstName: 'Phoenix',
    lastName: 'Baker',
    workEmail: 'phoenix.baker@acme.io',
    phone: '+1 (415) 555-0184',
    department: 'Engineering',
    jobTitle: 'Senior Engineer',
    employmentType: 'Full-time',
    startDate: '2021-08-02',
    manager: 'Marcus Chen',
    emergencyContactName: '',
    emergencyContactPhone: '',
    workHistory: [],
    status: 'Active',
  },
  {
    id: 'emp-003',
    firstName: 'Lana',
    lastName: 'Steiner',
    workEmail: 'lana.steiner@acme.io',
    phone: '+1 (415) 555-0156',
    department: 'People',
    jobTitle: 'People Partner',
    employmentType: 'Full-time',
    startDate: '2023-01-09',
    manager: 'Marcus Chen',
    emergencyContactName: '',
    emergencyContactPhone: '',
    workHistory: [],
    status: 'Active',
  },
  {
    id: 'emp-004',
    firstName: 'Demi',
    lastName: 'Wilkinson',
    workEmail: 'demi.wilkinson@acme.io',
    phone: '+1 (415) 555-0118',
    department: 'Marketing',
    jobTitle: 'Content Strategist',
    employmentType: 'Contract',
    startDate: '2024-06-17',
    manager: 'Olivia Rhye',
    emergencyContactName: '',
    emergencyContactPhone: '',
    workHistory: [],
    status: 'Onboarding',
  },
  {
    id: 'emp-005',
    firstName: 'Candice',
    lastName: 'Wu',
    workEmail: 'candice.wu@acme.io',
    phone: '+1 (415) 555-0173',
    department: 'Engineering',
    jobTitle: 'Frontend Developer',
    employmentType: 'Full-time',
    startDate: '2024-09-23',
    manager: 'Phoenix Baker',
    emergencyContactName: '',
    emergencyContactPhone: '',
    workHistory: [],
    status: 'Onboarding',
  },
]

export function getEmployees(): Employee[] {
  const savedEmployees = localStorage.getItem(storageKey)
  return savedEmployees ? (JSON.parse(savedEmployees) as Employee[]) : starterEmployees
}

export async function isWorkEmailAvailable(
  email: string,
  employees: Employee[],
  excludeId?: string,
): Promise<boolean> {
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  const normalizedEmail = email.trim().toLowerCase()

  return !employees.some(
    (employee) =>
      employee.id !== excludeId && employee.workEmail.toLowerCase() === normalizedEmail,
  )
}

export class EmployeeServiceError extends Error {
  public readonly fieldErrors: Partial<Record<keyof EmployeeInput, string>>

  constructor(
    message: string,
    fieldErrors: Partial<Record<keyof EmployeeInput, string>> = {},
  ) {
    super(message)
    this.name = 'EmployeeServiceError'
    this.fieldErrors = fieldErrors
  }
}

export async function saveEmployee(
  input: EmployeeInput,
  employeeId?: string,
  status?: EmployeeStatus,
): Promise<Employee> {
  await new Promise((resolve) => window.setTimeout(resolve, 500))
  const latestEmployees = getEmployees()

  const emailTaken = latestEmployees.some(
    (employee) =>
      employee.id !== employeeId &&
      employee.workEmail.toLowerCase() === input.workEmail.trim().toLowerCase(),
  )

  if (emailTaken) {
    throw new EmployeeServiceError('Please fix the highlighted field.', {
      workEmail: 'This work email is already assigned to an employee.',
    })
  }

  const currentEmployee = latestEmployees.find((employee) => employee.id === employeeId)
  const employee: Employee = {
    ...input,
    id: employeeId ?? `emp-${crypto.randomUUID()}`,
    status: status ?? currentEmployee?.status ?? 'Onboarding',
  }
  const updatedEmployees = currentEmployee
    ? latestEmployees.map((item) => (item.id === employee.id ? employee : item))
    : [employee, ...latestEmployees]

  localStorage.setItem(storageKey, JSON.stringify(updatedEmployees))
  return employee
}
