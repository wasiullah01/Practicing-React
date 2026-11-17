import React, { useState } from 'react';
import styles from './ConceptGuide.module.css';

interface Concept {
  id: string;
  number: string;
  title: string;
  explanation: string;
  codeExample: string;
  whereInApp: string;
}

const CONCEPTS: Concept[] = [
  {
    id: 'rendering-lists',
    number: '01',
    title: 'Rendering Lists',
    explanation:
      'In React, lists are rendered using JavaScript’s Array.prototype.map() to transform an array of data objects into an array of JSX elements.',
    codeExample: `{students.map((student) => (\n  <StudentCard key={student.id} student={student} />\n))}`,
    whereInApp: 'Used in StudentList.tsx to render all filtered student cards.',
  },
  {
    id: 'keys-matter',
    number: '02',
    title: 'Keys & Why They Matter',
    explanation:
      'Keys give React elements a stable identity between renders. Without unique, stable keys (or if using array indexes when list order can change), React cannot determine whether an item was moved, inserted, or removed. This causes state bugs and unnecessary DOM re-creations.',
    codeExample: `// GOOD: Unique stable ID\n<StudentCard key={student.id} />\n\n// AVOID: Index when sorting/filtering/deleting\n<StudentCard key={index} />`,
    whereInApp: 'Every student has a unique ID (e.g. STU-1001) used as key in StudentList.',
  },
  {
    id: 'reconciliation',
    number: '03',
    title: 'Rendering & Reconciliation Basics',
    explanation:
      'When state updates, React builds a new Virtual DOM tree and diffs it with the previous one (Reconciliation). It computes minimal real-DOM mutations. When deleting or toggling a student, only that specific card node is updated/removed.',
    codeExample: `// Toggling status updates only that one student object in state\nsetStudents(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));`,
    whereInApp: 'Demonstrated when clicking "Toggle Status" or "Delete" on any card.',
  },
  {
    id: 'controlled-components',
    number: '04',
    title: 'Controlled Components',
    explanation:
      'In a controlled component, form element values (input, select, textarea) are dictated by React state. The state serves as the "single source of truth", and an onChange handler updates state on every user input.',
    codeExample: `<input\n  value={formData.fullName}\n  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}\n/>`,
    whereInApp: 'Full Name, Email, Phone, DOB, Gender, Course, and Semester in StudentForm.',
  },
  {
    id: 'uncontrolled-components',
    number: '05',
    title: 'Uncontrolled Components',
    explanation:
      'In an uncontrolled component, form data is handled directly by the DOM itself. We use React’s useRef() hook to fetch the input value on submission without causing re-renders during typing. File inputs must always be uncontrolled because file value is read-only in DOM.',
    codeExample: `const notesRef = useRef<HTMLTextAreaElement>(null);\nconst fileInputRef = useRef<HTMLInputElement>(null);\n\n// Read values directly upon submit:\nconst notes = notesRef.current?.value;`,
    whereInApp: 'Counselor Notes textarea and Student ID Card file input in StudentForm.',
  },
  {
    id: 'form-handling',
    number: '06',
    title: 'Form Handling & Submission',
    explanation:
      'Form submission intercepts browser native page reload via event.preventDefault(). We run synchronous validations, extract data from both controlled and uncontrolled inputs, dispatch actions, and reset inputs.',
    codeExample: `const handleSubmit = (e: React.FormEvent) => {\n  e.preventDefault();\n  if (!validateAll()) return;\n  onRegisterStudent(newStudent);\n  resetForm();\n};`,
    whereInApp: 'handleSubmit in StudentForm.tsx.',
  },
  {
    id: 'input-validation',
    number: '07',
    title: 'Input Validation & Error Messages',
    explanation:
      'Validates inputs against required patterns (regex for email, phone digit count, minimum age, required terms checkbox). Displays dynamic error messages, toggles ARIA accessibility attributes, and applies red border styles.',
    codeExample: `if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {\n  return 'Please enter a valid email address';\n}`,
    whereInApp: 'validateField function and FormField error display in StudentForm.tsx.',
  },
  {
    id: 'lifting-state-up',
    number: '08',
    title: 'Lifting State Up',
    explanation:
      'When two sibling components need access to the same state (e.g. StudentForm needs to add students, StudentStats needs to count them, StudentList needs to display them), the state is lifted up to their common parent (App.tsx).',
    codeExample: `// Parent App.tsx owns students state:\nconst [students, setStudents] = useState<Student[]>(INITIAL);\n\n<StudentForm onRegisterStudent={handleAdd} />\n<StudentStats students={students} />\n<StudentList students={filteredStudents} />`,
    whereInApp: 'Master students and filters state in App.tsx distributed to child components.',
  },
  {
    id: 'search-and-filter',
    number: '09',
    title: 'Search & Filter on a List',
    explanation:
      'Filtering is implemented as derived state rather than duplicate state. During render, students are filtered by search string (name, email, ID) and department/status criteria, then sorted, without mutating the original list.',
    codeExample: `const filteredStudents = useMemo(() => {\n  return students\n    .filter(s => s.fullName.toLowerCase().includes(query.toLowerCase()))\n    .filter(s => course === 'all' || s.course === course)\n    .sort(...);\n}, [students, query, course]);`,
    whereInApp: 'useMemo in App.tsx connected to StudentFilters.tsx.',
  },
  {
    id: 'composition-and-css-modules',
    number: '10',
    title: 'Component Composition & CSS Modules',
    explanation:
      'Component composition combines smaller, specialized components (Card, CardHeader, CardBody, FormField, Badge) via children props and slots. CSS Modules provide scoped, leak-free styling with *.module.css class hashing, enhanced with Tailwind CSS utilities.',
    codeExample: `// Compound Component Composition\n<Card variant="elevated">\n  <Card.Header title="Details" />\n  <Card.Body>{children}</Card.Body>\n</Card>`,
    whereInApp: 'Card.tsx, FormField.tsx, Badge.tsx, and all *.module.css files across the project.',
  },
];

export function ConceptGuide() {
  const [openId, setOpenId] = useState<string | null>('rendering-lists');

  const toggleConcept = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.guideContainer}>
      <p className={styles.intro}>
        This Student Registration project is engineered as an interactive reference for all <strong>React Day 4 Learning Objectives</strong>. Explore each section below to see the concept and where it lives in the codebase:
      </p>

      <div className={styles.conceptList}>
        {CONCEPTS.map((concept) => {
          const isOpen = openId === concept.id;
          return (
            <div key={concept.id} className={styles.conceptItem}>
              <button
                type="button"
                className={styles.conceptHeader}
                onClick={() => toggleConcept(concept.id)}
                aria-expanded={isOpen}
              >
                <div className={styles.headerLeft}>
                  <span className={styles.badge}>{concept.number}</span>
                  <span className={styles.title}>{concept.title}</span>
                </div>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className={styles.content}>
                  <p>{concept.explanation}</p>
                  <pre className={styles.codeBlock}>
                    <code>{concept.codeExample}</code>
                  </pre>
                  <div className={styles.tip}>
                    <span>📍 In this project:</span>
                    <span>{concept.whereInApp}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
