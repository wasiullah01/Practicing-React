import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';

// Components (Component Composition approach)
import BudgetTracker from './components/BudgetTracker/BudgetTracker';
import ExpenseForm from './components/ExpenseForm/ExpenseForm';
import SearchBar from './components/SearchBar/SearchBar';
import ExpenseList from './components/ExpenseList/ExpenseList';
import StatsOverview from './components/StatsOverview/StatsOverview';
import AlertBanner from './components/AlertBanner/AlertBanner';

import styles from './App.module.css';

const DEFAULT_BUDGET = 1200;

const SAMPLE_EXPENSES = [
  { id: 'exp_1', title: 'Monthly Grocery Run', amount: 142.50, category: 'Food', date: '2026-11-15', createdAt: 1 },
  { id: 'exp_2', title: 'Gasoline & Fuel', amount: 48.00, category: 'Transport', date: '2026-11-16', createdAt: 2 },
  { id: 'exp_3', title: 'High-speed Internet', amount: 65.00, category: 'Utilities', date: '2026-11-10', createdAt: 3 },
  { id: 'exp_4', title: 'Movie Night & Tickets', amount: 32.00, category: 'Entertainment', date: '2026-11-14', createdAt: 4 },
  { id: 'exp_5', title: 'Pharmacy & Vitamins', amount: 24.50, category: 'Health', date: '2026-11-12', createdAt: 5 },
  { id: 'exp_6', title: 'Specialty Coffee Beans', amount: 18.25, category: 'Food', date: '2026-11-17', createdAt: 6 },
];

/**
 * Main ExpenseTracker Application
 * 
 * CORE REACT ARCHITECTURE & CONCEPTS DEMONSTRATED:
 * 
 * 1. SIDE EFFECTS & THE useEffect HOOK:
 *    - Effect A: Syncing `document.title` to reflect current remaining balance.
 *    - Effect B: Budget monitoring effect that triggers warning / danger alerts.
 *    - Effect C: Storage persistence to browser localStorage (via useLocalStorage).
 *    - Effect D: Keyboard event listeners for rapid accessibility (Ctrl+K).
 * 
 * 2. DEPENDENCY ARRAYS:
 *    - Document title effect watches `[totalSpent, budget]`.
 *    - Budget alert trigger watches `[totalSpent, budget]`.
 *    - Debounce timer watches `[value, delay]`.
 * 
 * 3. EFFECT CLEANUP (Timers & Event Listeners):
 *    - Timers in `AlertBanner` and `useDebounce` are cleanly cancelled with `clearTimeout`.
 *    - Global keyboard shortcuts and storage listeners remove themselves with `removeEventListener`.
 * 
 * 4. COMPONENT LIFECYCLE (Mount, Update, Unmount):
 *    - `isInitialMountRef` distinguishes between initial page load vs live state updates.
 *    - AlertBanner mounts dynamically, ticks down, and unmounts cleanly without memory leaks.
 * 
 * 5. THE useRef HOOK:
 *    - DOM Access: Focusing search and budget inputs programmatically.
 *    - Stored Instance Values: `prevTotalRef` tracks previous spending across renders
 *      without triggering unnecessary re-renders.
 * 
 * 6. DEBOUNCED SEARCH:
 *    - Search input typing is immediate (instant feedback).
 *    - Filtered results update through debounced text (300ms delay) to avoid heavy re-filtering.
 * 
 * 7. COMMON HOOK MISTAKES AVOIDED:
 *    - No duplicate redundant state (e.g., `totalSpent` is derived pure during render).
 *    - No infinite loops (effects only set alert state when thresholds are newly breached).
 *    - Lazy localStorage initialization preventing synchronous disk reads on each render.
 *    - Strict immutability when updating arrays and objects.
 */
