import styles from './StatsOverview.module.css';

/**
 * StatsOverview Component
 * 
 * Demonstrates:
 * 1. Component Composition: Reusable modular cards.
 * 2. Pure Derived State: All summary stats are derived synchronously during render
 *    from `expenses` and `budget`, avoiding common hook mistakes of putting
 *    everything into unnecessary state and calling redundant useEffect setters.
 */
export function StatsOverview({ expenses, budget, totalSpent }) {
  const remaining = Math.max(0, budget - totalSpent);
  const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

  // Compute Top Category
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry ? topCategoryEntry[0] : 'None';
  const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

  return (
    <div className={styles.statsGrid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Total Expenses</span>
          <span className={styles.cardIcon}>💳</span>
        </div>
        <div className={styles.cardValue}>
          ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={styles.cardSub}>
          Across {expenses.length} recorded {expenses.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Available Balance</span>
          <span className={styles.cardIcon}>💰</span>
        </div>
        <div className={`${styles.cardValue} ${remaining === 0 && totalSpent > budget ? styles.dangerText : styles.successText}`}>
          ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={styles.cardSub}>
          {Math.round(percentUsed)}% of ${budget} used
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Top Category</span>
          <span className={styles.cardIcon}>📊</span>
        </div>
        <div className={styles.cardValue}>
          {topCategory}
        </div>
        <div className={styles.cardSub}>
          {topCategoryAmount > 0
            ? `$${topCategoryAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} spent`
            : 'No expenses yet'}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Budget Health</span>
          <span className={styles.cardIcon}>🩺</span>
        </div>
        <div className={styles.cardValue}>
          {percentUsed >= 100 ? (
            <span className={styles.dangerBadge}>Exceeded</span>
          ) : percentUsed >= 80 ? (
            <span className={styles.warningBadge}>Caution</span>
          ) : (
            <span className={styles.successBadge}>Healthy</span>
          )}
        </div>
        <div className={styles.cardSub}>
          {percentUsed >= 100
            ? 'Limit surpassed!'
            : percentUsed >= 80
            ? 'Approaching limit'
            : 'Spending is within safe limits'}
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
