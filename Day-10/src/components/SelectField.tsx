import MuiTextField from '@mui/material/TextField'
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import type { ReactNode } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'
import type { EmployeeInput } from '../types/employee'

type SelectRegistration = ControllerRenderProps<
  EmployeeInput,
  'department' | 'employmentType' | 'manager'
>

interface SelectFieldProps
  extends Omit<
    MuiTextFieldProps,
    | 'children'
    | 'error'
    | 'helperText'
    | 'inputRef'
    | 'label'
    | 'name'
    | 'onBlur'
    | 'onChange'
    | 'select'
  > {
  label: string
  errorMessage?: string
  registration: SelectRegistration
  children: ReactNode
}

export default function SelectField({
  label,
  errorMessage,
  registration,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <MuiTextField
      {...props}
      select
      label={label}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      inputRef={registration?.ref}
      name={registration?.name}
      value={registration.value}
      onBlur={registration?.onBlur}
      onChange={registration?.onChange}
    >
      {children}
    </MuiTextField>
  )
}
