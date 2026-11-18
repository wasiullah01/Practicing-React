import styles from './Card.module.css';

/**
 * Card Component - Demonstrates Component Composition.
 * 
 * Instead of rigid props (e.g. title="...", subtitle="...", buttonText="..."),
 * we use Component Composition with `children` and compound components:
 * - <Card>
 *   - <Card.Header>
 *   - <Card.Body>
 *   - <Card.Footer>
 * 
 * This gives parent components complete flexibility over what is rendered inside!
 */
export function Card({ children, className = '', variant = 'default' }) {
  const variantClass = styles[variant] || '';
  return (
    <div className={`${styles.card} ${variantClass} ${className}`}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ title, subtitle, badge, action, children, className = '' }) {
  return (
    <div className={`${styles.header} ${className}`}>
      <div className={styles.headerTitles}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
      <div className={styles.headerActions}>
        {badge && <span className={styles.badge}>{badge}</span>}
        {action}
      </div>
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
