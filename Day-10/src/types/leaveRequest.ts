export type LeaveType = 'Annual' | 'Sick' | 'Personal' | 'Parental' | 'Unpaid'
export type LeaveRequestStatus = 'Pending' | 'Approved' | 'Rejected'
export type LeaveRequestDecision = Exclude<LeaveRequestStatus, 'Pending'>

export interface LeaveRequestInput {
  employeeId: string
  leaveType: LeaveType | ''
  startDate: string
  endDate: string
  reason: string
}

export interface LeaveRequest extends LeaveRequestInput {
  id: string
  status: LeaveRequestStatus
  submittedAt: string
}
