import { useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import MuiTextField from '@mui/material/TextField'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import SelectField from './SelectField'
import TextField from './TextField'
import {
  EmployeeServiceError,
  isWorkEmailAvailable,
  saveEmployee,
} from '../data/employeeService'
import type {
  Employee,
  EmployeeInput,
  EmployeeStatus,
  EmploymentType,
} from '../types/employee'

interface EmployeeFormProps {
  employees: Employee[]
  employee?: Employee
  onClose: () => void
  onSaved: (employee: Employee) => void
}

const departments = [
  'Design',
  'Engineering',
  'Finance',
  'Marketing',
  'Operations',
  'People',
  'Product',
  'Sales',
]

const employmentTypes: EmploymentType[] = ['Full-time', 'Part-time', 'Contract']
const employeeStatuses: EmployeeStatus[] = ['Active', 'Onboarding']

const emptyValues: EmployeeInput = {
  firstName: '',
  lastName: '',
  workEmail: '',
  phone: '',
  department: '',
  jobTitle: '',
  employmentType: 'Full-time',
  startDate: '',
  manager: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  workHistory: [{ company: '', position: '', years: '' }],
}

const steps = [
  { title: 'Personal details', description: 'The basics' },
  { title: 'Role & team', description: 'Where they fit' },
  { title: 'Additional info', description: 'A few more details' },
]

const fieldGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 2,
}

