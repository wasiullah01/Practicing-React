import styles from './ApplicationStats.module.css';
import type { JobApplication } from '../../types/jobApplication';

interface ApplicationStatsProps {
  applications: JobApplication[];
  onSelectStatusFilter: (status: string) => void;
  onSelectWorkFilter: (work: string) => void;
}

export function ApplicationStats({
  applications,
  onSelectStatusFilter,
  onSelectWorkFilter,
}: ApplicationStatsProps) {
  const total = applications.length;
  const interviewing = applications.filter((a) => a.status === 'Interviewing').length;
  const offers = applications.filter((a) => a.status === 'Offer Extended').length;
  const remote = applications.filter((a) => a.workArrangement === 'Remote').length;

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard} onClick={() => onSelectStatusFilter('all')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.totalIcon}`}>
          💼
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{total}</span>
          <span className={styles.statLabel}>Total Applications</span>
        </div>
      </div>

      <div className={styles.statCard} onClick={() => onSelectStatusFilter('Interviewing')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.interviewIcon}`}>
          💬
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{interviewing}</span>
          <span className={styles.statLabel}>In Interviews</span>
        </div>
      </div>

      <div className={styles.statCard} onClick={() => onSelectStatusFilter('Offer Extended')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.offerIcon}`}>
          🎉
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{offers}</span>
          <span className={styles.statLabel}>Offers Extended</span>
        </div>
      </div>

      <div className={styles.statCard} onClick={() => onSelectWorkFilter('Remote')} role="button" tabIndex={0}>
        <div className={`${styles.iconWrapper} ${styles.remoteIcon}`}>
          🌐
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{remote}</span>
          <span className={styles.statLabel}>Remote Applicants</span>
        </div>
      </div>
    </div>
  );
}
