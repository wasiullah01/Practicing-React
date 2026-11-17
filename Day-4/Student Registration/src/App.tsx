import React, { useState, useMemo } from 'react';
import styles from './App.module.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StudentStats } from './components/stats/StudentStats';
import { StudentForm } from './components/form/StudentForm';
import { StudentFilters } from './components/list/StudentFilters';
import { StudentList } from './components/list/StudentList';
import { StudentDetailModal } from './components/list/StudentDetailModal';
import { Modal } from './components/ui/Modal';
import { ConceptGuide } from './components/education/ConceptGuide';
import { Student, FilterState, StudentStatus } from './types/student';
import { INITIAL_STUDENTS } from './data/initialStudents';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  course: 'all',
  status: 'all',
  sortBy: 'newest',
};

export function App() {
  // LIFTING STATE UP:
  // The parent component manages the single source of truth for:
  // 1. All student records (shared with Form, Stats, List, and Modals)
  // 2. Active filters & search queries (shared with Filters and List)
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isConceptsModalOpen, setIsConceptsModalOpen] = useState(false);

  // HANDLER: Add new student (passed down to StudentForm)
  const handleRegisterStudent = (newStudent: Student) => {
    setStudents((prevStudents) => [newStudent, ...prevStudents]);
  };

  // HANDLER: Delete student (passed down to StudentCard/List)
  const handleDeleteStudent = (id: string) => {
    setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
    }
  };

  // HANDLER: Toggle student status (demonstrating targeted reconciliation)
  const handleToggleStatus = (id: string, currentStatus: StudentStatus) => {
    const nextStatus: StudentStatus =
      currentStatus === 'Active'
        ? 'Pending'
        : currentStatus === 'Pending'
        ? 'Inactive'
        : 'Active';

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, status: nextStatus } : student
      )
    );

    // Keep modal in sync if open
    setSelectedStudent((prev) =>
      prev && prev.id === id ? { ...prev, status: nextStatus } : prev
    );
  };

  // HANDLER: Update filters (passed down to StudentFilters)
  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // HANDLER: Reset filters
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // DERIVED STATE: Search, filter, and sort computed with useMemo
  // Does not duplicate state, runs on render when students or filters change
  const filteredStudents = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    return students
      .filter((student) => {
        // Search filter: Matches Name, Email, Phone, or ID
        if (query) {
          const matchName = student.fullName.toLowerCase().includes(query);
          const matchEmail = student.email.toLowerCase().includes(query);
          const matchPhone = student.phone.toLowerCase().includes(query);
          const matchId = student.id.toLowerCase().includes(query);
          if (!matchName && !matchEmail && !matchPhone && !matchId) {
            return false;
          }
        }

        // Course / Program filter
        if (filters.course !== 'all' && student.course !== filters.course) {
          return false;
        }

        // Status filter
        if (filters.status !== 'all' && student.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.fullName.localeCompare(b.fullName);
          case 'name-desc':
            return b.fullName.localeCompare(a.fullName);
          case 'oldest':
            return a.registeredAt.localeCompare(b.registeredAt);
          case 'newest':
          default:
            return b.registeredAt.localeCompare(a.registeredAt);
        }
      });
  }, [students, filters]);

  return (
    <div className={styles.pageWrapper}>
      <Header
        onOpenConcepts={() => setIsConceptsModalOpen(true)}
        studentCount={students.length}
      />

      <main className={styles.mainContent}>
        {/* Statistics Dashboard: Demonstrates Lifting State Up */}
        <StudentStats
          students={students}
          onSelectStatusFilter={(status) => handleFilterChange('status', status)}
        />

        <div className={styles.layoutGrid}>
          {/* Left Column: Registration Form (Controlled + Uncontrolled components) */}
          <div className={styles.formColumn}>
            <StudentForm onRegisterStudent={handleRegisterStudent} />
          </div>

          {/* Right Column: Search, Filter, and Student Cards List */}
          <div className={styles.listColumn}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Registered Students
                <span className={styles.sectionCountBadge}>
                  {filteredStudents.length} / {students.length}
                </span>
              </h2>
            </div>

            {/* Search and Filters */}
            <StudentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalCount={students.length}
              filteredCount={filteredStudents.length}
            />

            {/* List Rendering & Reconciliation */}
            <StudentList
              students={filteredStudents}
              onDeleteStudent={handleDeleteStudent}
              onToggleStatus={handleToggleStatus}
              onViewDetails={(student) => setSelectedStudent(student)}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onToggleStatus={handleToggleStatus}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* Educational Guide Modal (Explaining all Day 4 Learning Objectives) */}
      <Modal
        isOpen={isConceptsModalOpen}
        onClose={() => setIsConceptsModalOpen(false)}
        title="React Day 4 Learning Objectives Guide"
      >
        <ConceptGuide />
      </Modal>
    </div>
  );
}

export default App;
