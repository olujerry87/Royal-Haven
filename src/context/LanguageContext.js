"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

const translations = { en, fr };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState("en");

    // Initialize from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("royalHavenLang");
        if (saved && (saved === "en" || saved === "fr")) {
            setLanguageState(saved);
            document.documentElement.lang = saved;
        } else {
            document.documentElement.lang = "en";
        }
    }, []);

    const setLanguage = useCallback((lang) => {
        if (lang !== "en" && lang !== "fr") return;
        setLanguageState(lang);
        localStorage.setItem("royalHavenLang", lang);
        document.documentElement.lang = lang;
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => {
            const next = prev === "en" ? "fr" : "en";
            localStorage.setItem("royalHavenLang", next);
            document.documentElement.lang = next;
            return next;
        });
    }, []);

    // Translation function that resolves dot-notated keys (e.g. 'nav.wura')
    const t = useCallback((keyPath, fallback = "") => {
        if (!keyPath) return fallback;
        const currentDict = translations[language] || translations.en;
        const fallbackDict = translations.en;

        const resolve = (dict) => {
            const keys = keyPath.split(".");
            let current = dict;
            for (const k of keys) {
                if (current && typeof current === "object" && k in current) {
                    current = current[k];
                } else {
                    return undefined;
                }
            }
            return current;
        };

        const val = resolve(currentDict);
        if (val !== undefined && typeof val === "string") return val;

        const fallbackVal = resolve(fallbackDict);
        if (fallbackVal !== undefined && typeof fallbackVal === "string") return fallbackVal;

        return fallback || keyPath;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
