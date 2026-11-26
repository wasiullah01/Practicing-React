import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Check, X } from 'lucide-react'
import {
  getLeaveRequests,
  updateLeaveRequestStatus,
} from '../data/leaveRequestService'
import type { Employee } from '../types/employee'
import type {
  LeaveRequest,
  LeaveRequestDecision,
} from '../types/leaveRequest'

interface LeaveRequestsDialogProps {
  employees: Employee[]
  onClose: () => void
  onStatusChanged: (request: LeaveRequest) => void
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Leave requests could not be loaded in this browser.'
}

function readStoredRequests() {
  try {
    return { requests: getLeaveRequests(), error: '' }
  } catch (error) {
    return {
      requests: [] as LeaveRequest[],
      error: `Leave requests could not be loaded: ${getErrorMessage(error)}`,
    }
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export default function LeaveRequestsDialog({
  employees,
  onClose,
  onStatusChanged,
}: LeaveRequestsDialogProps) {
  const [stored, setStored] = useState(readStoredRequests)
  const [actionError, setActionError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  function decide(requestId: string, status: LeaveRequestDecision) {
    setUpdatingId(requestId)
    setActionError('')

    try {
      const updatedRequest = updateLeaveRequestStatus(requestId, status)
      setStored((current) => ({
        ...current,
        requests: current.requests.map((request) =>
          request.id === requestId ? updatedRequest : request,
        ),
      }))
      onStatusChanged(updatedRequest)
    } catch (error) {
      setActionError(`The leave request could not be updated: ${getErrorMessage(error)}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const requests = [...stored.requests].sort((first, second) =>
    second.submittedAt.localeCompare(first.submittedAt),
  )

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle component="div">
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Leave requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review requests and approve or reject pending leave.
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          {stored.error && <Alert severity="error">{stored.error}</Alert>}
          {actionError && <Alert severity="error">{actionError}</Alert>}
          {!stored.error && requests.length === 0 && (
            <Alert severity="info">There are no leave requests to review yet.</Alert>
          )}
          {requests.map((request) => {
            const employee = employees.find((item) => item.id === request.employeeId)
            const employeeName = employee
              ? `${employee.firstName} ${employee.lastName}`
              : 'Employee not found'

            return (
              <Paper
                key={request.id}
                variant="outlined"
                sx={{ p: { xs: 1.75, sm: 2.25 }, borderColor: 'grey.200' }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ justifyContent: 'space-between' }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {employeeName}
                      </Typography>
                      <Chip
                        size="small"
                        label={request.status}
                        color={
                          request.status === 'Approved'
                            ? 'success'
                            : request.status === 'Rejected'
                              ? 'error'
                              : 'warning'
                        }
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                      {request.leaveType} · {formatDate(request.startDate)} – {formatDate(request.endDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                    >
                      {request.reason}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                      Submitted {formatDate(request.submittedAt.slice(0, 10))}
                    </Typography>
                  </Box>

                  {request.status === 'Pending' && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center', flexShrink: 0 }}
                    >
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<X size={15} />}
                        aria-label={`Reject leave request for ${employeeName}`}
                        disabled={Boolean(updatingId)}
                        onClick={() => decide(request.id, 'Rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        startIcon={<Check size={15} />}
                        aria-label={`Approve leave request for ${employeeName}`}
                        disabled={Boolean(updatingId)}
                        onClick={() => decide(request.id, 'Approved')}
                      >
                        Approve
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  )
}
