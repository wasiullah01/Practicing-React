import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

// Components
import ModeSelector from './components/ModeSelector/ModeSelector';
import TimerDisplay from './components/TimerDisplay/TimerDisplay';
import TaskTracker from './components/TaskTracker/TaskTracker';
import SessionStats from './components/SessionStats/SessionStats';
import TimerSettings from './components/TimerSettings/TimerSettings';

import styles from './App.module.css';

const DEFAULT_SETTINGS = {
  pomodoro: 25 * 60,   // 25 minutes in seconds
  shortBreak: 5 * 60,   // 5 minutes in seconds
  longBreak: 15 * 60,   // 15 minutes in seconds
};

/**
 * Pomodoro Timer Application
 * 
 * CORE REACT CONCEPTS DEMONSTRATED:
 * 1. SIDE EFFECTS & useEffect:
 *    - Timer countdown engine running with `setInterval`.
 *    - Document title dynamically reflecting timer countdown (e.g. "24:59 - Focus | Pomodoro").
 *    - Global keyboard shortcuts (Space to start/pause, 'R' to reset).
 * 2. EFFECT CLEANUP:
 *    - `clearInterval(intervalId)` cleanly tearing down the timer on pause, skip, or unmount.
 *    - `removeEventListener` cleaning up keyboard shortcuts.
 * 3. THE useRef HOOK:
 *    - Storing audio notification instances (`audioRef`) and mutable tracking variables.
 * 4. COMPONENT COMPOSITION:
 *    - Clean, composable compound components with CSS Modules.
 * 5. BROWSER LOCALSTORAGE PERSISTENCE:
 *    - Saves custom settings, focus tasks, and session statistics.
 */
export function App() {
  // Settings & Storage
  const [settings, setSettings] = useLocalStorage('pomodoro_settings', DEFAULT_SETTINGS);
  const [tasks, setTasks] = useLocalStorage('pomodoro_tasks', [
    { id: '1', text: 'Complete React Day-5 Practice', completed: false, createdAt: Date.now() },
  ]);
  const [stats, setStats] = useLocalStorage('pomodoro_stats', {
    completedSessions: 0,
    cycleCount: 0,
  });

  // Timer State
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);

  // Audio tone generation for session completion using Web Audio API (no external file needed!)
  const playChime = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext not allowed or not supported
    }
  }, []);

  // Switch mode handler
  const switchMode = useCallback(
    (newMode) => {
      setMode(newMode);
      setTimeLeft(settings[newMode]);
      setIsRunning(false);
    },
    [settings]
  );

  // Next session transition logic
  const handleSessionComplete = useCallback(() => {
    playChime();

    if (mode === 'pomodoro') {
      const newCompleted = stats.completedSessions + 1;
      const newCycle = stats.cycleCount + 1;
      setStats({ completedSessions: newCompleted, cycleCount: newCycle });

      // After 4 pomodoros -> Long Break; otherwise Short Break
      if (newCycle % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      // Break finished -> back to Pomodoro
      switchMode('pomodoro');
    }
  }, [mode, stats, switchMode, playChime, setStats]);

  // SIDE EFFECT 1: Timer Engine with useEffect & EFFECT CLEANUP
  useEffect(() => {
    if (!isRunning) return;

    // Start 1-second countdown interval
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          handleSessionComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // EFFECT CLEANUP: Prevents interval leaks when paused, reset, or unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, handleSessionComplete]);

  // SIDE EFFECT 2: Document Title countdown synchronization
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = String(timeLeft % 60).padStart(2, '0');
    const label = mode === 'pomodoro' ? '🍅 Focus' : mode === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break';
    document.title = `${mins}:${secs} - ${label} | Pomodoro`;

    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [timeLeft, mode]);

  // SIDE EFFECT 3: Global Keyboard Shortcuts (Space to Start/Pause, 'R' to reset)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsRunning(false);
        setTimeLeft(settings[mode]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // EFFECT CLEANUP
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, settings]);

  // Controls
  const handleToggleTimer = () => setIsRunning((prev) => !prev);
  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings[mode]);
  };
  const handleSkipTimer = () => {
    setIsRunning(false);
    handleSessionComplete();
  };

  // Task Handlers
  const handleAddTask = (newTask) => setTasks((prev) => [newTask, ...prev]);
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Settings update
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setTimeLeft(newSettings[mode]);
    setIsRunning(false);
  };

  const handleResetStats = () => {
    setStats({ completedSessions: 0, cycleCount: 0 });
  };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <span className={styles.logo}>🍅</span>
            <div>
              <h1 className={styles.title}>Pomodoro Timer</h1>
              <p className={styles.subtitle}>Stay focused & organized</p>
            </div>
          </div>
          <span className={styles.kbd}>Space: Start/Pause | R: Reset</span>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Mode Selector */}
        <ModeSelector currentMode={mode} onSelectMode={switchMode} />

        {/* Timer Display Card */}
        <div className={styles.timerSection}>
          <TimerDisplay
            timeLeft={timeLeft}
            totalTime={settings[mode]}
            mode={mode}
            isRunning={isRunning}
            onToggle={handleToggleTimer}
            onReset={handleResetTimer}
            onSkip={handleSkipTimer}
          />
        </div>

        {/* Statistics Strip */}
        <SessionStats
          completedSessions={stats.completedSessions}
          cycleCount={stats.cycleCount}
          onResetStats={handleResetStats}
        />

        {/* Task Tracker */}
        <TaskTracker
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />

        {/* Customization Settings */}
        <TimerSettings
          settings={settings}
          onSaveSettings={handleSaveSettings}
        />
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Pomodoro Timer &copy; {new Date().getFullYear()}</span>
          <span>Data preserved in browser storage</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
