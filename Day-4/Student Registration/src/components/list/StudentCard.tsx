import React from 'react';
import styles from './StudentCard.module.css';
import { Badge, BadgeVariant } from '../ui/Badge';
import { Student, StudentStatus } from '../../types/student';

interface StudentCardProps {
  student: Student;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: StudentStatus) => void;
  onViewDetails: (student: Student) => void;
}

export function StudentCard({
  student,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: StudentCardProps) {
  const getStatusBadgeVariant = (status: StudentStatus): BadgeVariant => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Inactive':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const initials = student.fullName
    .split(' ')
    .filter(Boolean)
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.studentMeta}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: student.avatarColor }}
            title={student.fullName}
          >
            {initials}
          </div>
          <div className={styles.info}>
            <h4 className={styles.name}>{student.fullName}</h4>
            {/* Visual Callout for Key Demonstration */}
            <span className={styles.idKeyTag} title="Unique React reconciliation key">
              🔑 key=&quot;{student.id}&quot;
            </span>
          </div>
        </div>

        <Badge variant={getStatusBadgeVariant(student.status)} withDot>
          {student.status}
        </Badge>
      </div>

      <div>
        <span className={styles.courseBadge}>
          {student.course} &bull; {student.semester}
        </span>
      </div>

      <div className={styles.detailsList}>
        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className={styles.detailText}>{student.email}</span>
        </div>

        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className={styles.detailText}>{student.phone}</span>
        </div>

        <div className={styles.detailItem}>
          <svg className={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={styles.detailText}>Reg: {student.registeredAt}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => onViewDetails(student)}
          className={styles.viewBtn}
        >
          View Profile &rarr;
        </button>

        <div className={styles.btnGroup}>
          <button
            type="button"
            onClick={() => onToggleStatus(student.id, student.status)}
            className={styles.statusToggleBtn}
            title="Toggle status to demonstrate targeted reconciliation"
          >
            Toggle Status
          </button>
          <button
            type="button"
            onClick={() => onDelete(student.id)}
            className={styles.deleteBtn}
            title="Delete this record"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
