import { ArrowDown, ArrowRight, Leaf, PackageCheck, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { products } from "../data/products.js";
import { useLanguage } from "../context/useLanguage.js";

const categories = ["All", "Home", "Carry", "Work"];

export default function ShopPage({ category, onCategoryChange, onExplore }) {
  const [search, setSearch] = useState("");
  const { t, categoryLabel, productText } = useLanguage();
  const visibleProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);
  const filteredProducts = visibleProducts.filter((product) =>
    `${productText(product, "name")} ${categoryLabel(product.category)} ${productText(product, "description")}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pt-12">
        <div className="relative grid min-h-[440px] overflow-hidden rounded-[28px] bg-[#e8e9df] md:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10 flex flex-col items-start justify-center px-7 py-12 sm:px-12 md:px-16">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/50 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-forest">
              <Sparkles size={13} /> {t("heroBadge")}
            </span>
            <h1 className="max-w-xl font-display text-[48px] leading-[1.02] tracking-[-0.045em] sm:text-[62px]">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-ink/65">
              {t("heroDescription")}
            </p>
            <button
              onClick={onExplore}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-forest px-5 py-3.5 text-sm text-white transition hover:bg-ink"
            >
              {t("shopCollection")} <ArrowRight className="directional-icon" size={16} />
            </button>
            <p className="mt-8 flex items-center gap-2 text-xs text-ink/50">
              <ArrowDown size={14} /> {t("madeToLast")}
            </p>
          </div>
          <div className="absolute inset-0 md:relative md:inset-auto">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85"
              alt={t("heroImageAlt")}
              className="h-full w-full object-cover object-center opacity-30 md:opacity-100"
            />
            <div className="hero-image-overlay absolute inset-0 bg-gradient-to-r from-[#e8e9df] via-[#e8e9df]/75 to-transparent md:hidden" />
            <div className="absolute bottom-6 end-6 hidden rounded-2xl bg-white/90 p-4 shadow-soft backdrop-blur md:block">
              <p className="text-xs text-ink/50">{t("designedBetter")}</p>
              <p className="mt-1 font-display text-lg">{t("goodThingsMadeWell")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.17em] text-clay">{t("collection")}</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight">{t("collectionTitle")}</h2>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <label className="relative block w-full sm:w-64">
              <Search size={16} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchProducts")}
                className="field rounded-full py-2.5 ps-10"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => onCategoryChange(item)}
                  aria-pressed={category === item}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs transition ${
                    category === item
                      ? "bg-ink text-white"
                      : "border border-ink/10 bg-white text-ink/65 hover:border-ink/30"
                  }`}
                >
                  {categoryLabel(item)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {t("productsFound", { count: filteredProducts.length })}
        </p>
        {filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="font-medium">{t("noSearchResults")}</p>
            <p className="mt-2 text-sm text-ink/55">{t("noSearchHint")}</p>
            <button
              className="mt-4 text-sm font-medium text-forest underline underline-offset-4"
              onClick={() => { setSearch(""); onCategoryChange("All"); }}
            >
              {t("clearFilters")}
            </button>
          </div>
        )}
      </section>

      <section className="border-y border-ink/5 bg-[#f0efe9]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest"><Leaf size={19} /></span>
            <div><p className="text-sm font-medium">{t("madeWithIntention")}</p><p className="mt-1 text-xs text-ink/50">{t("lighterMaterials")}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest"><PackageCheck size={19} /></span>
            <div><p className="text-sm font-medium">{t("freeShipping")}</p><p className="mt-1 text-xs text-ink/50">{t("carefullyPacked")}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-forest"><Sparkles size={19} /></span>
            <div><p className="text-sm font-medium">{t("joyGuaranteed")}</p><p className="mt-1 text-xs text-ink/50">{t("returnPromise")}</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
