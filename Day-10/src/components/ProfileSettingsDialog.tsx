import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import type { UserProfile } from '../data/settingsService'

interface ProfileSettingsDialogProps {
  open: boolean
  profile: UserProfile
  error?: string
  onClose: () => void
  onSave: (profile: UserProfile) => void
}

export default function ProfileSettingsDialog({
  open,
  profile,
  error,
  onClose,
  onSave,
}: ProfileSettingsDialogProps) {
  const [values, setValues] = useState(profile)
  const [validationError, setValidationError] = useState('')

  function updateField(field: keyof UserProfile, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      !values.firstName.trim() ||
      !values.lastName.trim() ||
      !values.jobTitle.trim() ||
      !values.email.trim()
    ) {
      setValidationError('Complete all profile fields before saving.')
      return
    }

    onSave({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      jobTitle: values.jobTitle.trim(),
      email: values.email.trim(),
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Profile settings</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="profile-settings-form"
          onSubmit={submit}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            pt: 1,
          }}
        >
          <TextField
            required
            label="First name"
            value={values.firstName}
            onChange={(event) => {
              updateField('firstName', event.target.value)
              setValidationError('')
            }}
          />
          <TextField
            required
            label="Last name"
            value={values.lastName}
            onChange={(event) => {
              updateField('lastName', event.target.value)
              setValidationError('')
            }}
          />
          <TextField
            required
            label="Job title"
            value={values.jobTitle}
            onChange={(event) => {
              updateField('jobTitle', event.target.value)
              setValidationError('')
            }}
          />
          <TextField
            required
            type="email"
            label="Email"
            value={values.email}
            onChange={(event) => {
              updateField('email', event.target.value)
              setValidationError('')
            }}
          />
          {(error || validationError) && (
            <Alert severity="error" sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
              {error || validationError}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="profile-settings-form" variant="contained">
          Save profile
        </Button>
      </DialogActions>
    </Dialog>
  )
}
