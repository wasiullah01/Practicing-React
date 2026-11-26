import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

interface HelpDialogProps {
  open: boolean
  onClose: () => void
}

const helpTopics = [
  {
    title: 'Add a team member',
    description:
      'Choose New onboarding or Add employee, then complete the three steps. Work emails are checked for duplicates.',
  },
  {
    title: 'Edit an employee',
    description: 'Use the Edit button in the employee directory to update a profile.',
  },
  {
    title: 'Find employees',
    description:
      'Search by name, email, role, or department, and use the status filter to narrow the list.',
  },
  {
    title: 'Where is data stored?',
    description:
      'This demo saves employee, workspace, and profile information in this browser only. It is not connected to a server.',
  },
]

export default function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Help & support</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          Quick answers for the Peopleflow demo.
        </Typography>
        <List disablePadding sx={{ mt: 1 }}>
          {helpTopics.map((topic) => (
            <ListItem key={topic.title} alignItems="flex-start" disableGutters>
              <ListItemText
                primary={topic.title}
                secondary={topic.description}
                slotProps={{
                  primary: { sx: { fontWeight: 700, color: 'text.primary' } },
                  secondary: { sx: { mt: 0.25, lineHeight: 1.5 } },
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">Got it</Button>
      </DialogActions>
    </Dialog>
  )
}
