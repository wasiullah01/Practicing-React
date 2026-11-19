import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProducts } from '../data/mockData';
import { ArrowLeft, Package, CheckCircle } from '../components/Icons';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400 mt-2">
          No item matching ID: <code className="text-rose-400 font-mono">{id}</code>
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3.5 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
        <span className="text-xs text-slate-400">
          Dynamic Param: <code className="text-indigo-300 font-mono">useParams().id = {id}</code>
        </span>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
        <div className="h-80 md:h-full bg-slate-900 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 rounded-full text-xs font-semibold text-white">
            {product.category}
          </span>
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-white">{product.name}</h1>
              <span className="text-2xl font-extrabold text-emerald-400">${product.price}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">SKU: {product.sku} &bull; Rating: {product.rating} ★</p>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Stock Availability:</span>
                <span className="font-semibold text-emerald-400">{product.stock} units available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inventory Status:</span>
                <span className="font-semibold text-white">{product.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Warehouse Location:</span>
                <span className="font-semibold text-slate-200">Zone B, Shelf 14</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => alert(`Product ${product.name} edited!`)}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/30"
            >
              Update Stock / Pricing
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-semibold transition"
            >
              Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
