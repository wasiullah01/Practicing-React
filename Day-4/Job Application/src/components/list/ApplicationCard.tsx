import styles from './ApplicationCard.module.css';
import { Badge, type BadgeVariant } from '../ui/Badge';
import type { JobApplication, ApplicationStatus } from '../../types/jobApplication';

interface ApplicationCardProps {
  application: JobApplication;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: ApplicationStatus) => void;
  onViewDetails: (application: JobApplication) => void;
}

export function ApplicationCard({
  application,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: ApplicationCardProps) {
  const getStatusBadgeVariant = (status: ApplicationStatus): BadgeVariant => {
    switch (status) {
      case 'Offer Extended':
        return 'success';
      case 'Interviewing':
        return 'brand';
      case 'Under Review':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const initials = application.fullName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.candidateMeta}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: application.avatarColor }}
            title={application.fullName}
          >
            {initials}
          </div>
          <div className={styles.info}>
            <h4 className={styles.name}>{application.fullName}</h4>
            <span className={styles.refTag}>Ref: {application.id}</span>
          </div>
        </div>

        <Badge variant={getStatusBadgeVariant(application.status)} withDot>
          {application.status}
        </Badge>
      </div>

      <div>
        <span className={styles.positionBadge}>
          {application.position} &bull; {application.workArrangement}
        </span>
      </div>

      {/* Conditional Experience Summary */}
      <div className={styles.conditionalSummary}>
        {application.experienceType === 'experienced' && application.experiencedDetails ? (
          <>
            <div className={styles.conditionalRow}>
              <span className={styles.conditionalLabel}>
                <span>💼</span> Experience:
              </span>
              <span className={styles.conditionalValue}>
                {application.experiencedDetails.yearsOfExperience} yrs &bull; {application.experiencedDetails.currentJobTitle}
              </span>
            </div>
            <div className={styles.conditionalRow}>
              <span className={styles.conditionalLabel}>
                <span>🏢</span> Employer:
              </span>
              <span className={styles.conditionalValue}>
                {application.experiencedDetails.currentCompany}
              </span>
            </div>
          </>
        ) : application.freshGradDetails ? (
          <>
            <div className={styles.conditionalRow}>
              <span className={styles.conditionalLabel}>
                <span>🎓</span> Institution:
              </span>
              <span className={styles.conditionalValue}>
                {application.freshGradDetails.university}
              </span>
            </div>
            <div className={styles.conditionalRow}>
              <span className={styles.conditionalLabel}>
                <span>📜</span> Major:
              </span>
              <span className={styles.conditionalValue}>
                {application.freshGradDetails.major} ({application.freshGradDetails.gpa ? `GPA: ${application.freshGradDetails.gpa}` : `Class of ${application.freshGradDetails.graduationYear}`})
              </span>
            </div>
          </>
        ) : null}

        {application.visaDetails.requiresSponsorship && (
          <div className={styles.conditionalRow}>
            <span className={styles.conditionalLabel}>
              <span>🛂</span> Visa Status:
            </span>
            <span className="text-amber-800 font-semibold text-xs">
              Sponsorship Required
            </span>
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div className={styles.detailsList}>
        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className={styles.detailText}>{application.email}</span>
        </div>

        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={styles.detailText}>Applied: {application.appliedDate}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => onViewDetails(application)}
          className={styles.viewBtn}
        >
          View Profile &rarr;
        </button>

        <div className={styles.btnGroup}>
          <button
            type="button"
            onClick={() => onToggleStatus(application.id, application.status)}
            className={styles.statusToggleBtn}
          >
            Advance Status
          </button>
          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className={styles.deleteBtn}
            title="Delete Application"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
