import { useState } from 'react';
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
    id: 'conditional-fields',
    number: '01',
    title: 'Conditional Fields & Dynamic Rendering',
    explanation:
      'Conditional rendering displays or hides specific form fields based on other state values (e.g. experience level, work arrangement, or visa sponsorship). When the condition is false, those fields are excluded from both the DOM and form validation.',
    codeExample: `{formData.experienceType === 'experienced' && (\n  <FormField label="Current Company">\n    <input value={formData.currentCompany} onChange={handleChange} />\n  </FormField>\n)}`,
    whereInApp: 'JobApplicationForm.tsx: Toggling between Experienced vs Fresh Graduate, Remote vs On-site, and Visa Sponsorship.',
  },
  {
    id: 'controlled-components',
    number: '02',
    title: 'Controlled Components & State as Single Source of Truth',
    explanation:
      'Form inputs receive their current value from React state and invoke an onChange callback to update state. This allows immediate validation, synchronous derived logic, and conditional branch rendering.',
    codeExample: `const [formData, setFormData] = useState(INITIAL);\n\n<input\n  value={formData.fullName}\n  onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}\n/>`,
    whereInApp: 'All primary and conditional fields in JobApplicationForm.tsx.',
  },
  {
    id: 'uncontrolled-components',
    number: '03',
    title: 'Uncontrolled Components (useRef)',
    explanation:
      'Uncontrolled components maintain their state directly in the DOM. We use useRef() to access values on demand during submit. In HTML/React, file inputs MUST be uncontrolled because the file value cannot be programmatically set.',
    codeExample: `const resumeInputRef = useRef<HTMLInputElement>(null);\nconst coverLetterRef = useRef<HTMLTextAreaElement>(null);\n\n// Read values directly on submit without re-rendering:\nconst file = resumeInputRef.current?.files?.[0];`,
    whereInApp: 'Resume File Upload & Executive Cover Note in JobApplicationForm.tsx.',
  },
  {
    id: 'rendering-lists-keys',
    number: '04',
    title: 'Rendering Lists & Keys and Why They Matter',
    explanation:
      'React uses keys during reconciliation to identify which list items were changed, inserted, or removed. A stable, unique ID (like application.id) ensures React efficiently updates only modified cards rather than recreating the whole list.',
    codeExample: `// Use stable business key (APP-2026-101)\n{applications.map((app) => (\n  <ApplicationCard key={app.id} application={app} />\n))}`,
    whereInApp: 'ApplicationList.tsx rendering application cards with visible key tags.',
  },
  {
    id: 'reconciliation',
    number: '05',
    title: 'Rendering and Reconciliation Basics',
    explanation:
      'When state changes (e.g. clicking "Advance Status"), React constructs a new Virtual DOM fiber tree, compares it with the previous snapshot, and performs minimal surgical DOM updates.',
    codeExample: `setApplications(prev =>\n  prev.map(app => app.id === id ? { ...app, status: nextStatus } : app)\n);`,
    whereInApp: 'handleToggleStatus and handleDelete in App.tsx and ApplicationCard.tsx.',
  },
  {
    id: 'form-handling-validation',
    number: '06',
    title: 'Form Handling & Dynamic Input Validation',
    explanation:
      'Intercepts browser submission with event.preventDefault(). Implements conditional validation where fields like currentCompany are ONLY validated if the candidate selected "Experienced".',
    codeExample: `if (formData.experienceType === 'experienced') {\n  if (!formData.currentCompany) errors.currentCompany = 'Company is required';\n}`,
    whereInApp: 'validateField and handleSubmit in JobApplicationForm.tsx.',
  },
  {
    id: 'lifting-state-up',
    number: '07',
    title: 'Lifting State Up',
    explanation:
      'Shared data (applications list, search queries, selected filters) is kept at the top-level parent App.tsx, which passes state and callbacks down to siblings (Form, Stats, Filters, List).',
    codeExample: `// Parent App.tsx owns applications and filter state:\n<JobApplicationForm onSubmitApplication={handleAdd} />\n<ApplicationStats applications={applications} />\n<ApplicationList applications={filteredList} />`,
    whereInApp: 'App.tsx manages the shared state across all subcomponents.',
  },
  {
    id: 'search-and-filter',
    number: '08',
    title: 'Search & Filter on a List',
    explanation:
      'Filtering is computed as derived state via useMemo without mutating the original applications array. Supports multiple simultaneous filter dimensions: search query, position, status, arrangement, and experience.',
    codeExample: `const filtered = useMemo(() => {\n  return apps.filter(a => matchesSearch(a) && matchesFilters(a));\n}, [apps, filters]);`,
    whereInApp: 'App.tsx useMemo hook connected to ApplicationFilters.tsx.',
  },
  {
    id: 'component-composition-css-modules',
    number: '09',
    title: 'Component Composition & CSS Modules',
    explanation:
      'Deconstructs UI into modular compound components (Card, CardHeader, CardBody, FormField, Badge, Modal). Each component is styled with isolated *.module.css classes combined with Tailwind utilities.',
    codeExample: `<Card variant="elevated">\n  <Card.Header title="Candidate" />\n  <Card.Body>{children}</Card.Body>\n</Card>`,
    whereInApp: 'Card.tsx, FormField.tsx, Modal.tsx, and all *.module.css files.',
  },
];

export function ConceptGuide() {
  const [openId, setOpenId] = useState<string | null>('conditional-fields');

  const toggleConcept = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.guideContainer}>
      <p className={styles.intro}>
        This project illustrates <strong>Conditional Form Rendering</strong> alongside all Day 4 React fundamentals. Click below to inspect each concept:
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
