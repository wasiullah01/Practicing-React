import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCart } from "../context/useCart.js";
import { useLanguage } from "../context/useLanguage.js";

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, subtotal, removeItem, setQuantity } = useCart();
  const { t, categoryLabel, productText } = useLanguage();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocusedElement = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (
        previouslyFocusedElement instanceof HTMLElement &&
        previouslyFocusedElement.isConnected
      ) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label={t("closeCart")}
      />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute bottom-0 end-0 flex h-[min(100%,760px)] w-full max-w-[470px] flex-col bg-paper shadow-2xl sm:bottom-4 sm:end-4 sm:top-4 sm:rounded-[24px]"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{t("yourSelection")}</p>
            <h2 id="cart-title" className="mt-1 font-display text-2xl">{t("shoppingBag")}</h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-moss"
            aria-label={t("closeBag")}
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-moss text-forest">
              <ShoppingBag size={26} strokeWidth={1.5} />
            </span>
            <h3 className="mt-5 font-display text-2xl">{t("emptyCartTitle")}</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-ink/55">
              {t("emptyCartDescription")}
            </p>
            <button onClick={onClose} className="button-primary mt-6">
              {t("exploreCollection")} <ArrowRight className="directional-icon" size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    className="h-24 w-20 rounded-xl object-cover"
                    src={item.image}
                    alt={productText(item, "name")}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-medium">{productText(item, "name")}</h3>
                        <p className="mt-1 text-xs text-ink/50">{categoryLabel(item.category)}</p>
                      </div>
                      <span dir="ltr" className="text-sm font-medium">${item.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-ink/10 px-2 py-1">
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          aria-label={t("decreaseQuantity", { name: productText(item, "name") })}
                          className="p-0.5 text-ink/60 hover:text-ink"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="min-w-3 text-center text-xs">                        {item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label={t("increaseQuantity", { name: productText(item, "name") })}
                          className="p-0.5 text-ink/60 hover:text-ink"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-ink/45 underline underline-offset-2 hover:text-ink"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/10 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">{t("subtotal")}</span>
                <span dir="ltr" className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs text-ink/45">{t("shippingTaxAtCheckout")}</p>
              <button
                onClick={onCheckout}
                className="button-primary mt-5 w-full justify-center"
              >
                {t("continueCheckout")} <ArrowRight className="directional-icon" size={16} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
