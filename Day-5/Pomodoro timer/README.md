# 🍅 Pomodoro Timer

A focused productivity timer built with **React**, **CSS Modules**, and **Component Composition**. Designed around the standard Pomodoro Technique with automatic session transitions, circular SVG progress animations, focus task management, and built-in audio notifications.

---

## ✨ Features

- **Pomodoro Cycles:** Seamless switching between **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)** with automated progression after 4 completed sessions.
- **Circular SVG Progress Ring:** Smooth animated countdown indicator calculated dynamically via SVG `strokeDashoffset`.
- **Browser Tab Countdown:** Live timer updates directly in the browser document title (e.g. `24:59 - 🍅 Focus | Pomodoro`).
- **Keyboard Shortcuts:**
  - <kbd>Space</kbd> : Start / Pause timer
  - <kbd>R</kbd> : Reset current session
- **Integrated Focus Tasks:** Add, complete, and delete current work tasks with auto-focus inputs powered by `useRef`.
- **Web Audio Chime:** Zero external asset dependencies — plays a pleasant notification chime generated on-the-fly via Web Audio API oscillators.
- **Custom Durations & Storage:** Customize interval durations in settings; all tasks, statistics, and durations persist across browser refreshes via `localStorage`.

---

## 🛠️ Tech Stack & Patterns

- **Framework:** React 19 / Vite
- **Styling:** Scoped CSS Modules (`*.module.css`) with mode-specific color themes
- **Architecture:** Modular component composition and compound component pattern
- **Key React Hooks:**
  - `useState` & `useCallback`
  - `useEffect` (timer interval engine, dynamic document title, keyboard events)
  - `useEffect` Cleanup functions (`clearInterval`, `removeEventListener`)
  - `useRef` (DOM input auto-focus)
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
