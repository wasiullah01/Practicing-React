# React Quiz App

An interactive, responsive Quiz Application built with **React**, **TypeScript**, **Vite**, and **CSS Modules**. Test your knowledge of core React concepts with instant explanations, keyboard shortcuts, and detailed score summaries.

---

## 🚀 Features

- **Interactive Multiple-Choice Questions**: Carefully designed questions focusing on React fundamentals (hooks, keys, data flow, CSS Modules, and state updates).
- **Keyboard Navigation**:
  - `A` – `D` or `1` – `4`: Select an option.
  - `Enter ↵`: Advance to the next question or view the score.
- **Immediate Feedback & Explanations**: Instant visual indicators (green for correct, red for incorrect) accompanied by clear explanations.
- **Question Shuffle**: Optional toggle to randomize question order for a fresh challenge every attempt.
- **Live Visual Progress**: Segmented progress bar tracking completed questions and answer accuracy in real time.
- **Score & Review Screen**: Comprehensive post-quiz breakdown showing percentage accuracy, total score, and a question-by-question review with correct answers.
- **Scoped Styling**: Fully modular CSS using CSS Modules for zero style leakage and responsive mobile-first layouts.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Styling**: CSS Modules

---

## 📁 Project Structure

```text
Quiz App/
├── index.html              # HTML entry point
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite configuration
└── src/
    ├── main.tsx            # Application entry point
    ├── App.tsx             # Main quiz state management & workflow
    ├── App.css             # Global base styles & reset
    ├── Components/
    │   ├── AppShell.tsx            # Central layout container & headers
    │   ├── AppShell.module.css
    │   ├── StartScreen.tsx         # Welcome screen & shuffle toggle
    │   ├── StartScreen.module.css
    │   ├── QuizCard.tsx            # Question display, options & keyboard input
    │   ├── QuizCard.module.css
    │   ├── QuizProgress.tsx        # Segmented progress bar & score counter
    │   ├── QuizProgress.module.css
    │   ├── ScoreScreen.tsx         # Final results summary & answer breakdown
    │   └── ScoreScreen.module.css
    ├── data/
    │   └── questions.ts    # Question dataset & explanations
    └── types/
        └── quiz.ts         # TypeScript interfaces & types
```

---

## 💻 Getting Started

### Prerequisites

- Node.js (version 18+ recommended)
- npm or pnpm

### Installation

1. Navigate to the project directory:
   ```bash
   cd "f:/React/Day-3/Quiz App"
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

### Available Scripts

- **Start development server**:
  ```bash
  npm run dev
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
- **Preview production build locally**:
  ```bash
  npm run preview
  ```

---

## ⌨️ Keyboard Controls

| Key | Action |
| --- | --- |
| <kbd>A</kbd> / <kbd>1</kbd> | Select Option A |
| <kbd>B</kbd> / <kbd>2</kbd> | Select Option B |
| <kbd>C</kbd> / <kbd>3</kbd> | Select Option C |
| <kbd>D</kbd> / <kbd>4</kbd> | Select Option D |
| <kbd>Enter ↵</kbd> | Next question / View results |
