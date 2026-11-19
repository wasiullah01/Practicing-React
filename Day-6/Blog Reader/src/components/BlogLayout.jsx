import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * BlogLayout demonstrates:
 * 1. Nested Route architecture
 * 2. <Outlet />: Renders children routes while keeping Header & Footer consistent
 */
export const BlogLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
