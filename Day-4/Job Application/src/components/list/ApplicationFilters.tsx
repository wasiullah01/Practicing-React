import styles from './ApplicationFilters.module.css';
import type { FilterState, SortOption } from '../../types/jobApplication';
import { AVAILABLE_POSITIONS } from '../../data/initialApplications';

interface ApplicationFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export function ApplicationFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}: ApplicationFiltersProps) {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.position !== 'all' ||
    filters.status !== 'all' ||
    filters.workArrangement !== 'all' ||
    filters.experienceType !== 'all' ||
    filters.sortBy !== 'newest';

  return (
    <div className={styles.filtersContainer}>
      {/* Search Input */}
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
            placeholder="Search candidate by name, email, target role, or ID..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className={styles.searchInput}
            aria-label="Search candidates"
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

      {/* Grid of Filter Dropdowns */}
      <div className={styles.dropdownGrid}>
        {/* Position */}
        <select
          value={filters.position}
          onChange={(e) => onFilterChange('position', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by position"
        >
          <option value="all">All Roles</option>
          {AVAILABLE_POSITIONS.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>

        {/* Pipeline Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="Under Review">Under Review</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer Extended">Offer Extended</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Work Arrangement */}
        <select
          value={filters.workArrangement}
          onChange={(e) => onFilterChange('workArrangement', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by work arrangement"
        >
          <option value="all">All Work Types</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        {/* Experience Level */}
        <select
          value={filters.experienceType}
          onChange={(e) => onFilterChange('experienceType', e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by experience level"
        >
          <option value="all">All Levels</option>
          <option value="experienced">Experienced</option>
          <option value="fresh-grad">Early Career</option>
        </select>

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value as SortOption)}
          className={styles.filterSelect}
          aria-label="Sort applications"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="name-asc">Sort: Name (A-Z)</option>
          <option value="name-desc">Sort: Name (Z-A)</option>
        </select>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.resultsCount}>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> candidates
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className={styles.resetFiltersBtn}
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
