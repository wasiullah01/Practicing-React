import { useState, useRef } from 'react';
import Card from '../Card/Card';
import styles from './TimerSettings.module.css';

/**
 * TimerSettings Component
 * 
 * Demonstrates:
 * 1. Component Composition
 * 2. Stored values & Customizing timer durations (Pomodoro, Short Break, Long Break)
 */
export function TimerSettings({ settings, onSaveSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pomodoroMins, setPomodoroMins] = useState(settings.pomodoro / 60);
  const [shortBreakMins, setShortBreakMins] = useState(settings.shortBreak / 60);
  const [longBreakMins, setLongBreakMins] = useState(settings.longBreak / 60);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      pomodoro: Math.max(1, parseInt(pomodoroMins, 10)) * 60,
      shortBreak: Math.max(1, parseInt(shortBreakMins, 10)) * 60,
      longBreak: Math.max(1, parseInt(longBreakMins, 10)) * 60,
    });
    setIsOpen(false);
  };

  return (
    <Card>
      <Card.Header
        title="Session Durations"
        subtitle="Customize focus & break lengths"
        action={
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? '✕ Close' : '⚙️ Settings'}
          </button>
        }
      />
      {isOpen && (
        <Card.Body>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Focus (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  className={styles.input}
                  value={pomodoroMins}
                  onChange={(e) => setPomodoroMins(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Short Break (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className={styles.input}
                  value={shortBreakMins}
                  onChange={(e) => setShortBreakMins(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Long Break (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className={styles.input}
                  value={longBreakMins}
                  onChange={(e) => setLongBreakMins(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn}>
                Save Durations
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card.Body>
      )}
    </Card>
  );
}

export default TimerSettings;
