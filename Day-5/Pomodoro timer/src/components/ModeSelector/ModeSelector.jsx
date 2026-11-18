import styles from './ModeSelector.module.css';

/**
 * ModeSelector Component
 * 
 * Switches between Pomodoro, Short Break, and Long Break.
 */
export function ModeSelector({ currentMode, onSelectMode }) {
  const modes = [
    { id: 'pomodoro', label: 'Pomodoro', icon: '🍅' },
    { id: 'shortBreak', label: 'Short Break', icon: '☕' },
    { id: 'longBreak', label: 'Long Break', icon: '🌴' },
  ];

  return (
    <div className={styles.container}>
      {modes.map((m) => {
        const isActive = currentMode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            className={`${styles.modeBtn} ${isActive ? styles.active : ''} ${styles[m.id]}`}
            onClick={() => onSelectMode(m.id)}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ModeSelector;
