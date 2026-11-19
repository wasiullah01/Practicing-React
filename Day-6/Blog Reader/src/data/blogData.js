export const categories = [
  { id: "all", name: "All Posts", slug: "all", description: "Read all tech, architecture, and design articles." },
  { id: "react", name: "React & Architecture", slug: "react", description: "Deep dives into React 19, hooks, and scalable client-side patterns." },
  { id: "css", name: "Tailwind & Design", slug: "css", description: "Design systems, typography, responsive layouts, and UI micro-interactions." },
  { id: "performance", name: "Performance & Web", slug: "performance", description: "Bundlers, Vite optimizations, network budgets, and rendering speeds." },
  { id: "career", name: "Engineering Life", slug: "career", description: "Career journeys, mental models, code reviews, and remote software craftsmanship." }
];

export const blogPosts = [
  {
    id: "post-1",
    slug: "mastering-react-router-v7",
    title: "Mastering React Router: From Nested Outlets to Query State",
    excerpt: "Why modern single-page apps rely on URL-driven routing, nested layouts with Outlet, and using search params for bookmarkable state.",
    category: "react",
    categoryName: "React & Architecture",
    author: {
      name: "Taha Malik",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "Frontend Architect"
    },
    publishedAt: "Nov 15, 2026",
    readingTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    tags: ["React", "Routing", "SPA"],
    content: `
Client-side routing has revolutionized modern web development. Instead of full-page refreshes that demand HTML re-evaluation from a remote server on every click, client-side routers update the view instantaneously in memory.

### 1. The Declarative Router Structure
In React Router, your entire navigation tree is composed declaratively. By wrapping our application inside \`BrowserRouter\`, we gain access to routing hooks everywhere:

\`\`\`jsx
<Routes>
  <Route path="/" element={<BlogLayout />}>
    <Route index element={<HomeFeed />} />
    <Route path="posts/:slug" element={<PostDetail />} />
    <Route path="categories/:categorySlug" element={<CategoryPage />} />
  </Route>
</Routes>
\`\`\`

### 2. Nested Routing with <Outlet />
Instead of repeating headers, navigation bars, and footers across every individual page, nested routes allow you to define a parent layout. The \`<Outlet />\` component acts as a placeholder that gets dynamically filled with whichever child route matches the active URL.

### 3. Synchronizing State with URL Search Params
Why store search queries in local state when you can store them in \`useSearchParams\`? By keeping filter states in the URL, your users can copy the URL and share an exact filtered view with their teammates!
    `
  },
  {
    id: "post-2",
    slug: "building-design-systems-tailwind-css",
    title: "Crafting High-Converting Dashboards with Tailwind CSS",
    excerpt: "A practical guide to composing tokens, dark-mode color palettes, and typographic hierarchies without bloated CSS files.",
    category: "css",
    categoryName: "Tailwind & Design",
    author: {
      name: "Sara Ali",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "Product Designer"
    },
    publishedAt: "Nov 10, 2026",
    readingTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    tags: ["TailwindCSS", "UI/UX", "Design Systems"],
    content: `
Tailwind CSS provides a utility-first methodology that completely eliminates context switching between separate stylesheet files and component JSX files.

### Design Tokens vs Hardcoded Values
When building production interfaces, consistency is the key differentiator between amateur setups and polished software products:

- **Consistent Spacing**: Rely strictly on Tailwind's 4px grid scale (\`p-2\`, \`p-4\`, \`gap-6\`).
- **Carefully Crafted Contrast**: Dark themes shouldn't use pure \`#000000\`. Slate tones like \`bg-slate-950\` and \`bg-slate-900\` paired with subtle border strokes (\`border-slate-800\`) give depth and polish.
- **Micro-Interactions**: Use transition classes such as \`transition-all duration-200 hover:-translate-y-0.5\` to make cards feel tactile and alive.
    `
  },
  {
    id: "post-3",
    slug: "vite-speed-secrets-optimizing-react-apps",
    title: "Vite Internals: Why Modern Frontend Builds Run in Milliseconds",
    excerpt: "How native ES modules and esbuild replaced legacy bundling during development, transforming the developer experience forever.",
    category: "performance",
    categoryName: "Performance & Web",
    author: {
      name: "Hamza Malik",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      role: "DevOps Engineer"
    },
    publishedAt: "Nov 02, 2026",
    readingTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    tags: ["Vite", "ESModules", "BuildTools"],
    content: `
For years, JavaScript developers waited up to minutes for Webpack bundles to recompile on every code modification. Vite fundamentally changed this paradigm.

### The No-Bundle Dev Server
During development, Vite serves your source code over native ES Modules (ESM). That means your browser requests files on demand, and Vite only transforms the files that were actually requested!

### Blazing Fast Pre-Bundling
Third-party dependencies (like \`react\`, \`react-router-dom\`) are pre-bundled once using **esbuild** (written in Go), which performs 10x-100x faster than traditional JavaScript-based bundlers.
    `
  },
  {
    id: "post-4",
    slug: "senior-engineer-mental-models",
    title: "7 Mental Models Every Senior Frontend Developer Uses Daily",
    excerpt: "Technical skill gets you in the door; strategic problem decomposition and edge-case intuition elevate you to senior leadership.",
    category: "career",
    categoryName: "Engineering Life",
    author: {
      name: "Ayesha Khan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      role: "Principal Tech Lead"
    },
    publishedAt: "Oct 28, 2026",
    readingTime: "8 min read",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    tags: ["Leadership", "Career", "Mindset"],
    content: `
Writing code is rarely the hardest part of software engineering. The real challenge is managing system complexity over time while communicating effectively across teams.

### 1. Inversion of Control
Before building a tightly coupled monolith component, ask yourself: Can the caller pass what needs to be rendered?

### 2. The Fallacy of Premature Abstraction
Duplicate code is far cheaper than the wrong abstraction. Wait until three distinct use-cases emerge before creating shared utilities.

### 3. URL as the Single Source of Truth
If a user can refresh the page and lose their active tab, filter query, or modal state, you are missing out on the biggest superpower of the web platform: **The URL**.
    `
  }
];
