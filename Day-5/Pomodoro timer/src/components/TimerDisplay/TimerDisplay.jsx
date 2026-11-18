import styles from './TimerDisplay.module.css';

/**
 * TimerDisplay Component
 * 
 * Demonstrates:
 * 1. Component Composition
 * 2. Visual countdown and circular progress indicator
 */
export function TimerDisplay({
  timeLeft,
  totalTime,
  mode,
  isRunning,
  onToggle,
  onReset,
  onSkip,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate SVG stroke progress (circumference = 2 * PI * r)
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const modeThemeClass = styles[mode] || styles.pomodoro;

  return (
    <div className={`${styles.container} ${modeThemeClass}`}>
      <div className={styles.circleWrapper}>
        <svg className={styles.svg} width="320" height="320" viewBox="0 0 320 320">
          <circle
            className={styles.bgCircle}
            cx="160"
            cy="160"
            r={radius}
          />
          <circle
            className={styles.progressCircle}
            cx="160"
            cy="160"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        <div className={styles.timeCenter}>
          <span className={styles.timeText}>{formattedTime}</span>
          <span className={styles.statusBadge}>
            {isRunning ? 'FOCUSING' : 'PAUSED'}
          </span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.mainBtn} ${isRunning ? styles.pauseBtn : styles.startBtn}`}
          onClick={onToggle}
        >
          {isRunning ? '⏸ PAUSE' : '▶ START'}
        </button>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onReset}
          title="Reset timer to beginning"
        >
          🔄 Reset
        </button>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={onSkip}
          title="Skip to next session"
        >
          ⏭ Skip
        </button>
      </div>
    </div>
  );
}

export default TimerDisplay;
