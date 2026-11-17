import styles from './ApplicationList.module.css';
import { ApplicationCard } from './ApplicationCard';
import type { JobApplication, ApplicationStatus } from '../../types/jobApplication';

interface ApplicationListProps {
  applications: JobApplication[];
  onDeleteApplication: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: ApplicationStatus) => void;
  onViewDetails: (application: JobApplication) => void;
  onResetFilters: () => void;
}

export function ApplicationList({
  applications,
  onDeleteApplication,
  onToggleStatus,
  onViewDetails,
  onResetFilters,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🔍</span>
        <h4 className={styles.emptyTitle}>No Applications Match Your Filters</h4>
        <p className={styles.emptyDescription}>
          We couldn&apos;t find any candidates matching your criteria. Try adjusting your search query, position filter, or work arrangement.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className={styles.clearFiltersBtn}
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardsGrid}>
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onDelete={onDeleteApplication}
            onToggleStatus={onToggleStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
