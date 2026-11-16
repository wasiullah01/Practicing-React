import { useState, type FormEvent } from "react";
import styles from "./TodoForm.module.css";

type TodoFormProps = {
  onAdd: (title: string) => void;
};

function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAdd(trimmedTitle);
    setTitle("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="new-task">
        Add a task
      </label>
      <div className={styles.controls}>
        <input
          id="new-task"
          className={styles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          autoComplete="off"
        />
        <button className={styles.addButton} type="submit">
          Add task
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
