import Card from '../Card/Card';
import styles from './ExpenseList.module.css';

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Housing: '🏠',
  Utilities: '💡',
  Entertainment: '🎬',
  Health: '💊',
  Shopping: '🛍️',
  Other: '📦',
};

/**
 * ExpenseItem Subcomponent - Demonstrates Component Composition.
 */
function ExpenseItem({ expense, onDelete }) {
  const icon = CATEGORY_ICONS[expense.category] || '📦';

  // Format date nicely
  const formatDate = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.item}>
      <div className={styles.categoryIconWrap}>
        <span className={styles.categoryIcon}>{icon}</span>
      </div>

      <div className={styles.itemDetails}>
        <h4 className={styles.itemTitle}>{expense.title}</h4>
        <div className={styles.itemMeta}>
          <span className={styles.categoryBadge}>{expense.category}</span>
          <span className={styles.bullet}>•</span>
          <span className={styles.itemDate}>{formatDate(expense.date)}</span>
        </div>
      </div>

      <div className={styles.itemRight}>
        <span className={styles.itemAmount}>
          ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete(expense.id)}
          title="Delete this transaction"
          aria-label={`Delete ${expense.title}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

/**
 * ExpenseList Component
 * 
 * Demonstrates:
 * 1. Component Composition: Composing Card, Card.Header, Card.Body, Card.Footer
 *    with composed subcomponents (<ExpenseItem />).
 * 2. Pure rendering & immutable updates: items mapped cleanly without mutation.
 * 3. Graceful Empty States for both no data and no search results.
 */
export function ExpenseList({
  expenses,
  totalMatchingAmount,
  onDeleteExpense,
  onClearAll,
  isFiltered,
}) {
  return (
    <Card>
      <Card.Header
        title="Transaction History"
        subtitle="Chronological record of all expenditures"
        badge={`${expenses.length} Entries`}
        action={
          expenses.length > 0 && (
            <button
              type="button"
              className={styles.clearAllBtn}
              onClick={onClearAll}
            >
              Clear All
            </button>
          )
        }
      />

      <Card.Body className={styles.bodyCustom}>
        {expenses.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>{isFiltered ? '🔍' : '📝'}</span>
            <h4 className={styles.emptyTitle}>
              {isFiltered ? 'No matching transactions found' : 'No expenses recorded yet'}
            </h4>
            <p className={styles.emptySubtitle}>
              {isFiltered
                ? 'Try tweaking your search keywords or category filters.'
                : 'Use the form above to log your first expense.'}
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={onDeleteExpense}
              />
            ))}
          </div>
        )}
      </Card.Body>

      {expenses.length > 0 && (
        <Card.Footer>
          <span>Showing {expenses.length} items</span>
          <span className={styles.footerTotal}>
            Total: <strong>${totalMatchingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          </span>
        </Card.Footer>
      )}
    </Card>
  );
}

export default ExpenseList;
