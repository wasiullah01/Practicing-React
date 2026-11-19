import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import { Search, Package, ChevronRight } from '../components/Icons';

/**
 * ProductsList demonstrates:
 * 1. Filtering by Category & Price using `useSearchParams`
 * 2. Dynamic links to `/products/:id`
 */
export const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const querySearch = searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const queryMaxPrice = searchParams.get('maxPrice') || '';

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const filteredProducts = mockProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(querySearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(querySearch.toLowerCase()) ||
      p.description.toLowerCase().includes(querySearch.toLowerCase());
    const matchesCategory = queryCategory === 'All' || p.category === queryCategory;
    const matchesPrice = !queryMaxPrice || p.price <= Number(queryMaxPrice);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <p className="text-sm text-slate-400">
            Catalog filtering controlled by URL query parameters
          </p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          Showing <strong className="text-white">{filteredProducts.length}</strong> items
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={querySearch}
              onChange={(e) => updateFilters('q', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>

          <div>
            <select
              value={queryCategory}
              onChange={(e) => updateFilters('category', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Accessories">Accessories</option>
              <option value="Monitors">Monitors</option>
              <option value="Audio">Audio</option>
            </select>
          </div>

          <div>
            <select
              value={queryMaxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Price</option>
              <option value="100">Under $100</option>
              <option value="500">Under $500</option>
              <option value="1000">Under $1,000</option>
              <option value="2000">Under $2,000</option>
            </select>
          </div>
        </div>

        {searchParams.toString() && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs">
            <span className="text-slate-400">
              Active query: <code className="text-indigo-300 font-mono">?{searchParams.toString()}</code>
            </span>
            <button
              onClick={() => setSearchParams({})}
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
                  {p.category}
                </span>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition">
                    <Link to={`/products/${p.id}`}>{p.name}</Link>
                  </h3>
                  <span className="text-emerald-400 font-bold text-base">${p.price}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                  <span>SKU: {p.sku}</span>
                  <span
                    className={`font-semibold ${
                      p.stock > 10 ? 'text-emerald-400' : p.stock > 0 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {p.status} ({p.stock})
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => navigate(`/products/${p.id}`)}
                className="w-full py-2 bg-slate-700/70 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>View Product Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
