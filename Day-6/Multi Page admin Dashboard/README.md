# Multi-Page Admin Dashboard (Day 6 - React Router Lab)

A modern, responsive multi-page admin dashboard built with **React**, **React Router v7**, and **Tailwind CSS**. This project demonstrates end-to-end client-side routing concepts, nested navigation layouts, search param URL synchronization, protected authentication guards, and dynamic data details.

---

![multipage admin dashboard screenshot](./video.mp4)

---
## 📁 Project Folder Structure

```text
Multi Page admin Dashboard/
├── index.html                           # HTML template with Tailwind CSS CDN & typography
├── package.json                         # Project dependencies (React 19, React Router v7)
├── vite.config.js                       # Vite configuration
├── README.md                            # Project documentation & router reference
└── src/
    ├── main.jsx                         # Application entry point with BrowserRouter & AuthProvider
    ├── App.jsx                          # Route registry (BrowserRouter, Routes, Route hierarchy)
    ├── index.css                        # Global styling rules
    │
    ├── components/                      # Reusable layout & UI components
    │   ├── DashboardLayout.jsx          # Master layout with persistent Sidebar, Navbar & <Outlet />
    │   ├── Sidebar.jsx                  # Navigation sidebar using <NavLink> with active tab styling
    │   ├── Navbar.jsx                   # Top header with dynamic breadcrumbs (<Link>) & profile avatar
    │   ├── ProtectedRoute.jsx           # Route guard redirecting unauthenticated users to /login
    │   └── Icons.jsx                    # Optimized inline SVG icons (no heavy dependencies)
    │
    ├── context/
    │   └── AuthContext.jsx              # Authentication state provider (login, logout, session persistence)
    │
    ├── data/
    │   └── mockData.js                  # Mock data for users, products catalog, and dashboard metrics
    │
    └── pages/                           # Application route views
        ├── Login.jsx                    # Login page with programmatic redirect via useNavigate
        ├── DashboardOverview.jsx        # Analytics overview with KPI cards and quick link navigation
        ├── UsersList.jsx                # Users directory with URL filters via useSearchParams (?q=&status=)
        ├── UserDetail.jsx               # Dynamic user profile page using useParams (:id) & useNavigate(-1)
        ├── ProductsList.jsx             # Inventory catalog with search & category query filters
        ├── ProductDetail.jsx            # Dynamic product inspection view using useParams (:id)
        ├── NotFound.jsx                 # 404 catch-all page (<Route path="*">) with path display & back action
        │
        └── settings/                    # Nested route module (demonstrating sub-level <Outlet />)
            ├── SettingsLayout.jsx       # Settings container with sub-tab NavLinks & child <Outlet />
            ├── ProfileSettings.jsx      # Child route: /settings/profile
            ├── SecuritySettings.jsx     # Child route: /settings/security (2FA, session timeout)
            └── NotificationSettings.jsx # Child route: /settings/notifications (alert toggles)
```

---

## 📂 Detailed Folder & File Breakdown

### 1. `src/main.jsx` & `src/App.jsx`
- **`main.jsx`**: Initializes React root and wraps the application inside `<BrowserRouter>` and `<AuthProvider>` so every sub-component can consume routing hooks and user authentication status.
- **`App.jsx`**: Declares the complete route hierarchy:
  - Public routes (`/login`)
  - Protected nested routes (`/`, `/dashboard`, `/users`, `/products`, `/settings`)
  - Sub-nested routes under `/settings` with their own default redirect to `profile`
  - Catch-all fallback route (`*`) for unmatched paths

