import styles from './StudentStats.module.css';
import type { Student } from '../../types/student';

interface StudentStatsProps {
  students: Student[];
  onSelectStatusFilter: (status: string) => void;
}

export function StudentStats({ students, onSelectStatusFilter }: StudentStatsProps) {
  const total = students.length;
  const active = students.filter((s) => s.status === 'Active').length;
  const pending = students.filter((s) => s.status === 'Pending').length;
  const uniqueCourses = new Set(students.map((s) => s.course)).size;

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard} onClick={() => onSelectStatusFilter('all')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.totalIcon}`}>
          🎓
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{total}</span>
          <span className={styles.statLabel}>Total Registered</span>
        </div>
      </div>

      <div className={styles.statCard} onClick={() => onSelectStatusFilter('Active')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.activeIcon}`}>
          ✅
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{active}</span>
          <span className={styles.statLabel}>Active Students</span>
        </div>
      </div>

      <div className={styles.statCard} onClick={() => onSelectStatusFilter('Pending')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.pendingIcon}`}>
          ⏳
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{pending}</span>
          <span className={styles.statLabel}>Pending Verification</span>
        </div>
      </div>

      <div className={styles.statCard} onClick={() => onSelectStatusFilter('all')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.courseIcon}`}>
          📚
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{uniqueCourses}</span>
          <span className={styles.statLabel}>Active Departments</span>
        </div>
      </div>
    </div>
  );
}
