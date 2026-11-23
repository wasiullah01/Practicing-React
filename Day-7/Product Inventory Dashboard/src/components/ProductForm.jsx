import { useState } from 'react'
import Icon from './Icon.jsx'
import styles from '../App.module.css'

function ProductForm({ product, isSaving, error, onClose, onSave, onSaveStock }) {
  const [title, setTitle] = useState(product?.title ?? '')
  const [brand, setBrand] = useState(product?.brand ?? '')
  const [category, setCategory] = useState(product?.category ?? '')
  const [price, setPrice] = useState(product?.price ?? '')
  const [stock, setStock] = useState(product?.stock ?? '')
  const isEditing = Boolean(product)
  const stockChanged = isEditing && Number(stock) !== product.stock

  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      title: title.trim(),
      brand: brand.trim(),
      category: category.trim().toLowerCase().replaceAll(' ', '-'),
      price: Number(price),
      stock: Number(stock),
    })
  }

  return (
    <div
      className={`${styles.modalBackdrop} fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose()
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="product-form-title" className={`${styles.modal} w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="product-form-title" className="text-lg font-semibold text-slate-900">{isEditing ? 'Edit product' : 'Add a product'}</h2>
            <p className="mt-1 text-sm text-slate-500">{isEditing ? 'Update product details and inventory.' : 'Add a new product to your inventory.'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Icon name="close" size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</div>}
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Product name</span>
              <input autoFocus required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Everyday tote bag" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10" />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Brand <span className="font-normal text-slate-400">· optional</span></span>
                <input maxLength={80} value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="Brand name" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Category</span>
                <input required maxLength={60} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. accessories" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Price</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                  <input required type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" className="h-10 w-full rounded-lg border border-slate-200 pl-7 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Units in stock</span>
                <input required type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="0" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10" />
              </label>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {isEditing && (
                <button type="button" disabled={!stockChanged || isSaving} onClick={() => onSaveStock(Number(stock))} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40">
                  <Icon name="layers" size={15} />Update stock only
                </button>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} disabled={isSaving} className="h-9 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
              <button type="submit" disabled={isSaving} className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70">
                {isSaving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {isEditing ? 'Save changes' : 'Add product'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ProductForm
