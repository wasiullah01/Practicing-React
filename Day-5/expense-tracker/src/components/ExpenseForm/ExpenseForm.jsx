import { useState, useRef } from 'react';
import Card from '../Card/Card';
import styles from './ExpenseForm.module.css';

const CATEGORIES = [
  { id: 'Other', label: 'Others / General', icon: '📦' },
  { id: 'Food', label: 'Food & Dining', icon: '🍔' },
  { id: 'Transport', label: 'Transportation', icon: '🚗' },
  { id: 'Housing', label: 'Rent & Housing', icon: '🏠' },
  { id: 'Utilities', label: 'Bills & Utilities', icon: '💡' },
  { id: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'Health', label: 'Health & Fitness', icon: '💊' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
];

/**
 * ExpenseForm Component
 * 
 * Demonstrates:
 * 1. Component Composition: Composing Card, Card.Header, Card.Body.
 * 2. The useRef Hook (DOM Access):
 *    - `titleInputRef` is bound to the title input field. After a successful submission,
 *      we call `titleInputRef.current.focus()` so the user can swiftly type the next item
 *      without having to click the mouse again.
 * 3. Controlled Inputs & State Management:
 *    - Clean form handling with validation.
 * 4. Common Hook Mistakes Avoided:
 *    - Not mutating state arrays directly. When adding an expense, parent receives
 *      a fresh object.
 */
export function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  // useRef for DOM access: auto-refocusing after submit
  const titleInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      setError('Please provide an expense description.');
      titleInputRef.current?.focus();
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than $0.');
      return;
    }

    const newExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: date || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    onAddExpense(newExpense);

    // Reset Form
    setTitle('');
    setAmount('');
    setCategory('Other');
    setError('');

    // DOM REF: Focus the input immediately for rapid entry
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleQuickPreset = (presetTitle, presetAmount, presetCategory) => {
    setTitle(presetTitle);
    setAmount(presetAmount.toString());
    setCategory(presetCategory);
    setError('');
    titleInputRef.current?.focus();
  };

  return (
    <Card>
      <Card.Header
        title="Add New Expense"
        subtitle="Log transactions to monitor your budget"
      />
      <Card.Body>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="expense-title" className={styles.label}>
                Description
              </label>
              <input
                id="expense-title"
                ref={titleInputRef} // Binding DOM ref
                type="text"
                className={styles.input}
                placeholder="e.g. Grocery store, Uber ride, Coffee"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="expense-amount" className={styles.label}>
                Amount ($)
              </label>
              <div className={styles.amountWrapper}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`${styles.input} ${styles.amountInput}`}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="expense-category" className={styles.label}>
                Category
              </label>
              <select
                id="expense-category"
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="expense-date" className={styles.label}>
                Date
              </label>
              <input
                id="expense-date"
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.presetsRow}>
            <span className={styles.presetsLabel}>Quick presets:</span>
            <button
              type="button"
              className={styles.presetChip}
              onClick={() => handleQuickPreset('Coffee & Snack', 6.50, 'Food')}
            >
              ☕ $6.50 Coffee
            </button>
            <button
              type="button"
              className={styles.presetChip}
              onClick={() => handleQuickPreset('Groceries', 85.00, 'Food')}
            >
              🛒 $85 Groceries
            </button>
            <button
              type="button"
              className={styles.presetChip}
              onClick={() => handleQuickPreset('Gas / Refuel', 45.00, 'Transport')}
            >
              ⛽ $45 Fuel
            </button>
            <button
              type="button"
              className={styles.presetChip}
              onClick={() => handleQuickPreset('Streaming Services', 15.99, 'Entertainment')}
            >
              🎬 $15.99 Sub
            </button>
          </div>

          <button type="submit" className={styles.submitBtn}>
            + Add Expense
          </button>
        </form>
      </Card.Body>
    </Card>
  );
}

export default ExpenseForm;
