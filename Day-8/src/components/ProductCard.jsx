import { ArrowUpRight, Check, Plus, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/useCart.js";
import { useLanguage } from "../context/useLanguage.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t, categoryLabel, productText, badgeLabel } = useLanguage();
  const [added, setAdded] = useState(false);
  const feedbackTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="group">
      <div className={`relative aspect-[4/4.5] overflow-hidden rounded-[20px] ${product.color}`}>
        <img
          src={product.image}
          alt={productText(product, "name")}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="product-badge absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium tracking-wide text-ink">
            {badgeLabel(product.badge)}
          </span>
        )}
        <button
          className="product-add-button absolute bottom-3 end-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-soft transition hover:bg-forest hover:text-white"
          onClick={handleAdd}
          aria-label={t("addProduct", { name: productText(product, "name") })}
        >
          <Plus size={19} strokeWidth={1.8} />
        </button>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">
            {categoryLabel(product.category)}
          </p>
          <h3 className="mt-1 font-medium">{productText(product, "name")}</h3>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink/55">
            <Star size={12} className="fill-clay text-clay" /> {product.rating}
            <span className="mx-1">·</span>
            {productText(product, "description")}
          </p>
        </div>
        <span dir="ltr" className="pt-4 text-sm font-medium">${product.price}</span>
      </div>
      <button
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-forest transition group-hover:gap-2"
        onClick={handleAdd}
        aria-live="polite"
      >
        {added ? (
          <>{t("addedToBag")} <Check size={14} /></>
        ) : (
          <>{t("addToBag")} <ArrowUpRight className="directional-icon" size={14} /></>
        )}
      </button>
    </article>
  );
}
