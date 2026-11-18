import styles from './Card.module.css';

/**
 * Card Component - Demonstrating Component Composition (Compound Components)
 */
export function Card({ children, className = '', variant = 'default' }) {
  const variantClass = styles[variant] || '';
  return <div className={`${styles.card} ${variantClass} ${className}`}>{children}</div>;
}

Card.Header = function CardHeader({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`${styles.header} ${className}`}>
      <div>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
};

export default Card;
