import { useMemo, useState } from "react";
import AppShell from "./Components/AppShell";
import TodoFilters, {
  type TodoFilter,
} from "./Components/TodoFilters";
import TodoForm from "./Components/TodoForm";
import TodoList, { type Todo } from "./Components/TodoList";

const initialTodos: Todo[] = [
  { id: 1, title: "Plan the day", completed: true },
  { id: 2, title: "Build a todo app", completed: false },
];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState<TodoFilter>("all");

  const visibleTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  function addTodo(title: string) {
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: Date.now(), title, completed: false },
    ]);
  }

  function toggleTodo(id: number) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function updateTodo(id: number, title: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
  }

  function deleteTodo(id: number) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id),
    );
  }

  return (
    <AppShell
      title="My tasks"
      subtitle="Keep small steps moving forward."
    >
      <TodoForm onAdd={addTodo} />
      <TodoFilters
        activeFilter={filter}
        todoCount={todos.length}
        onFilterChange={setFilter}
      />
      <TodoList
        todos={visibleTodos}
        filter={filter}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </AppShell>
  );
}

export default App;
