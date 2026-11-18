# 💰 Expense Tracker

A modern financial expense tracking dashboard built with **React**, **CSS Modules**, and **Component Composition**. Features automated budget threshold alerts, debounced search, category filtering, and browser `localStorage` persistence.

---

## ✨ Features

- **Automated Budget Alerts:** Real-time visual and banner alerts triggering at 80% (Warning) and 100% (Budget Ceiling Exceeded), accompanied by an auto-dismiss countdown timer.
- **Debounced Search Toolbar:** High-performance search with zero input lag and delayed list filtering (300ms) to preserve responsiveness.
- **Global Keyboard Accessibility:** Focus the search bar quickly using <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>/</kbd>.
- **Category Filtering & Sorting:** Organize transactions by category (Food, Transport, Housing, Utilities, Entertainment, Health, Shopping, Others) and sort by date or dollar amount.
- **Local Persistence (`localStorage`):** Transactions and user-defined budget ceiling persist across browser restarts and sync across tabs via custom hooks.
- **Dynamic Tab Title:** Real-time remaining budget balance reflected right in the browser tab title.
- **Metrics Overview:** Quick breakdown cards showing total spent, available balance, top spending category, and overall budget health status.

---

## 🛠️ Tech Stack & Patterns

- **Framework:** React 19 / Vite
- **Styling:** CSS Modules (`*.module.css`) with clean CSS custom properties / design tokens
- **Architecture:** Compound Component Pattern (`<Card>`, `<Card.Header>`, `<Card.Body>`, `<Card.Footer>`)
- **Key React Hooks:**
  - `useState` (with lazy initial state functions)
  - `useEffect` (side effects, timers, global listeners, title sync)
  - `useEffect` Cleanup functions (`clearTimeout`, `clearInterval`, `removeEventListener`)
  - `useRef` (DOM focus management, mutable previous value tracking)
  - `useMemo` (pure derived state calculations)
  - Custom Hooks: `useLocalStorage`, `useDebounce`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