export function App() {
  // 1. Persistent State via custom useLocalStorage hook
  const [expenses, setExpenses] = useLocalStorage('expense_tracker_items', SAMPLE_EXPENSES);
  const [budget, setBudget] = useLocalStorage('expense_tracker_budget', DEFAULT_BUDGET);

  // 2. UI Filtering & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // 3. Active Alert Notification State
  const [activeAlert, setActiveAlert] = useState(null);

  // 4. Debounced Search Hook (demonstrates useEffect + timer cleanup)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm !== debouncedSearchTerm;

  // 5. useRef: Stored values that persist across renders without causing re-renders
  const isInitialMountRef = useRef(true);
  const prevTotalRef = useRef(0);

  // 6. Pure Derived State: Calculated directly during render (NO extra state or effect!)
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  // SIDE EFFECT 1: Synchronize document title with budget status
  useEffect(() => {
    const remaining = budget - totalSpent;
    if (remaining < 0) {
      document.title = `🚨 Over Budget ($${Math.abs(remaining).toFixed(0)}) | Expense Tracker`;
    } else {
      document.title = `$${remaining.toFixed(0)} Left | Expense Tracker`;
    }

    // Effect cleanup: restore original title on unmount
    return () => {
      document.title = 'Expense Tracker';
    };
  }, [totalSpent, budget]); // Dependency array: only runs when totalSpent or budget changes

  // SIDE EFFECT 2: Evaluate Budget Thresholds & Trigger Alerts
  useEffect(() => {
    // Avoid triggering alerts during initial component mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevTotalRef.current = totalSpent;
      return;
    }

    const prevTotal = prevTotalRef.current;
    const currentTotal = totalSpent;
    prevTotalRef.current = currentTotal;

    const threshold80 = budget * 0.8;

    // Check if newly crossed 100% budget limit
    if (currentTotal >= budget && prevTotal < budget) {
      setActiveAlert({
        id: Date.now(),
        type: 'danger',
        title: 'Budget Ceiling Exceeded!',
        message: `Your total spending of $${currentTotal.toFixed(2)} has surpassed your monthly budget limit of $${budget.toFixed(2)}.`,
        duration: 9000,
      });
    }
    // Check if newly crossed 80% warning limit
    else if (currentTotal >= threshold80 && currentTotal < budget && prevTotal < threshold80) {
      setActiveAlert({
        id: Date.now(),
        type: 'warning',
        title: 'Budget Alert (80% Reached)',
        message: `You have spent 80% of your allocated budget ($${currentTotal.toFixed(2)} of $${budget.toFixed(2)}).`,
        duration: 7000,
      });
    }
  }, [totalSpent, budget]);

  // Handler: Add Expense (Immutable state update)
  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    setActiveAlert({
      id: Date.now(),
      type: 'success',
      title: 'Expense Recorded',
      message: `Added "${newExpense.title}" for $${newExpense.amount.toFixed(2)}.`,
      duration: 3500,
    });
  };

  // Handler: Delete Expense
  const handleDeleteExpense = (id) => {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prevExpenses) => prevExpenses.filter((e) => e.id !== id));
    if (target) {
      setActiveAlert({
        id: Date.now(),
        type: 'info',
        title: 'Transaction Removed',
        message: `Deleted "${target.title}" ($${target.amount.toFixed(2)}).`,
        duration: 3000,
      });
    }
  };

  // Handler: Clear All Expenses
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all transactions?')) {
      setExpenses([]);
      setActiveAlert({
        id: Date.now(),
        type: 'info',
        title: 'Transactions Cleared',
        message: 'All expense entries have been removed.',
        duration: 3500,
      });
    }
  };

  // Handler: Reset to Sample Data
  const handleLoadSampleData = () => {
    setExpenses(SAMPLE_EXPENSES);
    setBudget(DEFAULT_BUDGET);
    setActiveAlert({
      id: Date.now(),
      type: 'success',
      title: 'Sample Data Loaded',
      message: 'Restored default expense entries and budget settings.',
      duration: 4000,
    });
  };

  // Filter & Sort Expenses using debounced search term
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 2. Debounced Search Filter
    if (debouncedSearchTerm.trim()) {
      const q = debouncedSearchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.amount.toString().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, selectedCategory, debouncedSearchTerm, sortBy]);

  const totalMatchingAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className={styles.appContainer}>
      {/* Top Header & Brand */}
      <header className={styles.topNavbar}>
        <div className={styles.navContent}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>💎</div>
            <div>
              <h1 className={styles.brandTitle}>Expense Tracker</h1>
              <p className={styles.brandTagline}>Budget alerts, live search & persistent storage</p>
            </div>
          </div>

          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handleLoadSampleData}
              title="Reset and load default sample data"
            >
              🔄 Load Sample Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Active Budget Alert / Notification Banner (Demonstrates Timer Cleanup) */}
        {activeAlert && (
          <AlertBanner
            key={activeAlert.id}
            type={activeAlert.type}
            title={activeAlert.title}
            message={activeAlert.message}
            duration={activeAlert.duration}
            onDismiss={() => setActiveAlert(null)}
          />
        )}

        {/* Metric Cards Overview */}
        <StatsOverview
          expenses={expenses}
          budget={budget}
          totalSpent={totalSpent}
        />

        {/* Two-Column Responsive Layout */}
        <div className={styles.layoutGrid}>
          {/* Left Column: Budget Tracker & Add Expense Form */}
          <section className={styles.leftColumn}>
            <BudgetTracker
              budget={budget}
              onUpdateBudget={setBudget}
              totalSpent={totalSpent}
            />

            <ExpenseForm onAddExpense={handleAddExpense} />
          </section>

          {/* Right Column: Search Toolbar & Transaction History */}
          <section className={styles.rightColumn}>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              isDebouncing={isDebouncing}
              totalResults={filteredExpenses.length}
            />

            <ExpenseList
              expenses={filteredExpenses}
              totalMatchingAmount={totalMatchingAmount}
              onDeleteExpense={handleDeleteExpense}
              onClearAll={handleClearAll}
              isFiltered={selectedCategory !== 'ALL' || Boolean(debouncedSearchTerm)}
            />
          </section>
        </div>
      </main>

      {/* Footer with browser sync indicator */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Financial Expense Tracker &copy; {new Date().getFullYear()}</span>
          <div className={styles.syncIndicator}>
            <span className={styles.syncDot} />
            <span>Browser localStorage synced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
