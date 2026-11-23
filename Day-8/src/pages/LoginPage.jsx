import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/useLanguage.js";

export default function LoginPage({ onLogin, onBack }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("emailError");
      return;
    }
    if (password.length < 4) {
      setError("passwordError");
      return;
    }
    onLogin({
      email: normalizedEmail,
      name: normalizedEmail
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    });
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 md:grid-cols-2">
      <div className="hidden overflow-hidden rounded-[28px] bg-moss md:block">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
          alt={t("signInImageAlt")}
          className="h-[560px] w-full object-cover"
        />
      </div>
      <div className="mx-auto w-full max-w-md">
        <button onClick={onBack} className="mb-10 inline-flex items-center gap-2 text-sm text-ink/55 hover:text-ink">
          <ArrowLeft className="directional-icon" size={16} /> {t("backToShop")}
        </button>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-moss text-forest">
          <LockKeyhole size={21} />
        </span>
        <h1 className="mt-6 font-display text-4xl tracking-tight">{t("welcomeBack")}</h1>
        <p className="mt-3 text-sm leading-6 text-ink/55">
          {t("signInDescription")}
        </p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm">
            {t("emailAddress")}
            <input
              className="field mt-2"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(event) => { setEmail(event.target.value); setError(""); }}
              required
            />
          </label>
          <label className="block text-sm">
            {t("password")}
            <input
              className="field mt-2"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(""); }}
              required
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{t(error)}</p>}
          <button type="submit" className="button-primary w-full justify-center">
            {t("signIn")} <ArrowRight className="directional-icon" size={16} />
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-ink/45">
          {t("demoSignIn")}
        </p>
      </div>
    </main>
  );
}
