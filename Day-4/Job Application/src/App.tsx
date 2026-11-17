import { useState, useMemo } from 'react';
import styles from './App.module.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ApplicationStats } from './components/stats/ApplicationStats';
import { JobApplicationForm } from './components/form/JobApplicationForm';
import { ApplicationFilters } from './components/list/ApplicationFilters';
import { ApplicationList } from './components/list/ApplicationList';
import { ApplicationDetailModal } from './components/list/ApplicationDetailModal';
import type { JobApplication, FilterState, ApplicationStatus } from './types/jobApplication';
import { INITIAL_APPLICATIONS } from './data/initialApplications';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  position: 'all',
  status: 'all',
  workArrangement: 'all',
  experienceType: 'all',
  sortBy: 'newest',
};

export function App() {
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const handleAddApplication = (newApp: JobApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: ApplicationStatus) => {
    const nextStatus: ApplicationStatus =
      currentStatus === 'Under Review'
        ? 'Interviewing'
        : currentStatus === 'Interviewing'
        ? 'Offer Extended'
        : currentStatus === 'Offer Extended'
        ? 'Rejected'
        : 'Under Review';

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: nextStatus } : app))
    );

    setSelectedApplication((prev) =>
      prev && prev.id === id ? { ...prev, status: nextStatus } : prev
    );
  };

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Derived filtered & sorted applications
  const filteredApplications = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();

    return applications
      .filter((app) => {
        if (query) {
          const matchName = app.fullName.toLowerCase().includes(query);
          const matchEmail = app.email.toLowerCase().includes(query);
          const matchPos = app.position.toLowerCase().includes(query);
          const matchId = app.id.toLowerCase().includes(query);
          if (!matchName && !matchEmail && !matchPos && !matchId) {
            return false;
          }
        }

        if (filters.position !== 'all' && app.position !== filters.position) {
          return false;
        }

        if (filters.status !== 'all' && app.status !== filters.status) {
          return false;
        }

        if (
          filters.workArrangement !== 'all' &&
          app.workArrangement !== filters.workArrangement
        ) {
          return false;
        }

        if (
          filters.experienceType !== 'all' &&
          app.experienceType !== filters.experienceType
        ) {
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
            return a.appliedDate.localeCompare(b.appliedDate);
          case 'status':
            return a.status.localeCompare(b.status);
          case 'newest':
          default:
            return b.appliedDate.localeCompare(a.appliedDate);
        }
      });
  }, [applications, filters]);

  return (
    <div className={styles.pageWrapper}>
      <Header applicantCount={applications.length} />

      <main className={styles.mainContent}>
        {/* Recruitment Pipeline Metrics */}
        <ApplicationStats
          applications={applications}
          onSelectStatusFilter={(status) => handleFilterChange('status', status)}
          onSelectWorkFilter={(work) => handleFilterChange('workArrangement', work)}
        />

        <div className={styles.layoutGrid}>
          {/* Left Column: Job Application Form */}
          <div className={styles.formColumn}>
            <JobApplicationForm onSubmitApplication={handleAddApplication} />
          </div>

          {/* Right Column: Search, Filters, and Candidate Cards List */}
          <div className={styles.listColumn}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Applicant Pipeline
                <span className={styles.sectionCountBadge}>
                  {filteredApplications.length} of {applications.length} Candidates
                </span>
              </h2>
            </div>

            {/* Filter and Search Bar */}
            <ApplicationFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalCount={applications.length}
              filteredCount={filteredApplications.length}
            />

            {/* Applications List */}
            <ApplicationList
              applications={filteredApplications}
              onDeleteApplication={handleDeleteApplication}
              onToggleStatus={handleToggleStatus}
              onViewDetails={(app) => setSelectedApplication(app)}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Candidate Dossier Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onToggleStatus={handleToggleStatus}
        onDeleteApplication={handleDeleteApplication}
      />
    </div>
  );
}

export default App;
