import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'brand', withDot = false, className = '' }: BadgeProps) {
  const variantClass = styles[variant] || styles.brand;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`.trim()}>
      {withDot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