export default function EmployeeForm({
  employees,
  employee,
  onClose,
  onSaved,
}: EmployeeFormProps) {
  const isEditing = Boolean(employee)
  const [activeStep, setActiveStep] = useState(0)
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus>(
    employee?.status ?? 'Onboarding',
  )
  const {
    register,
    control,
    getValues,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeInput>({
    defaultValues: employee ?? emptyValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'workHistory' })

  const managerNames = Array.from(
    new Set([
      ...employees.map((item) => `${item.firstName} ${item.lastName}`),
      ...employees.map((item) => item.manager),
    ]),
  )

  const emailRules = {
    required: 'Work email is required.',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email address.',
    },
    validate: async (value: string) =>
      (await isWorkEmailAvailable(value, employees, employee?.id)) ||
      'This email is already assigned to an employee.',
  }

  const stepsFields: (keyof EmployeeInput)[][] = [
    ['firstName', 'lastName', 'workEmail', 'phone'],
    ['department', 'jobTitle', 'employmentType', 'startDate', 'manager'],
    ['emergencyContactName', 'emergencyContactPhone', 'workHistory'],
  ]

  async function goToNextStep() {
    const valid = await trigger(stepsFields[activeStep], { shouldFocus: true })
    if (valid) setActiveStep((current) => Math.min(current + 1, steps.length - 1))
  }

  async function submit(values: EmployeeInput) {
    try {
      const savedEmployee = await saveEmployee(
        values,
        employee?.id,
        isEditing ? employeeStatus : undefined,
      )
      onSaved(savedEmployee)
    } catch (error) {
      if (error instanceof EmployeeServiceError) {
        setError('root.server', { type: 'server', message: error.message })
        if (error.fieldErrors.workEmail) {
          setError('workEmail', {
            type: 'server',
            message: error.fieldErrors.workEmail,
          })
        }
        return
      }

      setError('root.server', {
        type: 'server',
        message: 'We could not save this employee. Please try again.',
      })
    }
  }

  function renderPersonalFields() {
    return (
      <Box component="section">
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>
          Personal details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
          Add the employee&apos;s name and contact information.
        </Typography>
        <Box sx={fieldGridSx}>
          <TextField
            label="First name"
            autoComplete="given-name"
            placeholder="e.g. Jamie"
            errorMessage={errors.firstName?.message}
            registration={register('firstName', {
              required: 'First name is required.',
              minLength: { value: 2, message: 'Enter at least 2 characters.' },
            })}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            placeholder="e.g. Rivera"
            errorMessage={errors.lastName?.message}
            registration={register('lastName', {
              required: 'Last name is required.',
              minLength: { value: 2, message: 'Enter at least 2 characters.' },
            })}
          />
          <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
            <TextField
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              hint="We’ll check that this email hasn’t been used before."
              errorMessage={errors.workEmail?.message}
              registration={register('workEmail', emailRules)}
            />
          </Box>
          <TextField
            label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            errorMessage={errors.phone?.message}
            registration={register('phone', {
              required: 'Phone number is required.',
              validate: (value) =>
                /^[+]?[\d\s().-]{7,20}$/.test(value) || 'Enter a valid phone number.',
            })}
          />
        </Box>
      </Box>
    )
  }

  function renderRoleFields() {
    return (
      <Box component="section">
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>
          Role & team
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
          Set up their position and first day.
        </Typography>
        <Box sx={fieldGridSx}>
          <TextField
            label="Job title"
            placeholder="e.g. Product Designer"
            errorMessage={errors.jobTitle?.message}
            registration={register('jobTitle', { required: 'Job title is required.' })}
          />
          <Controller
            name="department"
            control={control}
            rules={{ required: 'Choose a department.' }}
            render={({ field }) => (
              <SelectField
                label="Department"
                errorMessage={errors.department?.message}
                registration={field}
              >
                <MenuItem value="">Select department</MenuItem>
                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </SelectField>
            )}
          />
          <Controller
            name="employmentType"
            control={control}
            rules={{ required: 'Choose an employment type.' }}
            render={({ field }) => (
              <SelectField
                label="Employment type"
                errorMessage={errors.employmentType?.message}
                registration={field}
              >
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </SelectField>
            )}
          />
          <TextField
            label="Start date"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            errorMessage={errors.startDate?.message}
            registration={register('startDate', { required: 'Start date is required.' })}
          />
          {isEditing && (
            <MuiTextField
              select
              label="Employee status"
              value={employeeStatus}
              onChange={(event) => {
                const nextStatus = employeeStatuses.find(
                  (status) => status === event.target.value,
                )
                if (nextStatus) setEmployeeStatus(nextStatus)
              }}
            >
              {employeeStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </MuiTextField>
          )}
          <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
            <Controller
              name="manager"
              control={control}
              rules={{ required: 'Choose a manager.' }}
              render={({ field }) => (
                <SelectField
                  label="Manager"
                  errorMessage={errors.manager?.message}
                  registration={field}
                >
                  <MenuItem value="">Select manager</MenuItem>
                  {managerNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </SelectField>
              )}
            />
          </Box>
        </Box>
      </Box>
    )
  }

  function renderAdditionalFields() {
    return (
      <Box component="section">
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>
          Additional information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
          These details are optional and can be updated later.
        </Typography>

        <Box sx={{ ...fieldGridSx, mb: 3.5 }}>
          <TextField
            label="Emergency contact name"
            placeholder="Contact’s full name"
            errorMessage={errors.emergencyContactName?.message}
            registration={register('emergencyContactName', {
              validate: (value) =>
                !getValues('emergencyContactPhone') ||
                Boolean(value.trim()) ||
                'Add a contact name or leave both fields blank.',
            })}
          />
          <TextField
            label="Emergency contact phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            errorMessage={errors.emergencyContactPhone?.message}
            registration={register('emergencyContactPhone', {
              validate: (value) => {
                if (!value && !getValues('emergencyContactName')) return true
                if (!value) return 'Add a phone number for this contact.'
                return (
                  /^[+]?[\d\s().-]{7,20}$/.test(value) || 'Enter a valid phone number.'
                )
              },
            })}
          />
        </Box>

        <Divider sx={{ mb: 2.5 }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            mb: 2,
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Previous experience
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add relevant roles, or leave this section blank.
            </Typography>
          </Box>
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => append({ company: '', position: '', years: '' })}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
          >
            Add role
          </Button>
        </Stack>

        <Stack spacing={1.5}>
          {fields.map((field, index) => (
            <Paper
              key={field.id}
              variant="outlined"
              sx={{ p: 2, bgcolor: 'grey.50', borderColor: 'grey.200' }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ alignItems: { sm: 'flex-start' } }}
              >
                <TextField
                  label="Company"
                  placeholder="Company name"
                  errorMessage={errors.workHistory?.[index]?.company?.message}
                  registration={register(`workHistory.${index}.company`, {
                    required: 'Company is required.',
                  })}
                />
                <TextField
                  label="Job title"
                  placeholder="Role"
                  errorMessage={errors.workHistory?.[index]?.position?.message}
                  registration={register(`workHistory.${index}.position`, {
                    required: 'Job title is required.',
                  })}
                />
                <TextField
                  label="Years"
                  placeholder="e.g. 2"
                  errorMessage={errors.workHistory?.[index]?.years?.message}
                  registration={register(`workHistory.${index}.years`, {
                    pattern: {
                      value: /^\d{1,2}$/,
                      message: 'Enter a number from 0 to 99.',
                    },
                  })}
                />
                <IconButton
                  type="button"
                  aria-label={`Remove previous role ${index + 1}`}
                  onClick={() => remove(index)}
                  color="error"
                  sx={{ mt: { sm: 2.5 } }}
                >
                  <Trash2 size={19} />
                </IconButton>
              </Stack>
            </Paper>
          ))}
          {fields.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No previous roles added.
            </Typography>
          )}
        </Stack>
      </Box>
    )
  }

  const currentStep = steps[activeStep]

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { maxHeight: '94vh' } } }}
    >
      <DialogTitle sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2.5 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Box>
            <Stack direction="row" spacing={0.75} sx={{ mb: 0.5, alignItems: 'center' }}>
            <BriefcaseBusiness size={16} color="#5146e5" />
              <Typography
                variant="overline"
                color="primary.main"
                sx={{ fontWeight: 700, letterSpacing: '0.12em' }}
              >
                {isEditing ? 'Employee profile' : 'New hire'}
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
              {isEditing ? 'Edit employee' : 'Add a new employee'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isEditing
                ? 'Update their details and save your changes.'
                : 'Let’s get your new team member set up.'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close form" size="small">
            <X size={19} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {!isEditing && (
        <Box sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography variant="caption" color="text.secondary">
            Step {activeStep + 1} of {steps.length}
            {currentStep ? ` · ${currentStep.description}` : ''}
          </Typography>
        </Box>
      )}

      <Divider />
      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3 }}>
        <Box component="form" id="employee-form" onSubmit={handleSubmit(submit)} noValidate>
          <Stack spacing={4}>
            {isEditing ? (
              <>
                {renderPersonalFields()}
                {renderRoleFields()}
                {renderAdditionalFields()}
              </>
            ) : activeStep === 0 ? (
              renderPersonalFields()
            ) : activeStep === 1 ? (
              renderRoleFields()
            ) : (
              renderAdditionalFields()
            )}
            {errors.root?.server?.message && (
              <Alert severity="error">{errors.root.server.message}</Alert>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ justifyContent: 'space-between', px: { xs: 2.5, sm: 3.5 }, py: 2 }}>
        {!isEditing && activeStep > 0 ? (
          <Button
            type="button"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => setActiveStep((current) => Math.max(current - 1, 0))}
            color="inherit"
          >
            Back
          </Button>
        ) : (
          <Button type="button" onClick={onClose} color="inherit">
            Cancel
          </Button>
        )}

        {!isEditing && activeStep < steps.length - 1 ? (
          <Button
            type="button"
            variant="contained"
            endIcon={<ArrowRight size={16} />}
            onClick={goToNextStep}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            form="employee-form"
            variant="contained"
            startIcon={<Check size={16} />}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving…'
              : isEditing
                ? 'Save changes'
                : 'Complete onboarding'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
