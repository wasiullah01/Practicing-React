import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Protection
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Top-level Pages
import { Login } from './pages/Login';
import { DashboardOverview } from './pages/DashboardOverview';
import { UsersList } from './pages/UsersList';
import { UserDetail } from './pages/UserDetail';
import { ProductsList } from './pages/ProductsList';
import { ProductDetail } from './pages/ProductDetail';
import { NotFound } from './pages/NotFound';

// Settings Nested Pages
import { SettingsLayout } from './pages/settings/SettingsLayout';
import { ProfileSettings } from './pages/settings/ProfileSettings';
import { SecuritySettings } from './pages/settings/SecuritySettings';
import { NotificationSettings } from './pages/settings/NotificationSettings';

/**
 * App Component demonstrates all core React Router concepts:
 * 1. BrowserRouter (rendered in main.jsx)
 * 2. Routes & Route definitions
 * 3. ProtectedRoute wrapper guarding authenticated areas
 * 4. Nested routes with <Outlet /> for layouts and tab views
 * 5. Dynamic routes with :id (useParams)
 * 6. Wildcard 404 Not Found route (*)
 */
export default function App() {
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={<Login />} />

      {/* Root redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Dashboard Area (Nested Route with Persistent Layout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* /dashboard */}
        <Route path="dashboard" element={<DashboardOverview />} />

        {/* /users and dynamic /users/:id (useParams & useSearchParams) */}
        <Route path="users" element={<UsersList />} />
        <Route path="users/:id" element={<UserDetail />} />

        {/* /products and dynamic /products/:id */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/:id" element={<ProductDetail />} />

        {/* Nested Settings Subroutes with child Outlet */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="notifications" element={<NotificationSettings />} />
        </Route>
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
