import styles from './Header.module.css';

interface HeaderProps {
  applicantCount: number;
}

export function Header({ applicantCount }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.title}>CareerPulse &bull; Talent Acquisition</h1>
            <p className={styles.subtitle}>Enterprise Careers &amp; Candidate Pipeline Portal</p>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.statusPill}>
            <span className={styles.statusPillDot} />
            <span>Hiring Active</span>
          </div>

          <div className={styles.countBadge}>
            <span>Pipeline: <strong>{applicantCount}</strong> Candidates</span>
          </div>
        </div>
      </div>
    </header>
  );
}
