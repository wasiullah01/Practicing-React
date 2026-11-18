import styles from './SessionStats.module.css';

/**
 * SessionStats Component
 * 
 * Demonstrates:
 * 1. Component Composition
 * 2. Visual streaks and progress tracking across Pomodoro intervals
 */
export function SessionStats({ completedSessions, cycleCount, onResetStats }) {
  // Visual indicators for the standard 4-pomodoro cycle before a long break
  const cycleIndex = cycleCount % 4;

  return (
    <div className={styles.statsStrip}>
      <div className={styles.statCard}>
        <span className={styles.label}>Completed Sessions</span>
        <span className={styles.value}>🍅 {completedSessions}</span>
      </div>

      <div className={styles.statCard}>
        <span className={styles.label}>Cycle Progress (to Long Break)</span>
        <div className={styles.dots}>
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx < (cycleIndex === 0 && completedSessions > 0 ? 4 : cycleIndex) ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.statCard}>
        <span className={styles.label}>Total Focused Time</span>
        <span className={styles.value}>{Math.round(completedSessions * 25)} mins</span>
      </div>

      {completedSessions > 0 && (
        <button
          type="button"
          className={styles.resetBtn}
          onClick={onResetStats}
          title="Reset session stats"
        >
          Reset Stats
        </button>
      )}
    </div>
  );
}

export default SessionStats;
