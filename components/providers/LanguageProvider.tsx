"use client";

import React, { createContext, useContext } from "react";

type Language = "tr";

type LanguageContextType = {
    language: Language;
    t: (key: string) => string;
};

const translations = {
    tr: {
        "signup.title": "Aramıza Katıl 🚀",
        "signup.subtitle": "Sağlıklı yaşam yolculuğuna bugün başla.",
        "signup.email": "E-posta Adresi",
        "signup.password": "Şifre",
        "signup.submit": "Hesap Oluştur",
        "signup.or": "VEYA",
        "signup.google": "Google ile Kayıt Ol",
        "signup.login_prompt": "Zaten hesabın var mı?",
        "signup.login_link": "Giriş Yap",
        "login.title": "Hoş Geldin 👋",
        "login.subtitle": "Hesabına giriş yap ve devam et.",
        "login.email": "E-posta Adresi",
        "login.password": "Şifre",
        "login.remember_me": "Beni Hatırla",
        "login.submit": "Giriş Yap",
        "login.signup_prompt": "Hesabın yok mu?",
        "login.signup_link": "Kayıt Ol",
        "sidebar.home": "Profil Özeti",
        "sidebar.goals": "Hedef ve Analizlerim",
        "sidebar.logout": "Çıkış Yap",
        "dashboard.welcome": "Hoş geldin",
        "dashboard.streak": "Günlük Seri",
        "dashboard.calories": "Kalori",
        "dashboard.protein": "Protein",
        "dashboard.carbs": "Karbonhidrat",
        "dashboard.fat": "Yağ",
        "dashboard.daily_summary": "Günlük Özet",
        "dashboard.recent_meals": "Son Öğünler",
        "dashboard.no_meals": "Henüz öğün eklenmemiş.",
        "dashboard.add_meal": "Öğün Ekle",
        "dashboard.profile": "Profilim",
        "dashboard.ai_assistant": "Yapay Zeka Destekli Beslenme Asistanı",
        "dashboard.hero_title_1": "Yediğini",
        "dashboard.hero_title_2": "Tanı",
        "dashboard.hero_title_3": "Sağlığını Yönet.",
        "dashboard.hero_subtitle": "Yemek fotoğrafını yükle, saniyeler içinde kalori, protein ve makro değerlerini öğren.",
        "goal.congrats": "🎉 Tebrikler!",
        "goal.message": "Bugünkü kalori hedefine ulaştın. Harika gidiyorsun!",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const language: Language = "tr";

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations["tr"]] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, t }}>
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
