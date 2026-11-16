import type { Question } from "../types/quiz";

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Which hook is used to manage local state in a React function component?",
    options: ["useEffect", "useState", "useMemo", "useRef"],
    correctIndex: 1,
    explanation: "useState returns a stateful value and a setter function to trigger re-renders when updated.",
  },
  {
    id: 2,
    question: "Why should you provide a unique `key` prop when rendering lists in React?",
    options: [
      "To apply CSS Module styles automatically",
      "To help React identify which items changed, added, or removed",
      "To sort array items alphabetically",
      "To prevent components from re-rendering",
    ],
    correctIndex: 1,
    explanation: "Keys give elements a stable identity across renders so React can update the DOM efficiently.",
  },
  {
    id: 3,
    question: "How does data primarily flow between React components?",
    options: [
      "Two-way binding from child to parent",
      "Globally across all sibling components",
      "Unidirectionally from parent to child via props",
      "Directly through CSS Modules",
    ],
    correctIndex: 2,
    explanation: "React follows one-way data flow: parents pass data down via props and receive events via callbacks.",
  },
  {
    id: 4,
    question: "What is the main benefit of CSS Modules in a Vite + React project?",
    options: [
      "They automatically scope class names locally to avoid collisions",
      "They replace TypeScript interfaces at runtime",
      "They fetch external stylesheets from a CDN",
      "They eliminate the need for semantic HTML",
    ],
    correctIndex: 0,
    explanation: "CSS Modules generate unique class identifiers per component so styles never leak globally.",
  },
  {
    id: 5,
    question: "What happens when you call a state setter function with a new value in React?",
    options: [
      "The browser reloads the entire page",
      "React schedules a re-render of the component with the updated state",
      "The DOM is mutated synchronously without re-running the component",
      "All sibling components lose their state",
    ],
    correctIndex: 1,
    explanation: "Updating state queues a re-render so the UI reflects the latest state snapshot.",
  },
];