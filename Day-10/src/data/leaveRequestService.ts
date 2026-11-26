import type {
  LeaveRequest,
  LeaveRequestDecision,
  LeaveRequestInput,
} from '../types/leaveRequest'

const storageKey = 'peopleflow.leaveRequests'

function isLeaveRequest(value: unknown): value is LeaveRequest {
  if (typeof value !== 'object' || value === null) return false

  const request = value as Record<string, unknown>
  return (
    typeof request.id === 'string' &&
    typeof request.employeeId === 'string' &&
    typeof request.leaveType === 'string' &&
    typeof request.startDate === 'string' &&
    typeof request.endDate === 'string' &&
    typeof request.reason === 'string' &&
    (request.status === 'Pending' ||
      request.status === 'Approved' ||
      request.status === 'Rejected') &&
    typeof request.submittedAt === 'string'
  )
}

export function getLeaveRequests(): LeaveRequest[] {
  const savedRequests = localStorage.getItem(storageKey)
  if (!savedRequests) return []

  const parsedRequests: unknown = JSON.parse(savedRequests)
  if (!Array.isArray(parsedRequests) || !parsedRequests.every(isLeaveRequest)) {
    throw new Error('Saved leave requests have an invalid format.')
  }

  return parsedRequests
}

function hasDateOverlap(
  existingRequest: LeaveRequest,
  request: Pick<LeaveRequestInput, 'employeeId' | 'startDate' | 'endDate'>,
) {
  return (
    existingRequest.status !== 'Rejected' &&
    existingRequest.employeeId === request.employeeId &&
    request.startDate <= existingRequest.endDate &&
    request.endDate >= existingRequest.startDate
  )
}

export class LeaveRequestConflictError extends Error {
  constructor() {
    super('This employee already has a pending or approved leave request for overlapping dates.')
    this.name = 'LeaveRequestConflictError'
  }
}

export function saveLeaveRequest(input: LeaveRequestInput): LeaveRequest {
  const existingRequests = getLeaveRequests()
  if (existingRequests.some((request) => hasDateOverlap(request, input))) {
    throw new LeaveRequestConflictError()
  }

  const savedRequest: LeaveRequest = {
    ...input,
    id: `leave-${crypto.randomUUID()}`,
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey, JSON.stringify([...existingRequests, savedRequest]))

  return savedRequest
}

export function hasOverlappingLeaveRequest(
  requests: LeaveRequest[],
  input: Pick<LeaveRequestInput, 'employeeId' | 'startDate' | 'endDate'>,
) {
  return requests.some((request) => hasDateOverlap(request, input))
}

export function updateLeaveRequestStatus(
  requestId: string,
  status: LeaveRequestDecision,
): LeaveRequest {
  const requests = getLeaveRequests()
  const request = requests.find((item) => item.id === requestId)

  if (!request) {
    throw new Error('This leave request could not be found. Refresh and try again.')
  }
  if (request.status !== 'Pending') {
    throw new Error('Only pending leave requests can be reviewed.')
  }

  const updatedRequest = { ...request, status }
  localStorage.setItem(
    storageKey,
    JSON.stringify(
      requests.map((item) => (item.id === requestId ? updatedRequest : item)),
    ),
  )

  return updatedRequest
}
