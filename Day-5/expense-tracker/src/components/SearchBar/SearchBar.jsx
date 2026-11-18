import { useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

/**
 * SearchBar Component
 * 
 * Demonstrates:
 * 1. Debounced Search Integration:
 *    - The user types with immediate zero-lag input responsiveness.
 *    - The parent component receives debounced search queries so expensive list
 *      filtering only executes after user finishes typing.
 * 2. The useRef Hook (DOM Access & Focus Control):
 *    - `inputRef` allows programmatic focus when the user presses `Ctrl+K` or `/`.
 * 3. Effect Cleanup & Event Listeners:
 *    - Global keyboard shortcut (`window.addEventListener('keydown', ...)`) with proper
 *      cleanup (`window.removeEventListener`) to avoid duplicate listeners.
 * 4. Component Composition:
 *    - Integrates category filter, sort options, and clear controls into a unified toolbar.
 */
export function SearchBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  isDebouncing = false,
  totalResults = 0,
}) {
  const inputRef = useRef(null);

  // Global Keyboard Shortcut: Ctrl+K or '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search on Ctrl+K, Cmd+K, or pressing '/' while not inside an input/textarea
      const isTargetEditable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if ((e.key === '/' && !isTargetEditable) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      // Pressing Escape inside the input clears it or blurs
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (searchTerm) {
          onSearchChange('');
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // EFFECT CLEANUP: Always remove global event listeners!
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchTerm, onSearchChange]);

  const CATEGORIES = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Other', label: '📦 Others' },
    { id: 'Food', label: '🍔 Food' },
    { id: 'Transport', label: '🚗 Transport' },
    { id: 'Housing', label: '🏠 Housing' },
    { id: 'Utilities', label: '💡 Utilities' },
    { id: 'Entertainment', label: '🎬 Entertainment' },
    { id: 'Health', label: '💊 Health' },
    { id: 'Shopping', label: '🛍️ Shopping' },
  ];

  return (
    <div className={styles.toolbar}>
      {/* Search Input Box */}
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search expenses by title or amount... (Ctrl + K)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {isDebouncing && (
          <span className={styles.debouncingIndicator} title="Debouncing search query...">
            ⏳
          </span>
        )}
        {searchTerm && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              onSearchChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <kbd className={styles.kbdShortcut}>Ctrl K</kbd>
      </div>

      {/* Filter & Sort Controls */}
      <div className={styles.controlsRow}>
        <div className={styles.selectWrapper}>
          <label htmlFor="category-filter" className={styles.controlLabel}>Category:</label>
          <select
            id="category-filter"
            className={styles.select}
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label htmlFor="sort-by" className={styles.controlLabel}>Sort by:</label>
          <select
            id="sort-by"
            className={styles.select}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
          </select>
        </div>

        <div className={styles.resultCount}>
          <span>{totalResults} {totalResults === 1 ? 'transaction' : 'transactions'} found</span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
