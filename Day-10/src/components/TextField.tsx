import MuiTextField from '@mui/material/TextField'
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface TextFieldProps
  extends Omit<
    MuiTextFieldProps,
    'error' | 'helperText' | 'inputRef' | 'label' | 'name' | 'onBlur' | 'onChange'
  > {
  label: string
  errorMessage?: string
  hint?: string
  registration?: UseFormRegisterReturn
}

export default function TextField({
  label,
  errorMessage,
  hint,
  registration,
  ...props
}: TextFieldProps) {
  return (
    <MuiTextField
      {...props}
      label={label}
      error={Boolean(errorMessage)}
      helperText={errorMessage ?? hint}
      inputRef={registration?.ref}
      name={registration?.name}
      onBlur={registration?.onBlur}
      onChange={registration?.onChange}
    />
  )
}
