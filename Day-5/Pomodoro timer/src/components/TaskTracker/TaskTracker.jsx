import { useState, useRef, useEffect } from 'react';
import Card from '../Card/Card';
import styles from './TaskTracker.module.css';

/**
 * TaskTracker Component
 * 
 * Demonstrates:
 * 1. Component Composition with <Card>
 * 2. DOM Access with useRef: `inputRef.current?.focus()` on keyboard shortcut or adding task
 * 3. Controlled form input & Local persistence
 */
export function TaskTracker({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [taskText, setTaskText] = useState('');
  const inputRef = useRef(null);

  // Auto-focus input when component loads or on request
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    onAddTask({
      id: crypto.randomUUID ? crypto.randomUUID() : `task_${Date.now()}`,
      text: taskText.trim(),
      completed: false,
      createdAt: Date.now(),
    });

    setTaskText('');
    inputRef.current?.focus();
  };

  return (
    <Card>
      <Card.Header
        title="Focus Tasks"
        subtitle="Keep track of current objectives during focus sessions"
        action={
          <span className={styles.countBadge}>
            {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
          </span>
        }
      />
      <Card.Body>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="What are you working on? (e.g. Chapter 4 review)"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <button type="submit" className={styles.addBtn}>
            + Add
          </button>
        </form>

        <div className={styles.taskList}>
          {tasks.length === 0 ? (
            <p className={styles.emptyNote}>No tasks added yet. Add a focus task above!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
              >
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.taskText}>{task.text}</span>
                </label>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => onDeleteTask(task.id)}
                  title="Remove task"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskTracker;
