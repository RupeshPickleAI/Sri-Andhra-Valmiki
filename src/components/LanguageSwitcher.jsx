// src/components/LanguageSwitcher.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({
  className = "",
  variant = "frost", // ✅ default to gentle frosted look
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const btnClass =
    variant === "frost"
      ? // ✅ Best for banners (gentle + clean + always visible)
        "bg-white/75 hover:bg-white/85 text-slate-900 border-white/70 shadow-xl ring-1 ring-black/10 backdrop-blur-md"
      : variant === "glass"
      ? // lighter glass (less transparent than before)
        "bg-white/55 hover:bg-white/65 text-slate-900 border-white/60 shadow-lg ring-1 ring-black/10 backdrop-blur-md"
      : variant === "light"
      ? // for very dark backgrounds
        "bg-black/35 hover:bg-black/45 text-white border-white/25 shadow-xl backdrop-blur-md"
      : variant === "bright"
      ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-orange-200 shadow-xl ring-1 ring-orange-200/60"
      : // dark default
        "bg-slate-900/90 hover:bg-slate-900 text-white border-slate-700 shadow-xl backdrop-blur-md";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition ${btnClass}`}
      >
        <span className="text-sm font-semibold">{t("translate")}</span>
        <span className="text-xs opacity-80">({i18n.language?.toUpperCase()})</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="px-4 py-3 text-xs font-semibold text-slate-500 border-b border-slate-100">
            {t("selectLanguage")}
          </div>

          <button
            type="button"
            onClick={() => changeLang("en")}
            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
          >
            {t("english")}
          </button>

          <button
            type="button"
            onClick={() => changeLang("te")}
            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
          >
            {t("telugu")}
          </button>
        </div>
      )}
    </div>
  );
}
