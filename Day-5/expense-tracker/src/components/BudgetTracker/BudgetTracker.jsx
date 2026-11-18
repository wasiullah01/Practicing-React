import { useState, useRef, useEffect } from 'react';
import Card from '../Card/Card';
import styles from './BudgetTracker.module.css';

/**
 * BudgetTracker Component
 * 
 * Demonstrates:
 * 1. Component Composition: Composing Card, Card.Header, Card.Body.
 * 2. The useRef Hook (DOM Access):
 *    - `inputRef` is attached to the budget input element so it auto-focuses
 *      immediately when the user clicks "Edit Budget" (`inputRef.current?.focus()`).
 * 3. The useRef Hook (Stored Mutable Values):
 *    - `prevBudgetRef` tracks the previous budget amount across renders without
 *      triggering re-renders itself.
 * 4. Derived State over Redundant State:
 *    - `percentSpent`, `remaining`, and `isOverBudget` are computed during render,
 *      avoiding common hook mistakes like storing redundant derived values in state
 *      and synchronizing them with messy useEffects.
 */
export function BudgetTracker({
  budget,
  onUpdateBudget,
  totalSpent,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget);

  // useRef 1: DOM access to auto-focus input when editing opens
  const inputRef = useRef(null);

  // useRef 2: Stored value to compare previous budget without causing re-renders
  const prevBudgetRef = useRef(budget);

  // When switching to editing mode, auto-focus input via DOM ref
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Keep track of budget changes in ref
  useEffect(() => {
    prevBudgetRef.current = budget;
  }, [budget]);

  // Derived calculations (Pure render logic - NO extra useState or useEffect needed!)
  const percentSpent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;
  const rawPercent = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const remaining = Math.max(0, budget - totalSpent);
  const overspentAmount = Math.max(0, totalSpent - budget);

  const getStatusColor = () => {
    if (rawPercent >= 100) return styles.danger;
    if (rawPercent >= 80) return styles.warning;
    return styles.normal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBudget(parsed);
      setIsEditing(false);
    }
  };

  const handleQuickBudget = (amount) => {
    setInputValue(amount);
    onUpdateBudget(amount);
    setIsEditing(false);
  };

  return (
    <Card className={getStatusColor()}>
      <Card.Header
        title="Monthly Budget & Limits"
        subtitle="Manage spending ceiling and track alerts"
        badge={
          rawPercent >= 100 ? 'Budget Exceeded' : rawPercent >= 80 ? '80% Threshold' : 'On Track'
        }
        action={
          !isEditing && (
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => {
                setInputValue(budget);
                setIsEditing(true);
              }}
            >
              ✏️ Edit Budget
            </button>
          )
        }
      />

      <Card.Body>
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Allocated Budget</span>
            <span className={styles.statValue}>${budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className={styles.statBox}>
            <span className={styles.statLabel}>Total Spent</span>
            <span className={`${styles.statValue} ${rawPercent >= 100 ? styles.textDanger : ''}`}>
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className={styles.statBox}>
            <span className={styles.statLabel}>
              {rawPercent >= 100 ? 'Overspent By' : 'Remaining'}
            </span>
            <span className={`${styles.statValue} ${rawPercent >= 100 ? styles.textDanger : styles.textSuccess}`}>
              ${(rawPercent >= 100 ? overspentAmount : remaining).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span className={styles.progressTitle}>Budget Utilization</span>
            <span className={styles.progressPercent}>{Math.round(rawPercent)}%</span>
          </div>
          <div className={styles.track}>
            <div
              className={`${styles.fill} ${getStatusColor()}`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        </div>

        {/* Edit Budget Form when active */}
        {isEditing && (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <label htmlFor="budget-input" className={styles.inputLabel}>
              Set New Monthly Limit ($)
            </label>
            <div className={styles.inputGroup}>
              <span className={styles.currencyPrefix}>$</span>
              <input
                id="budget-input"
                ref={inputRef} // Attaching DOM Ref
                type="number"
                min="0"
                step="50"
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter budget amount"
              />
              <button type="submit" className={styles.saveBtn}>Save</button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>

            <div className={styles.presets}>
              <span className={styles.presetLabel}>Quick limits:</span>
              {[500, 1000, 1500, 2500, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => handleQuickBudget(val)}
                >
                  ${val}
                </button>
              ))}
            </div>
          </form>
        )}
      </Card.Body>
    </Card>
  );
}

export default BudgetTracker;
