import type { ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`${styles.formField} ${className}`.trim()}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      </div>

      <div className={styles.controlWrapper}>
        {children}
      </div>

      {error ? (
        <p className={styles.errorMessage} role="alert" id={id ? `${id}-error` : undefined}>
          <svg
            className={styles.errorIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className={styles.helperText} id={id ? `${id}-helper` : undefined}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
