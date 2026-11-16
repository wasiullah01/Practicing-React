import styles from "./TodoFilters.module.css";

export type TodoFilter = "all" | "active" | "completed";

type TodoFiltersProps = {
  activeFilter: TodoFilter;
  todoCount: number;
  onFilterChange: (filter: TodoFilter) => void;
};

const filters: { label: string; value: TodoFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

function TodoFilters({
  activeFilter,
  todoCount,
  onFilterChange,
}: TodoFiltersProps) {
  return (
    <div className={styles.toolbar}>
      <span className={styles.count}>
        {todoCount} {todoCount === 1 ? "task" : "tasks"}
      </span>
      <div className={styles.filters} aria-label="Filter tasks">
        {filters.map((item) => (
          <button
            key={item.value}
            className={activeFilter === item.value ? styles.active : ""}
            type="button"
            onClick={() => onFilterChange(item.value)}
            aria-pressed={activeFilter === item.value}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TodoFilters;
