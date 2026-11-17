import React from 'react';
import styles from './StudentList.module.css';
import { StudentCard } from './StudentCard';
import { Student, StudentStatus } from '../../types/student';

interface StudentListProps {
  students: Student[];
  onDeleteStudent: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: StudentStatus) => void;
  onViewDetails: (student: Student) => void;
  onResetFilters: () => void;
}

export function StudentList({
  students,
  onDeleteStudent,
  onToggleStatus,
  onViewDetails,
  onResetFilters,
}: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🔍</span>
        <h4 className={styles.emptyTitle}>No Students Found</h4>
        <p className={styles.emptyDescription}>
          No student records match your current search criteria or department filter. Try clearing your filters or adding a new student.
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
      <div className={styles.reconciliationNote}>
        <span>⚡</span>
        <span>
          <strong>List Rendering &amp; Reconciliation:</strong> Rendering {students.length} items using unique <code>key=&#123;student.id&#125;</code> for stable diffing without re-mounting DOM elements.
        </span>
      </div>

      <div className={styles.cardsGrid}>
        {/*
          LEARNING OBJECTIVE: Rendering lists & Keys and why they matter
          We use stable, unique student.id instead of array index.
        */}
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onDelete={onDeleteStudent}
            onToggleStatus={onToggleStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
