import type { TodoFilter } from "./TodoFilters";
import TodoItem from "./TodoItem";
import styles from "./TodoList.module.css";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoListProps = {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  onDelete: (id: number) => void;
};

function TodoList({
  todos,
  filter,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    const message =
      filter === "completed"
        ? "No completed tasks yet."
        : filter === "active"
          ? "You have no active tasks."
          : "Add your first task to get started.";

    return <p className={styles.empty}>{message}</p>;
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
