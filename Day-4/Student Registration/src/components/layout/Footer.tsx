import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          &copy; 2026 Student Registration System &bull; Built with React 19, TypeScript, CSS Modules &amp; Tailwind CSS
        </p>
        <div className={styles.tags}>
          <span className={styles.conceptPill}>Rendering Lists</span>
          <span className={styles.conceptPill}>Keys &amp; Reconciliation</span>
          <span className={styles.conceptPill}>Controlled &amp; Uncontrolled</span>
          <span className={styles.conceptPill}>Lifting State Up</span>
          <span className={styles.conceptPill}>Component Composition</span>
        </div>
      </div>
    </footer>
  );
}
