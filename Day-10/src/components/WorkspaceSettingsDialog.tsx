import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

interface WorkspaceSettingsDialogProps {
  open: boolean
  name: string
  error?: string
  onClose: () => void
  onSave: (name: string) => void
}

export default function WorkspaceSettingsDialog({
  open,
  name,
  error,
  onClose,
  onSave,
}: WorkspaceSettingsDialogProps) {
  const [workspaceName, setWorkspaceName] = useState(name)
  const [validationError, setValidationError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = workspaceName.trim()
    if (!trimmedName) {
      setValidationError('Workspace name is required.')
      return
    }

    onSave(trimmedName)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Workspace settings</DialogTitle>
      <DialogContent>
        <form id="workspace-settings-form" onSubmit={submit}>
          <TextField
            autoFocus
            required
            fullWidth
            label="Workspace name"
            value={workspaceName}
            onChange={(event) => {
              setWorkspaceName(event.target.value)
              setValidationError('')
            }}
            error={Boolean(validationError)}
            helperText={validationError}
            sx={{ mt: 1 }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="workspace-settings-form" variant="contained">
          Save workspace
        </Button>
      </DialogActions>
    </Dialog>
  )
}
