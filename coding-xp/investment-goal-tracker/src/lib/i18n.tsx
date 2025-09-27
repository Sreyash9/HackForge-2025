"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "en" | "hi" | "mr";
type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  en: {
    goals: "Goals",
    compoundGrowth: "Compound Growth",
    investmentSimulation: "Investment Simulation",
    dashboard: "Dashboard",
    addGoal: "Add Goal",
    yourGoals: "Your Goals",
    summaryOfGoals: "Here's a summary of your investment goals.",
    growthParameters: "Growth Parameters",
    projectedOutcome: "Projected Outcome",
    initialInvestment: "Initial Investment",
    monthlyInvestment: "Monthly Investment (SIP)",
    expectedAnnualReturn: "Expected Annual Return",
    timeHorizon: "Time Horizon (Years)",
    totalInvested: "Total Amount Invested",
    projectedGains: "Projected Gains",
    finalPortfolioValue: "Final Portfolio Value",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    marathi: "Marathi",
  },
  hi: {
    goals: "लक्ष्य",
    compoundGrowth: "चक्रवृद्धि वृद्धि",
    investmentSimulation: "निवेश सिमुलेशन",
    dashboard: "डैशबोर्ड",
    addGoal: "लक्ष्य जोड़ें",
    yourGoals: "आपके लक्ष्य",
    summaryOfGoals: "यह आपके निवेश लक्ष्यों का सारांश है।",
    growthParameters: "वृद्धि पैरामीटर",
    projectedOutcome: "अनुमानित परिणाम",
    initialInvestment: "प्रारंभिक निवेश",
    monthlyInvestment: "मासिक निवेश (SIP)",
    expectedAnnualReturn: "अपेक्षित वार्षिक रिटर्न",
    timeHorizon: "समय अवधि (वर्ष)",
    totalInvested: "कुल निवेश राशि",
    projectedGains: "अनुमानित लाभ",
    finalPortfolioValue: "अंतिम पोर्टफोलियो मूल्य",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    marathi: "मराठी",
  },
  mr: {
    goals: "लक्ष्य",
    compoundGrowth: "चक्रवाढ वाढ",
    investmentSimulation: "गुंतवणूक सिम्युलेशन",
    dashboard: "डॅशबोर्ड",
    addGoal: "लक्ष्य जोडा",
    yourGoals: "तुमची उद्दिष्टे",
    summaryOfGoals: "तुमच्या गुंतवणूक उद्दिष्टांचा सारांश.",
    growthParameters: "वाढीचे घटक",
    projectedOutcome: "अनुमानित परिणाम",
    initialInvestment: "प्रारंभिक गुंतवणूक",
    monthlyInvestment: "मासिक गुंतवणूक (SIP)",
    expectedAnnualReturn: "अपेक्षित वार्षिक परतावा",
    timeHorizon: "कालावधी (वर्षे)",
    totalInvested: "एकूण गुंतवणूक",
    projectedGains: "अनुमानित नफा",
    finalPortfolioValue: "अंतिम पोर्टफोलिओ मूल्य",
    language: "भाषा",
    english: "इंग्रजी",
    hindi: "हिंदी",
    marathi: "मराठी",
  },
};

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem("lang")) as Lang | null;
    if (saved && ["en", "hi", "mr"].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = useMemo(() => {
    const dict = dictionaries[lang];
    return (key: string) => dict[key] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
