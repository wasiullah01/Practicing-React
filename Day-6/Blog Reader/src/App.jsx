import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BlogLayout } from './components/BlogLayout';
import { HomeFeed } from './pages/HomeFeed';
import { PostDetail } from './pages/PostDetail';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogLayout />}>
        <Route index element={<HomeFeed />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:categorySlug" element={<CategoriesPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
