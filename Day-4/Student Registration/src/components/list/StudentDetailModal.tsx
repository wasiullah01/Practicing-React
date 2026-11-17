import React from 'react';
import styles from './StudentDetailModal.module.css';
import { Modal } from '../ui/Modal';
import { Badge, BadgeVariant } from '../ui/Badge';
import { Student, StudentStatus } from '../../types/student';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onToggleStatus: (id: string, currentStatus: StudentStatus) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentDetailModal({
  student,
  onClose,
  onToggleStatus,
  onDeleteStudent,
}: StudentDetailModalProps) {
  if (!student) return null;

  const getStatusVariant = (status: StudentStatus): BadgeVariant => {
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

  const handleToggle = () => {
    onToggleStatus(student.id, student.status);
    onClose();
  };

  const handleDelete = () => {
    onDeleteStudent(student.id);
    onClose();
  };

  return (
    <Modal
      isOpen={!!student}
      onClose={onClose}
      title="Student Academic Dossier"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition"
          >
            🗑 Delete Student
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition"
            >
              Toggle Status ({student.status})
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      }
    >
      <div className={styles.detailModal}>
        <div className={styles.headerRow}>
          <div className={styles.avatar} style={{ backgroundColor: student.avatarColor }}>
            {initials}
          </div>
          <div className={styles.nameBlock}>
            <h3 className={styles.fullName}>{student.fullName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusVariant(student.status)} withDot>
                {student.status}
              </Badge>
              <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Key: {student.id}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Academic Program</span>
            <span className={styles.infoValue}>{student.course}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Semester Standing</span>
            <span className={styles.infoValue}>{student.semester}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email Contact</span>
            <span className={styles.infoValue}>{student.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phone Number</span>
            <span className={styles.infoValue}>{student.phone}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Date of Birth</span>
            <span className={styles.infoValue}>{student.dateOfBirth}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Gender Identity</span>
            <span className={styles.infoValue}>{student.gender}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Registration Date</span>
            <span className={styles.infoValue}>{student.registeredAt}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>System Identification</span>
            <span className={styles.infoValue}>{student.id}</span>
          </div>
        </div>

        {/* Uncontrolled input data demonstration */}
        <div className={styles.uncontrolledNotesBox}>
          <div className="flex items-center justify-between">
            <span className={styles.uncontrolledBadge}>
              📝 Counselor Notes (Captured via Uncontrolled Component ref)
            </span>
          </div>
          <p className={styles.notesContent}>
            &ldquo;{student.notes || 'No counselor notes submitted during registration.'}&rdquo;
          </p>
        </div>
      </div>
    </Modal>
  );
}
