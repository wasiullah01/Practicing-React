import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outline';
}

interface CardHeaderProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantClass = variant === 'elevated'
    ? styles.variantElevated
    : variant === 'outline'
      ? styles.variantOutline
      : '';

  return (
    <div className={`${styles.card} ${variantClass} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardHeader({ children, title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`${styles.header} ${className}`.trim()}>
      {title || subtitle ? (
        <div className={styles.headerContent}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      ) : (
        children
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`${styles.body} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`${styles.footer} ${className}`.trim()}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
