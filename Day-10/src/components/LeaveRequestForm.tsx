import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import MuiTextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { CalendarDays, Send } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  getLeaveRequests,
  hasOverlappingLeaveRequest,
  LeaveRequestConflictError,
  saveLeaveRequest,
} from '../data/leaveRequestService'
import type { Employee } from '../types/employee'
import type { LeaveRequest, LeaveRequestInput, LeaveType } from '../types/leaveRequest'
import FormTextField from './TextField'

interface LeaveRequestFormProps {
  employees: Employee[]
  onClose: () => void
  onSubmitted: (request: LeaveRequest) => void
}

const leaveTypes: LeaveType[] = ['Annual', 'Sick', 'Personal', 'Parental', 'Unpaid']

function getLocalDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Saved leave requests could not be loaded in this browser.'
}

export default function LeaveRequestForm({
  employees,
  onClose,
  onSubmitted,
}: LeaveRequestFormProps) {
  const [today] = useState(() => getLocalDateValue(new Date()))
  const [storedRequests] = useState(() => {
    try {
      return { requests: getLeaveRequests(), error: '' }
    } catch (error) {
      return {
        requests: [] as LeaveRequest[],
        error: `Leave requests could not be loaded: ${getErrorMessage(error)}`,
      }
    }
  })
  const { requests: savedRequests, error: loadError } = storedRequests

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestInput>({
    defaultValues: {
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  const startDate = useWatch({ control, name: 'startDate' })

  function submit(values: LeaveRequestInput) {
    try {
      const request = saveLeaveRequest({
        ...values,
        reason: values.reason.trim(),
      })
      onSubmitted(request)
    } catch (error) {
      if (error instanceof LeaveRequestConflictError) {
        setError('endDate', { type: 'validate', message: error.message })
        return
      }

      setError('root.server', {
        type: 'server',
        message: `Leave request could not be saved: ${getErrorMessage(error)}`,
      })
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div" sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <CalendarDays size={21} color="#5146e5" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Request leave
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit time off for review.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="leave-request-form"
          onSubmit={handleSubmit(submit)}
          sx={{ display: 'grid', gap: 2, pt: 1.5 }}
        >
          {loadError && <Alert severity="error">{loadError}</Alert>}
          {errors.root?.server?.message && (
            <Alert severity="error">{errors.root.server.message}</Alert>
          )}
          {employees.length === 0 && (
            <Alert severity="info">Add an employee before submitting a leave request.</Alert>
          )}

          <Controller
            name="employeeId"
            control={control}
            rules={{ required: 'Choose an employee.' }}
            render={({ field }) => (
              <MuiTextField
                select
                label="Employee"
                value={field.value}
                onChange={(event) => {
                  field.onChange(event)
                  void trigger('endDate')
                }}
                onBlur={field.onBlur}
                inputRef={field.ref}
                error={Boolean(errors.employeeId)}
                helperText={errors.employeeId?.message}
              >
                <MenuItem value="">Select an employee</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </MenuItem>
                ))}
              </MuiTextField>
            )}
          />

          <Controller
            name="leaveType"
            control={control}
            rules={{ required: 'Choose a leave type.' }}
            render={({ field }) => (
              <MuiTextField
                select
                label="Leave type"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                error={Boolean(errors.leaveType)}
                helperText={errors.leaveType?.message}
              >
                <MenuItem value="">Select a leave type</MenuItem>
                {leaveTypes.map((leaveType) => (
                  <MenuItem key={leaveType} value={leaveType}>
                    {leaveType}
                  </MenuItem>
                ))}
              </MuiTextField>
            )}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <FormTextField
              label="Start date"
              type="date"
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
              errorMessage={errors.startDate?.message}
              registration={register('startDate', {
                required: 'Choose a start date.',
                validate: (value) =>
                  !value || value >= today || 'Start date cannot be in the past.',
                deps: 'endDate',
              })}
            />
            <FormTextField
              label="End date"
              type="date"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: startDate || today },
              }}
              errorMessage={errors.endDate?.message}
              registration={register('endDate', {
                required: 'Choose an end date.',
                validate: {
                  afterStart: (value) =>
                    !getValues('startDate') ||
                    value >= getValues('startDate') ||
                    'End date must be on or after the start date.',
                  noOverlap: (value) => {
                    const request = {
                      employeeId: getValues('employeeId'),
                      startDate: getValues('startDate'),
                      endDate: value,
                    }
                    return (
                      !request.employeeId ||
                      !request.startDate ||
                      value < request.startDate ||
                      !hasOverlappingLeaveRequest(savedRequests, request) ||
                      'This employee already has a pending or approved leave request for overlapping dates.'
                    )
                  },
                },
              })}
            />
          </Box>

          <FormTextField
            label="Reason"
            multiline
            minRows={3}
            maxRows={6}
            placeholder="Briefly explain the reason for your leave."
            errorMessage={errors.reason?.message}
            registration={register('reason', {
              required: 'Add a reason for your leave.',
              validate: (value) =>
                !value.trim() ||
                value.trim().length >= 10 ||
                'Please provide at least 10 characters of detail.',
              maxLength: {
                value: 500,
                message: 'Keep your reason under 500 characters.',
              },
            })}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="leave-request-form"
          variant="contained"
          startIcon={<Send size={16} />}
          disabled={isSubmitting || Boolean(loadError) || employees.length === 0}
        >
          Submit request
        </Button>
      </DialogActions>
    </Dialog>
  )
}
