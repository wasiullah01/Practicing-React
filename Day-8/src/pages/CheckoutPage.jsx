import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/useCart.js";
import { useLanguage } from "../context/useLanguage.js";

export default function CheckoutPage({ user, onNavigate, onComplete }) {
  const { items, subtotal } = useCart();
  const { t, productText } = useLanguage();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) {
      setError("emptyBagError");
      return;
    }
    if (Object.values(form).some((value) => !value.trim())) {
      setError("completeFieldsError");
      return;
    }
    onComplete();
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl flex-col items-center justify-center px-5 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-moss text-forest"><Check size={26} /></span>
        <h1 className="mt-5 font-display text-4xl">{t("emptyBagTitle")}</h1>
        <p className="mt-2 text-sm text-ink/55">{t("emptyBagDescription")}</p>
        <button onClick={() => onNavigate("shop")} className="button-primary mt-6">{t("backToShop")} <ArrowRight className="directional-icon" size={16} /></button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <button onClick={() => onNavigate("shop")} className="mb-8 inline-flex items-center gap-2 text-sm text-ink/55 hover:text-ink">
        <ArrowLeft className="directional-icon" size={16} /> {t("continueShopping")}
      </button>
      <div className="grid gap-12 lg:grid-cols-[1fr_390px]">
        <section>
          <p className="text-xs uppercase tracking-[0.17em] text-clay">{t("almostYours")}</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">{t("checkout")}</h1>
          <form id="checkout-form" onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-7">
            <div>
              <h2 className="font-medium">{t("contactInformation")}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm sm:col-span-2">{t("emailAddress")}
                  <input className="field mt-2" name="email" type="email" dir="ltr" autoComplete="email" value={form.email} onChange={updateField} required />
                </label>
                <label className="text-sm sm:col-span-2">{t("fullName")}
                  <input className="field mt-2" name="name" autoComplete="name" value={form.name} onChange={updateField} required />
                </label>
              </div>
            </div>
            <div>
              <h2 className="font-medium">{t("shippingAddress")}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm sm:col-span-2">{t("streetAddress")}
                  <input className="field mt-2" name="address" autoComplete="street-address" value={form.address} onChange={updateField} required />
                </label>
                <label className="text-sm">{t("city")}
                  <input className="field mt-2" name="city" autoComplete="address-level2" value={form.city} onChange={updateField} required />
                </label>
                <label className="text-sm">{t("postalCode")}
                  <input className="field mt-2" name="postalCode" dir="ltr" autoComplete="postal-code" value={form.postalCode} onChange={updateField} required />
                </label>
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{t(error)}</p>}
            <button type="submit" className="button-primary">
              {t("placeOrder")} <ArrowRight className="directional-icon" size={16} />
            </button>
            <p className="flex items-center gap-2 text-xs text-ink/45"><LockKeyhole size={13} /> {t("demoPayment")}</p>
          </form>
        </section>

        <aside className="h-fit rounded-[22px] bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl">{t("orderSummary")}</h2>
          <div className="mt-5 space-y-4 border-b border-ink/10 pb-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative">
                  <img src={item.image} alt={productText(item, "name")} className="h-16 w-14 rounded-lg object-cover" />
                  <span className="absolute -end-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] text-white">{item.quantity}</span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 text-sm">
                  <span>{productText(item, "name")}</span><span dir="ltr">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 py-5 text-sm">
            <div className="flex justify-between text-ink/55"><span>{t("subtotal")}</span><span dir="ltr">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-ink/55"><span>{t("shipping")}</span><span dir="ltr">{subtotal >= 75 ? t("free") : "$6.00"}</span></div>
            <div className="flex justify-between text-ink/55"><span>{t("estimatedTax")}</span><span dir="ltr">${(subtotal * 0.08).toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-medium text-ink">
              <span>{t("total")}</span><span dir="ltr">${(subtotal + (subtotal >= 75 ? 0 : 6) + subtotal * 0.08).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
