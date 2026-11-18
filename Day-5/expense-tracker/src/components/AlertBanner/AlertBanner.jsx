import { useEffect, useState } from 'react';
import styles from './AlertBanner.module.css';

/**
 * AlertBanner Component - Demonstrates Effect Cleanup with Timers & Lifecycle.
 * 
 * Concepts Demonstrated:
 * 1. Side Effect: Creating a timer (`setTimeout`) to auto-dismiss budget warnings.
 * 2. Dependency Array: `[message, duration, onDismiss]` ensures the timer resets
 *    if the alert message or settings change.
 * 3. Effect Cleanup: Returning `() => clearTimeout(timer)` ensures that if the user
 *    manually closes the alert, or if the component unmounts, the timer is cancelled.
 * 4. Component Lifecycle: 
 *    - Mount: Timer begins, progress bar animates.
 *    - Unmount: Timer is cleanly terminated, avoiding "setState on unmounted component".
 */
export function AlertBanner({
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  title,
  message,
  duration = 7000, // auto-dismiss in milliseconds (0 to disable)
  onDismiss,
  action,
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!duration || duration <= 0) return;

    // Reset progress to 100% on mount / update
    setProgress(100);

    const startTime = Date.now();
    
    // Interval side effect for smooth countdown progress bar
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);
    }, 50);

    // Timeout side effect to trigger auto-dismiss
    const timeoutId = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, duration);

    // EFFECT CLEANUP: Crucial to clear BOTH timeout & interval
    // If the component unmounts or user dismisses early, these won't leak!
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [message, duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`${styles.banner} ${styles[type]}`} role="alert">
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <div className={styles.textWrap}>
          {title && <h4 className={styles.title}>{title}</h4>}
          <p className={styles.message}>{message}</p>
        </div>
        {action && <div className={styles.action}>{action}</div>}
        {onDismiss && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        )}
      </div>

      {duration > 0 && (
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default AlertBanner;
