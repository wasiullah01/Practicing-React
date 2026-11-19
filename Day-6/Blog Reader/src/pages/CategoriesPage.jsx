import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { categories, blogPosts } from '../data/blogData';
import { ArrowRight, ArrowLeft } from '../components/Icons';

/**
 * CategoriesPage demonstrates:
 * 1. Overview of all categories
 * 2. Dynamic route with optional/specific category slug: /categories/:categorySlug
 * 3. Quick filtering directly from the category card
 */
export const CategoriesPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  // If a specific category slug is in the URL, display filtered posts
  if (categorySlug && categorySlug !== 'all') {
    const selected = categories.find((c) => c.slug === categorySlug);
    const categoryPosts = blogPosts.filter((p) => p.category === categorySlug);

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            Param: <code className="text-emerald-400">useParams().categorySlug = {categorySlug}</code>
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Category
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            {selected ? selected.name : categorySlug}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {selected?.description || 'Browse curated posts in this topic.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryPosts.length === 0 ? (
            <p className="text-sm text-slate-400">No posts in this category yet.</p>
          ) : (
            categoryPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs text-slate-400">{post.publishedAt}</span>
                  <h3 className="text-lg font-bold text-white mt-1 hover:text-emerald-400 transition">
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">{post.readingTime}</span>
                  <Link
                    to={`/posts/${post.slug}`}
                    className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    Read article &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // All categories listing
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Categories Directory</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore articles grouped by technical discipline. Click a category to view its dedicated dynamic route.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.filter((c) => c.slug !== 'all').map((cat) => {
          const count = blogPosts.filter((p) => p.category === cat.slug).length;
          return (
            <div
              key={cat.slug}
              className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                    <Link to={`/categories/${cat.slug}`}>{cat.name}</Link>
                  </h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                    {count} {count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  to={`/?category=${cat.slug}`}
                  className="text-xs text-slate-400 hover:text-white transition"
                >
                  Filter in Feed
                </Link>
                <Link
                  to={`/categories/${cat.slug}`}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                >
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
