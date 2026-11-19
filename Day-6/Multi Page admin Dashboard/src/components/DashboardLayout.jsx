import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

/**
 * DashboardLayout demonstrates:
 * 1. Nested Routes
 * 2. Outlet: Renders child routes dynamically while keeping Sidebar & Navbar persistent
 */
export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* <Outlet /> is where child routes get injected! */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
