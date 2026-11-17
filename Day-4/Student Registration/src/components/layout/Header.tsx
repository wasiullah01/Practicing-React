import styles from './Header.module.css';

interface HeaderProps {
  onOpenConcepts: () => void;
  studentCount: number;
}

export function Header({ onOpenConcepts, studentCount }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.title}>EduPortal &bull; Student Registration</h1>
            <p className={styles.subtitle}>React Day 4: Forms, Reconciliation, Lifting State &amp; Composition</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.badgeBtn}
            onClick={onOpenConcepts}
            title="View React Learning Objectives & Concepts"
          >
            <span>💡</span>
            <span>Learning Objectives</span>
          </button>
          
          <div className={styles.primaryBtn}>
            <span>Enrolled: <strong>{studentCount}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
