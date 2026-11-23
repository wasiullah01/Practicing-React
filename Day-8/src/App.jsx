import { useCallback, useEffect, useState } from "react";
import CartDrawer from "./components/CartDrawer.jsx";
import Header from "./components/Header.jsx";
import { useCart } from "./context/useCart.js";
import { useLanguage } from "./context/useLanguage.js";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";

const USER_STORAGE_KEY = "everyday-store-user";

function loadUser() {
  try {
    const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [page, setPage] = useState("shop");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(loadUser);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { clearCart } = useCart();
  const { isRTL, t } = useLanguage();
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  function navigate(nextPage, nextCategory) {
    if (nextCategory) setCategory(nextCategory);
    setPage(nextPage);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeOrder() {
    clearCart();
    setOrderPlaced(true);
    setPage("shop");
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={`min-h-screen bg-paper text-ink ${isRTL ? "locale-ur" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
      lang={isRTL ? "ur" : "en"}
    >
      <Header
        page={page}
        user={user}
        onNavigate={navigate}
        onOpenCart={openCart}
      />
      {orderPlaced && (
        <div role="status" className="mx-auto mt-5 flex max-w-7xl items-center justify-between gap-4 rounded-xl bg-moss px-5 py-4 text-sm text-forest sm:mx-8">
          <span>{t("orderComplete")}</span>
          <button onClick={() => setOrderPlaced(false)} className="text-xs underline underline-offset-2">{t("dismiss")}</button>
        </div>
      )}
      {page === "shop" && (
        <ShopPage
          category={category}
          onCategoryChange={setCategory}
          onExplore={() => {
            setCategory("All");
            document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
      {page === "login" && (
        <LoginPage
          onLogin={(nextUser) => {
            setUser(nextUser);
            navigate("shop");
          }}
          onBack={() => navigate("shop")}
        />
      )}
      {page === "checkout" && (
        <CheckoutPage
          user={user}
          onNavigate={navigate}
          onComplete={completeOrder}
        />
      )}
      <footer className="border-t border-ink/5 px-5 py-8 text-center text-xs text-ink/45 sm:px-8">
        <span className="font-display text-base text-ink">everyday</span>
        <span className="mx-2">·</span> {t("footerTagline")}
      </footer>
      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        onCheckout={() => navigate("checkout")}
      />
    </div>
  );
}
