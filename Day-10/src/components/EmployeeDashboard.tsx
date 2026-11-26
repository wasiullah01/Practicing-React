import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  ArrowDownUp,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarPlus,
  ClipboardCheck,
  Clock3,
  Plus,
  Search,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react'
import EmployeeStatCard from './EmployeeStatCard'
import EmployeeTableRow from './EmployeeTableRow'
import type { Employee } from '../types/employee'

type EmployeeFilter = 'All employees' | 'Active' | 'Onboarding'

interface EmployeeDashboardProps {
  employees: Employee[]
  onAddEmployee: () => void
  onEditEmployee: (employee: Employee) => void
  onRequestLeave: () => void
  onReviewLeave: () => void
}

export default function EmployeeDashboard({
  employees,
  onAddEmployee,
  onEditEmployee,
  onRequestLeave,
  onReviewLeave,
}: EmployeeDashboardProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<EmployeeFilter>('All employees')
  const [todayLabel] = useState(() =>
    new Intl.DateTimeFormat('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date()),
  )

  const visibleEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()

    return employees.filter((employee) => {
      const matchesFilter = filter === 'All employees' || employee.status === filter
      const searchable = [
        employee.firstName,
        employee.lastName,
        employee.workEmail,
        employee.jobTitle,
        employee.department,
      ]
        .join(' ')
        .toLowerCase()

      return matchesFilter && (!query || searchable.includes(query))
    })
  }, [employees, filter, search])

  const activeCount = employees.filter((employee) => employee.status === 'Active').length
  const onboardingCount = employees.filter(
    (employee) => employee.status === 'Onboarding',
  ).length
  const departmentCount = new Set(employees.map((employee) => employee.department)).size

  return (
    <Box
      component="main"
      id="overview"
      sx={{ mx: 'auto', maxWidth: 1440, px: { xs: 2.5, sm: 4 }, py: { xs: 3.5, sm: 4.5 } }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2.5}
        sx={{
          mb: 3.5,
          alignItems: { xs: 'stretch', sm: 'flex-end' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="overline"
            color="primary.main"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
            }}
          >
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
            {todayLabel}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 750, letterSpacing: '-0.04em' }}>
            People overview
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            A snapshot of your team and everything people-related.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ClipboardCheck size={17} />}
            onClick={onReviewLeave}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, px: 2, py: 1.1 }}
          >
            Review leave
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalendarPlus size={17} />}
            onClick={onRequestLeave}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, px: 2, py: 1.1 }}
          >
            Request leave
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={17} />}
            onClick={onAddEmployee}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, px: 2, py: 1.1 }}
          >
            Add employee
          </Button>
        </Stack>
      </Stack>

      <Box
        component="section"
        aria-label="Employee statistics"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <EmployeeStatCard
          label="Total employees"
          value={employees.length}
          detail="Across all departments"
          icon={<UsersRound size={19} />}
          iconColor="#4f46e5"
          iconBackground="#eef2ff"
        />
        <EmployeeStatCard
          label="Active"
          value={activeCount}
          detail="Currently on the team"
          icon={<BriefcaseBusiness size={19} />}
          iconColor="#059669"
          iconBackground="#ecfdf5"
        />
        <EmployeeStatCard
          label="Onboarding"
          value={onboardingCount}
          detail="Getting started with the team"
          icon={<UserRoundPlus size={19} />}
          iconColor="#d97706"
          iconBackground="#fffbeb"
        />
        <EmployeeStatCard
          label="Departments"
          value={departmentCount}
          detail="With people on the roster"
          icon={<Building2 size={19} />}
          iconColor="#0284c7"
          iconBackground="#f0f9ff"
        />
      </Box>

      <Paper
        component="section"
        variant="outlined"
        sx={{ mt: 3.5, overflow: 'hidden', borderColor: 'grey.200' }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            px: { xs: 2.5, sm: 3 },
            py: 2.5,
            borderBottom: 1,
            borderColor: 'grey.100',
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700 }}>
                Employee directory
              </Typography>
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 10,
                  bgcolor: 'grey.100',
                  color: 'text.secondary',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {employees.length}
              </Box>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Manage employee profiles and onboarding details.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search people..."
              sx={{ width: { sm: 250 } }}
              slotProps={{
                htmlInput: { 'aria-label': 'Search employees' },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#64748b" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              value={filter}
              onChange={(event) => setFilter(event.target.value as EmployeeFilter)}
              sx={{ minWidth: { sm: 160 } }}
              slotProps={{
                htmlInput: { 'aria-label': 'Filter by employee status' },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ArrowDownUp size={18} color="#64748b" />
                    </InputAdornment>
                  ),
                },
              }}
            >
              <MenuItem value="All employees">All employees</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Onboarding">Onboarding</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                {['Employee', 'Role', 'Start date', 'Status', 'Action'].map((heading) => (
                  <TableCell
                    key={heading}
                    align={heading === 'Action' ? 'right' : 'left'}
                    sx={{
                      py: 1.25,
                      color: 'text.secondary',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleEmployees.map((employee) => (
                <EmployeeTableRow
                  key={employee.id}
                  employee={employee}
                  onEdit={() => onEditEmployee(employee)}
                />
              ))}
            </TableBody>
          </Table>
          {visibleEmployees.length === 0 && (
            <Stack
              spacing={1}
              sx={{ py: 7, px: 3, textAlign: 'center', alignItems: 'center' }}
            >
              <Search size={19} color="#64748b" />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                No employees found
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Try another name, role, or status filter.
              </Typography>
            </Stack>
          )}
        </TableContainer>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            px: { xs: 2.5, sm: 3 },
            py: 1.5,
            borderTop: 1,
            borderColor: 'grey.100',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing <strong>{visibleEmployees.length}</strong> of <strong>{employees.length}</strong> employees
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <CalendarDays size={15} color="#64748b" />
            <Typography variant="caption" color="text.secondary">Updated just now</Typography>
          </Stack>
        </Stack>
      </Paper>

      <Stack
        direction="row"
        spacing={0.75}
        sx={{ mt: 2.5, justifyContent: 'center', alignItems: 'center' }}
      >
        <Clock3 size={15} color="#94a3b8" />
        <Typography variant="caption" color="text.disabled">
          Demo workspace · Employee data is saved in this browser
        </Typography>
      </Stack>
    </Box>
  )
}
