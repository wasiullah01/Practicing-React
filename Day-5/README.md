# ⚛️ React Day 5 — Practical Application Portfolio

This directory contains two standalone production-ready React applications demonstrating **component composition**, **CSS modules**, **custom hooks**, **side effect lifecycles**, **cleanup routines**, and **browser persistence**.

---

## 📁 Projects Overview

| Directory | Project | Description | Core Techniques |
| :--- | :--- | :--- | :--- |
| **[`/expense-tracker`](./expense-tracker)** | **Expense Tracker** | Budget management dashboard with threshold alerts, debounced search, category filters, and live storage sync. | Debounced Search, Budget Alerts, LocalStorage Sync, Compound Cards, Title Sync |
| **[`/Pomodoro timer`](./Pomodoro%20timer)** | **Pomodoro Timer** | Productivity focus timer featuring circular SVG progress, automated work/break intervals, task tracking, and Web Audio chimes. | Timer Intervals, Effect Cleanup, Circular SVG Progress, Keyboard Shortcuts, Web Audio |

---

## 🎯 Shared Architectural Highlights

Both projects were built using identical software design principles:
- **Component Composition:** Flexible compound component structures utilizing `children` and subcomponents rather than rigid prop drilling.
- **CSS Modules:** Fully scoped styling (`*.module.css`) paired with global CSS design tokens for zero class-collision and clean dark-mode interfaces.
- **Robust Effect Lifecycle & Cleanup:** Every asynchronous operation (`setInterval`, `setTimeout`, `window.addEventListener`) includes an explicit cleanup function to prevent memory leaks and orphaned callbacks.
- **Native Browser Persistence:** Custom `useLocalStorage` hooks featuring lazy state initialization and multi-tab storage synchronization.

---

## 🚀 Quick Start

Navigate to either project directory and execute:

```bash
# 1. Enter the project folder
cd "expense-tracker"   # or: cd "Pomodoro timer"

# 2. Install dependencies
npm install

# 3. Launch local development server
npm run dev
```
