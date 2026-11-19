import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">DevChronicles</span>
          <span>&bull;</span>
          <span>A React Router v7 Case Study</span>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-emerald-400 transition">Posts</Link>
          <Link to="/categories" className="hover:text-emerald-400 transition">Categories</Link>
          <Link to="/about" className="hover:text-emerald-400 transition">About the Architecture</Link>
        </div>
      </div>
    </footer>
  );
};
