import { useState, type FormEvent } from "react";
import type { Todo } from "./TodoList";
import styles from "./TodoItem.module.css";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  onDelete: (id: number) => void;
};

function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  function startEditing() {
    setEditTitle(todo.title);
    setIsEditing(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    onUpdate(todo.id, trimmedTitle);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className={styles.item}>
        <form className={styles.editForm} onSubmit={handleSave}>
          <input
            className={styles.editInput}
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            aria-label={`Edit ${todo.title}`}
            autoFocus
          />
          <button className={styles.saveButton} type="submit">
            Save
          </button>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className={styles.item}>
      <label className={styles.task}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.completed ? styles.completed : ""}>
          {todo.title}
        </span>
      </label>
      <div className={styles.actions}>
        <button type="button" onClick={startEditing}>
          Edit
        </button>
        <button
          className={styles.deleteButton}
          type="button"
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
