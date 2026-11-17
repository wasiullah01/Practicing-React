import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'primary', withDot = false, className = '' }: BadgeProps) {
  const variantClass = styles[variant] || styles.primary;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`.trim()}>
      {withDot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
