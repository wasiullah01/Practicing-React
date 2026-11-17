import React from 'react';
import styles from './StudentFilters.module.css';
import { FilterState, SortOption } from '../../types/student';
import { AVAILABLE_COURSES } from '../../data/initialStudents';

interface StudentFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export function StudentFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}: StudentFiltersProps) {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.course !== 'all' ||
    filters.status !== 'all' ||
    filters.sortBy !== 'newest';

  return (
    <div className={styles.filtersContainer}>
      {/* Search Bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by student name, ID, or email..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className={styles.searchInput}
            aria-label="Search students"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange('searchQuery', '')}
              className={styles.clearSearchBtn}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className={styles.controlsRow}>
        <div className={styles.selectGroup}>
          {/* Filter by Department */}
          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by department"
          >
            <option value="all">All Departments</option>
            {AVAILABLE_COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Filter by Status */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by enrollment status"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value as SortOption)}
            className={styles.filterSelect}
            aria-label="Sort students by"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name-asc">Sort: Name (A &rarr; Z)</option>
            <option value="name-desc">Sort: Name (Z &rarr; A)</option>
          </select>
        </div>

        <div className={styles.metaGroup}>
          <span className={styles.resultsCount}>
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> students
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className={styles.resetFiltersBtn}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
