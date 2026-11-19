#  React Day 6 — Client-Side Routing & Multi-Page Apps

Welcome to **Day 6**! This directory contains two multi-page React applications built with **React Router v7** and **Tailwind CSS**, demonstrating modern client-side routing, nested layouts, URL query parameters, protected routes, and dynamic segments.

---

##  Projects in This Folder

| Directory | Project Name | Focus |
| :--- | :--- | :--- |
| **[`/Multi Page admin Dashboard`](./Multi%20Page%20admin%20Dashboard)** | Multi-Page Admin Dashboard | Protected authentication, nested sub-tabs, full CRUD views, and query filters. |
| **[`/Blog Reader`](./Blog%20Reader)** | DevChronicles Blog Reader | Content-driven SPA, dynamic slug routing, categories catalog, and search parameters. |

---

## 1.  Multi-Page Admin Dashboard (`/Multi Page admin Dashboard`)

A comprehensive administrative control panel showcasing advanced enterprise dashboard routing patterns.

### ? What It Does & What's Inside:
- **Authentication & Protected Routes:** Simulated login flow guarding admin pages (`/dashboard`, `/users`, `/products`, `/settings`). Redirects unauthenticated visitors to `/login` and remembers their target URL.
- **Nested Layout & `<Outlet />`:** Persistent sidebar and top navbar layout with dynamic nested page rendering.
- **URL Filters (`useSearchParams`):** Real-time directory filters (`?q=...&status=...&sort=...`) for shareable and bookmarkable searches.
- **Dynamic Profiles (`useParams`):** Detail views (`/users/:id`, `/products/:id`) loading dynamic records on the fly.
- **Sub-Tab Navigation:** Nested settings area (`/settings/profile`, `/settings/security`, `/settings/notifications`) using child `<Outlet />` and active `<NavLink>` indicators.
- **404 Catch-All:** Custom route fallback (`*`) displaying the missing path with return-to-safety actions.

```bash
cd "F:\React\Day-6\Multi Page admin Dashboard"
npm run dev
```

---

## 2.  DevChronicles — Blog Reader (`/Blog Reader`)

A modern, fast technical blog reader designed around clean reader experiences and content discovery.

### ? What It Does & What's Inside:
- **Feed with Live Query State:** Article feed synchronized with URL query params (`?q=...&category=...&tag=...`) via `useSearchParams`.
- **Dynamic Post Reading (`/posts/:slug`):** Dynamic article view using `useParams` for slug lookup, featuring formatted markdown-like prose, author metadata, and reading times.
- **Category Directory (`/categories` & `/categories/:categorySlug`):** Browse topics by technical discipline with dedicated dynamic sub-views.
- **Clean UI & Navigation:** Active nav state with `<NavLink>`, persistent layout shell via `<Outlet />`, back navigation with `useNavigate(-1)`, and custom 404 page.

```bash
cd "F:\React\Day-6\Blog Reader"
npm run dev
```
