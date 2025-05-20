"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { type Language, translations, type Translations } from "./translations";

interface TranslationType {
  invoice: {
    form: {
      invoiceNumber: string;
      date: string;
      clientName: string;
      clientAddress: string;
      businessDetails: string;
      businessName: string;
      businessAddress: string;
      businessTin: string;
      businessRcNumber: string;
      clientDetails: string;
      vatSettings: string;
      vatRate: string;
      pricesIncludeVat: string;
      pricesIncludeVatDescription: string;
      paymentTerms: string;
      customPaymentTerms: string;
      items: string;
      description: string;
      quantity: string;
      price: string;
      subtotal: string;
      addItem: string;
      removeItem: string;
      currency: string;
      total: string;
      notes: string;
      notesPlaceholder: string;
      generate: string;
      generating: string;
      required: string;
      invalidTin: string;
      invalidRcNumber: string;
      invalidVatRate: string;
    };
    preview: {
      billTo: string;
      description: string;
      quantity: string;
      price: string;
      subtotal: string;
      total: string;
      paymentTerms: string;
      notes: string;
      thankYou: string;
    };
  };
  // ... rest of translations
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // Save language to localStorage
    if (mounted) {
      localStorage.setItem("language", language);

      // Set HTML dir attribute for RTL support
      document.documentElement.dir = translations[language].direction;
    }
  }, [language, mounted]);

  const t = translations[language];
  const dir = translations[language].direction;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
