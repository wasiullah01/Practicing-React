import { ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "../context/useCart.js";
import { useLanguage } from "../context/useLanguage.js";

export default function Header({ page, onNavigate, onOpenCart, user }) {
  const { itemCount } = useCart();
  const { language, setLanguage, t, categoryLabel } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-3 sm:px-8">
        <button
          className="flex items-center gap-2 text-start"
          onClick={() => onNavigate("shop")}
          aria-label={t("everydayHome")}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-white">
            <span className="font-display text-xl">e</span>
          </span>
          <span className="brand-wordmark font-display text-[22px] tracking-tight">everyday</span>
        </button>

        <nav className="hidden items-center gap-8 text-sm text-ink/70 md:flex">
          <button
            className={page === "shop" ? "text-ink" : "hover:text-ink"}
            onClick={() => onNavigate("shop")}
          >
            {t("shopAll")}
          </button>
          <button className="hover:text-ink" onClick={() => onNavigate("shop", "Home")}>
            {categoryLabel("Home")}
          </button>
          <button className="hover:text-ink" onClick={() => onNavigate("shop", "Carry")}>
            {categoryLabel("Carry")}
          </button>
          <button className="hover:text-ink" onClick={() => onNavigate("shop", "Work")}>
            {categoryLabel("Work")}
          </button>
        </nav>

        <div className="flex items-center gap-1 sm:gap-4">
          <label className="sr-only" htmlFor="language-switcher">{t("language")}</label>
          <select
            id="language-switcher"
            className="rounded-full border border-ink/10 bg-white px-2 py-2 text-xs text-ink focus-visible:outline-2 focus-visible:outline-forest sm:px-3"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label={t("language")}
          >
            <option value="en">English</option>
            <option value="ur">اردو</option>
          </select>
          <button
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-ink/70 transition hover:bg-white hover:text-ink sm:flex"
            onClick={() => onNavigate(user ? "shop" : "login")}
          >
            <UserRound size={17} strokeWidth={1.7} />
            <span>{user ? user.name.split(" ")[0] : t("signIn")}</span>
          </button>
          <button
            className="relative flex items-center gap-2 rounded-full bg-ink px-3 py-2.5 text-sm text-white transition hover:bg-forest sm:px-4"
            onClick={onOpenCart}
            aria-label={t("openCart", { count: itemCount })}
          >
            <ShoppingBag size={17} strokeWidth={1.8} />
            <span className="hidden sm:inline">{t("bag")}</span>
            <span
              aria-live="polite"
              className="grid h-5 min-w-5 place-items-center rounded-full bg-white/15 px-1 text-[11px]"
            >
              {itemCount}
            </span>
          </button>
          <button
            className="rounded-full p-2 text-ink/70 hover:bg-white sm:hidden"
            onClick={() => onNavigate(user ? "shop" : "login")}
            aria-label={user ? t("signedInAs", { name: user.name }) : t("signIn")}
          >
            <UserRound size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
