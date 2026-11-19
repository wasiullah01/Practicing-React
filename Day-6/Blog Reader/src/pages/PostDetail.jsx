import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import { ArrowLeft, Clock, Tag } from '../components/Icons';

/**
 * PostDetail demonstrates:
 * 1. Dynamic route lookup using `useParams()` (:slug)
 * 2. Back button navigation using `useNavigate(-1)`
 * 3. Not found handling for nonexistent post slugs
 */
export const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="text-center py-20 bg-slate-900/60 rounded-2xl border border-slate-800 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-white">Post Not Found</h2>
        <p className="text-sm text-slate-400 mt-2">
          No article found for slug: <code className="text-rose-400 font-mono">{slug}</code>
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition hover:border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          Route Hook: <code className="text-emerald-400">useParams().slug = {slug}</code>
        </span>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <Link
          to={`/categories/${post.category}`}
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
        >
          {post.categoryName}
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-white font-semibold text-sm">{post.author.name}</p>
              <p className="text-[11px] text-slate-400">{post.author.role}</p>
            </div>
          </div>
          <span>&bull;</span>
          <span>{post.publishedAt}</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full max-h-96 object-cover"
        />
      </div>

      {/* Post Content */}
      <div className="prose prose-invert max-w-none text-slate-300 space-y-5 leading-relaxed text-base">
        {post.content.trim().split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-white pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('```')) {
            return (
              <pre key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-emerald-300 font-mono overflow-x-auto">
                <code>{paragraph.replace(/```(jsx|)/g, '')}</code>
              </pre>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Tags & Explore other posts */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Tagged:</span>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/?tag=${tag}`}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-800 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Explore more from {post.categoryName}</p>
            <p className="text-xs text-slate-400">Discover related tutorials and technical write-ups.</p>
          </div>
          <Link
            to={`/categories/${post.category}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
          >
            View Category &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};
