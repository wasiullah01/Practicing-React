import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { EmployeeListItem } from '../types/employee'

interface EmployeeTableRowProps {
  employee: EmployeeListItem
  onEdit: () => void
}

const departmentColors: Record<string, { background: string; color: string }> = {
  Design: { background: '#fdf2f8', color: '#a21caf' },
  Engineering: { background: '#f0f9ff', color: '#0369a1' },
  Finance: { background: '#fffbeb', color: '#b45309' },
  Marketing: { background: '#fff7ed', color: '#c2410c' },
  Operations: { background: '#f5f3ff', color: '#6d28d9' },
  People: { background: '#ecfdf5', color: '#047857' },
  Product: { background: '#eef2ff', color: '#4338ca' },
  Sales: { background: '#fff1f2', color: '#be123c' },
}

function getInitials(employee: Pick<EmployeeListItem, 'firstName' | 'lastName'>) {
  return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase()
}

function formatStartDate(date: string) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export default function EmployeeTableRow({ employee, onEdit }: EmployeeTableRowProps) {
  const departmentStyle = departmentColors[employee.department] ?? {
    background: '#f1f5f9',
    color: '#475569',
  }
  const isActive = employee.status === 'Active'

  return (
    <TableRow hover>
      <TableCell sx={{ py: 1.75, minWidth: 230 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#eef2ff',
              color: '#4338ca',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {getInitials(employee)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 650 }}>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {employee.workEmail}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
          {employee.jobTitle}
        </Typography>
        <Chip
          label={employee.department}
          size="small"
          sx={{
            mt: 0.75,
            height: 21,
            bgcolor: departmentStyle.background,
            color: departmentStyle.color,
            fontSize: 11,
            fontWeight: 600,
          }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
        {formatStartDate(employee.startDate)}
      </TableCell>
      <TableCell>
        <Chip
          label={employee.status}
          size="small"
          color={isActive ? 'success' : 'warning'}
          variant="outlined"
          sx={{ fontWeight: 600, bgcolor: isActive ? '#f0fdf4' : '#fffbeb' }}
        />
      </TableCell>
      <TableCell align="right">
        <Button size="small" variant="outlined" onClick={onEdit}>
          Edit
        </Button>
      </TableCell>
    </TableRow>
  )
}
