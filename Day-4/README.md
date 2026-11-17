# React Day 4 &bull; Forms, Reconciliation & State Management

A collection of two production-ready React applications built with **React 19**, **TypeScript**, **CSS Modules**, and **Tailwind CSS**, demonstrating modern form architectures, dynamic conditional rendering, and state management.

---

## 📁 Projects in This Repository

### 1. [Student Registration App](./Student%20Registration)
An academic enrollment portal for managing student admissions and degree programs.
- **Key Highlights**: Controlled form inputs, uncontrolled file & note refs, real-time input validation with accessible error messaging, unique key-based reconciliation, and live multi-criteria search and filter.
- **Run**:
  ```bash
  cd "Student Registration"
  npm install
  npm run dev
  ```

### 2. [Job Application Portal](./Job%20Application)
An enterprise recruitment platform with a dynamic, multi-branch candidate application form.
- **Key Highlights**: Dynamic conditional fields (swapping between Experienced Professional and Early Career paths, remote timezone logistics, and visa sponsorship requirements), candidate recruitment pipeline tracking, and interactive applicant dossiers.
- **Run**:
  ```bash
  cd "Job Application"
  npm install
  npm run dev
  ```

---

## 🎯 Core Concepts Covered

- **Controlled Components**: Form inputs synchronized with React state as the single source of truth.
- **Uncontrolled Components**: File uploads and text notes managed directly via the DOM using `useRef()`.
- **Conditional Form Fields**: Dynamically rendering input groups and enforcing conditional validation rules based on user selections.
- **List Rendering & Keys**: Efficient Virtual DOM diffing using persistent, unique identifiers (`key={item.id}`).
- **Lifting State Up**: Centralizing shared state at the parent level to coordinate forms, search filters, and statistics.
- **Derived State**: Real-time filtering and sorting computed via `useMemo` without state duplication.
- **Component Composition**: Reusable compound UI patterns (`Card`, `FormField`, `Badge`, `Modal`).
- **Scoped Styling**: Zero-leak CSS Modules (`*.module.css`) paired with Tailwind CSS utilities.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **Icons & Primitives**: Inline SVG + Headless Compound Components
