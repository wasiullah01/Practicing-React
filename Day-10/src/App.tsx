import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import AppShell from './components/AppShell'
import EmployeeDashboard from './components/EmployeeDashboard'
import EmployeeForm from './components/EmployeeForm'
import LeaveRequestForm from './components/LeaveRequestForm'
import LeaveRequestsDialog from './components/LeaveRequestsDialog'
import { getEmployees } from './data/employeeService'
import type { LeaveRequest } from './types/leaveRequest'
import type { Employee } from './types/employee'

type FormMode = { type: 'create' } | { type: 'edit'; employee: Employee } | null

function App() {
  const [employees, setEmployees] = useState<Employee[]>(getEmployees)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [leaveRequestOpen, setLeaveRequestOpen] = useState(false)
  const [leaveReviewOpen, setLeaveReviewOpen] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSaved(savedEmployee: Employee) {
    const previousEmployee = employees.find((employee) => employee.id === savedEmployee.id)
    setEmployees((current) =>
      current.some((employee) => employee.id === savedEmployee.id)
        ? current.map((employee) =>
            employee.id === savedEmployee.id ? savedEmployee : employee,
          )
        : [savedEmployee, ...current],
    )
    setFormMode(null)
    setNotice(
      previousEmployee && previousEmployee.status !== savedEmployee.status
        ? `${savedEmployee.firstName} ${savedEmployee.lastName}'s status is now ${savedEmployee.status}.`
        : `${savedEmployee.firstName} ${savedEmployee.lastName} ${
            formMode?.type === 'edit'
              ? 'has been updated.'
              : 'has been added to the team.'
          }`,
    )
  }

  function openNewEmployeeForm() {
    setFormMode({ type: 'create' })
  }

  return (
    <>
      <AppShell
        employees={employees}
        onNewOnboarding={openNewEmployeeForm}
        onEditEmployee={(employee) => setFormMode({ type: 'edit', employee })}
      >
        <EmployeeDashboard
          employees={employees}
          onAddEmployee={openNewEmployeeForm}
          onEditEmployee={(employee) => setFormMode({ type: 'edit', employee })}
          onRequestLeave={() => setLeaveRequestOpen(true)}
          onReviewLeave={() => setLeaveReviewOpen(true)}
        />
      </AppShell>

      {formMode && (
        <EmployeeForm
          employees={employees}
          employee={formMode.type === 'edit' ? formMode.employee : undefined}
          onClose={() => setFormMode(null)}
          onSaved={handleSaved}
        />
      )}

      {leaveRequestOpen && (
        <LeaveRequestForm
          employees={employees}
          onClose={() => setLeaveRequestOpen(false)}
          onSubmitted={(request: LeaveRequest) => {
            const employee = employees.find((item) => item.id === request.employeeId)
            setLeaveRequestOpen(false)
            setNotice(
              `Leave request submitted for ${employee ? `${employee.firstName} ${employee.lastName}` : 'review'}.`,
            )
          }}
        />
      )}

      {leaveReviewOpen && (
        <LeaveRequestsDialog
          employees={employees}
          onClose={() => setLeaveReviewOpen(false)}
          onStatusChanged={(request) => {
            const employee = employees.find((item) => item.id === request.employeeId)
            const employeeName = employee
              ? `${employee.firstName} ${employee.lastName}`
              : 'Employee'
            setNotice(`${employeeName}'s leave request was ${request.status.toLowerCase()}.`)
          }}
        />
      )}

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotice('')} severity="success" variant="filled">
          {notice}
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
