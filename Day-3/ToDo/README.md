# Todo App

A React and TypeScript todo app built with composed components and CSS Modules.

## Features

- Add tasks
- Edit task titles
- Mark tasks complete
- Filter all, active, or completed tasks
- Delete tasks
- Responsive layout

## Component structure

`App` owns the todo state and passes focused callbacks to composed child
components:

- `AppShell` provides the page layout
- `TodoForm` handles new task input
- `TodoFilters` controls the current filter
- `TodoList` renders the visible tasks
- `TodoItem` handles editing, completion, and deletion

Each component keeps its styles in a matching `.module.css` file.

## Run the project

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```