### 2. `src/components/`
- **`DashboardLayout.jsx`**: Demonstrates the nested routing pattern. Keeps the left Sidebar and top Navbar permanently mounted across route changes while rendering active child page components via `<Outlet />`.
- **`Sidebar.jsx`**: Uses `<NavLink>` with an `isActive` callback to apply vibrant background and shadow highlighting to the currently selected route.
- **`Navbar.jsx`**: Inspects `location.pathname` to dynamically construct interactive breadcrumb links with `<Link>`.
- **`ProtectedRoute.jsx`**: Checks if the user is logged in. If not authenticated, redirects them to `/login` while attaching `state: { from: location }` so the user is returned to their target page right after signing in.
- **`Icons.jsx`**: Clean SVG icon components (dashboard, users, package, settings, shield, logout, etc.) keeping the bundle fast and self-contained.

### 3. `src/context/`
- **`AuthContext.jsx`**: Provides `user`, `isAuthenticated`, `login()`, and `logout()` across the entire app tree with `localStorage` persistence.

### 4. `src/data/`
- **`mockData.js`**: Contains structured mock data (team members, e-commerce products, revenue stats) used by the list and detail pages.

### 5. `src/pages/`
- **`Login.jsx`**: Features an authentication form. On submit, logs the user in and uses `useNavigate(from, { replace: true })` to smoothly redirect back.
- **`DashboardOverview.jsx`**: Highlights stats cards, quick links, and team shortcuts demonstrating `useNavigate` and `<Link>`.
- **`UsersList.jsx`**: Implements **`useSearchParams`**. Any search text, status dropdown change (`Active`, `Pending`, `Inactive`), or sort selection instantly updates the browser URL (e.g. `?q=ayesha&status=Active&sort=name`) so the search state is fully bookmarkable and shareable.
- **`UserDetail.jsx`**: Uses **`useParams()`** to extract `:id` from the URL, looks up the corresponding record from data, and displays back navigation with `navigate(-1)`.
- **`ProductsList.jsx` & `ProductDetail.jsx`**: Product catalog with category search params and dynamic `:id` detail views.
- **`NotFound.jsx`**: Wildcard catch-all route (`*`) that displays the exact missing path and offers one-click return to safety.

### 6. `src/pages/settings/` (Nested Subroutes)
- **`SettingsLayout.jsx`**: Renders tab links using `<NavLink>`.
- **`<Outlet />`**: Injects child tabs (`ProfileSettings`, `SecuritySettings`, `NotificationSettings`) directly beneath the tab bar without reloading the parent settings frame.

---

## 🎯 Learning Objectives Mapping

| Concept | File Location | How It's Used |
| :--- | :--- | :--- |
| **Client-Side Routing** | `src/main.jsx`, `App.jsx` | Full SPA navigation without page reload |
| **BrowserRouter, Routes, Route** | `src/App.jsx` | Master route mapping |
| **Link & NavLink** | `src/components/Sidebar.jsx`, `Navbar.jsx` | `NavLink` for active indicator; `Link` for breadcrumbs |
| **useNavigate** | `Login.jsx`, `UserDetail.jsx`, `NotFound.jsx` | Programmatic redirection & `navigate(-1)` back navigation |
| **useParams** | `UserDetail.jsx`, `ProductDetail.jsx` | Dynamic segment capture (`/users/:id`, `/products/:id`) |
| **Nested Routes & Outlet** | `DashboardLayout.jsx`, `SettingsLayout.jsx` | Parent layout wrapper and sub-tab rendering |
| **Protected Routes** | `ProtectedRoute.jsx`, `AuthContext.jsx` | Guarding authenticated areas with redirect-back state |
| **404 Not Found Page** | `NotFound.jsx` | `<Route path="*" />` handling missing URLs |
| **Filters in URL (`useSearchParams`)** | `UsersList.jsx`, `ProductsList.jsx` | Live query parameters (`?q=...&status=...`) |

---

## 🚀 How to Run the App

1. Open terminal in the project directory:
   ```powershell
   cd "F:\React\Day-6\Multi Page admin Dashboard"
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open your browser at:
   ```text
   http://localhost:5173
   ```
   *(Demo credentials: Any email e.g. `admin@nexus.dev` and any password).*
