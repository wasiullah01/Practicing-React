import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts, categories } from '../data/blogData';
import { Search, Clock, Tag, ArrowRight } from '../components/Icons';

/**
 * HomeFeed demonstrates:
 * 1. URL search params using `useSearchParams` (?search=..., ?category=..., ?tag=...)
 * 2. Instant bookmarkable & shareable search state
 * 3. Link navigation to dynamic post details
 */
export const HomeFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedTag = searchParams.get('tag') || '';

  const updateFilters = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Filter posts based on URL query state
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;

    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="space-y-10">
      {/* Hero Intro */}
      <section className="text-center max-w-2xl mx-auto pt-4 space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Client-Side Routing Showcase
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Modern Engineering Chronicles
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Explore architectural deep dives, UI systems, and client routing with React Router.
        </p>
      </section>

      {/* Filter & Search Bar synced with URL (useSearchParams) */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, topic, or author..."
              value={searchQuery}
              onChange={(e) => updateFilters('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => updateFilters('category', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges & Query Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium">URL Query:</span>
            <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded font-mono border border-slate-800">
              {searchParams.toString() ? `?${searchParams.toString()}` : '(none)'}
            </code>

            {selectedTag && (
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                #{selectedTag}
                <button onClick={() => updateFilters('tag', '')} className="hover:text-white">
                  &times;
                </button>
              </span>
            )}
          </div>

          {searchParams.toString() && (
            <button
              onClick={handleClearFilters}
              className="text-rose-400 hover:text-rose-300 font-medium transition"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-lg font-semibold text-slate-300">No matching articles found</p>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search term or clearing filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition duration-200 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <Link
                      to={`/categories/${post.category}`}
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/20 hover:bg-slate-950 transition"
                    >
                      {post.categoryName}
                    </Link>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                      <span>{post.publishedAt}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {post.readingTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition leading-snug">
                      <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-sm text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.map((t) => (
                        <button
                          key={t}
                          onClick={() => updateFilters('tag', t)}
                          className="px-2 py-0.5 text-[11px] font-medium bg-slate-800/80 text-slate-300 hover:text-emerald-400 rounded-md transition"
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 pt-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-300">{post.author.name}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/posts/${post.slug}`)}
                    className="pt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
