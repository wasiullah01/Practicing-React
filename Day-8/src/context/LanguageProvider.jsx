import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./LanguageContext.js";
import { translations } from "./translations.js";

const STORAGE_KEY = "everyday-store-language";

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return savedLanguage === "ur" ? "ur" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getSavedLanguage);
  const isRTL = language === "ur";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.title = translations[language].pageTitle;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The selected language still works for the current session when storage is unavailable.
    }
  }, [language, isRTL]);

  const t = useCallback(
    (key, values = {}) => {
      const message = translations[language][key] ?? translations.en[key] ?? key;
      if (typeof message !== "string") return key;
      return message.replace(/\{\{(\w+)\}\}/g, (_, name) => values[name] ?? "");
    },
    [language],
  );

  const categoryLabel = useCallback(
    (category) =>
      translations[language].categories[category] ??
      translations.en.categories[category] ??
      category,
    [language],
  );

  const productText = useCallback(
    (product, field) =>
      translations[language].products[product.id]?.[field] ?? product[field],
    [language],
  );

  const badgeLabel = useCallback(
    (badge) => translations[language].badges[badge] ?? badge,
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL,
      t,
      categoryLabel,
      productText,
      badgeLabel,
    }),
    [language, isRTL, t, categoryLabel, productText, badgeLabel],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
