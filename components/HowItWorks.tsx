"use client";

import React, { useEffect, useRef, useState } from "react";

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Fotoğrafını Çek",
            icon: "📸",
            desc: "Telefon kameranla tabağını fotoğraflıyorsun. Yapay zekâ, yemeği saniyeler içinde tanıyor.",
            features: ["Çoklu yemek algılama", "Porsiyon (S / M / L) tahmini", "Otomatik yemek sınıflandırması"]
        },
        {
            id: 2,
            title: "Akıllı Besin Analizi",
            icon: "🤖",
            desc: "Uygulama fotoğrafı işleyip kalori, protein, yağ ve karbonhidrat değerlerini otomatik hesaplıyor.",
            features: ["Tek dokunuşla besin analizi", "Gerçek zamanlı sonuçlar", "Yemek varyantı önerileri"]
        },
        {
            id: 3,
            title: "Kişisel Hedeflerini Belirle",
            icon: "🎯",
            desc: "Boy, kilo, yaş ve hedefini gir. AI senin için günlük kalori ve makro hedeflerini oluştursun.",
            features: ["Kişiye özel kalori hedefi", "Protein / yağ / karb hedefleri", "Vücut tipine göre optimizasyon"]
        },
        {
            id: 4,
            title: "Günlük İlerlemeni Takip Et",
            icon: "📊",
            desc: "Her öğün otomatik olarak günlük hedeflerinle karşılaştırılır. İlerlemeni modern bir dashboard’da gör.",
            features: ["Günlük kalori ilerleme barı", "Protein hedefi takibi", "Öğün bazlı dağılım analizi"]
        },
        {
            id: 5,
            title: "Haftalık Trendlerini Keşfet",
            icon: "📈",
            desc: "Uygulama son 7 günü analiz ederek beslenme alışkanlıklarını sana özetler.",
            features: ["Kalori & protein trend grafikleri", "Haftaiçi / haftasonu karşılaştırması", "En çok tükettiğin yemekler"]
        },
        {
            id: 6,
            title: "Global Benchmark ile Kıyasla",
            icon: "🌍",
            desc: "Benzer yaş, cinsiyet ve hedefe sahip kullanıcılarla beslenme performansını karşılaştır.",
            features: ["Ortalama kalori karşılaştırması", "Protein performans sıralaması", "Başarı yüzdeleri"]
        },
        {
            id: 7,
            title: "AI'dan Kişisel Öneriler Al",
            icon: "💡",
            desc: "AI, yeme alışkanlıklarını analiz ederek sana özel öneriler üretir. Cebindeki beslenme koçu.",
            features: ["“Bugün protein düşük kaldı.”", "“Hafta sonu kalorilerin yüksek.”", "“Bu hafta hedef uyumun %82.”"]
        },
        {
            id: 8,
            title: "Başarılarını Kutla",
            icon: "🏅",
            desc: "Düzenli kullanım artık daha eğlenceli. Rozetler kazan ve serini koru.",
            features: ["Günlük fotoğraf yükleme serileri", "Hedefi tutturunca rozetler", "Haftalık mini challenge’lar"]
        },
        {
            id: 9,
            title: "Tüm Verilerin Tek Profilde",
            icon: "🧠",
            desc: "Geçmiş öğünlerin, fotoğraf galerin, yıldızlı yemeklerin ve beslenme hedeflerin tek yerde.",
            features: ["Fotoğraflı öğün galerisi", "Besin geçmişi", "Kişisel dashboard"]
        }
    ];

    const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
    const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"));
                        setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index]));
                    }
                });
            },
            { threshold: 0.2 }
        );

        observerRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section id="how-it-works" style={{ padding: "6rem 0", position: "relative", overflow: "hidden" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                    <div style={{
                        display: "inline-block",
                        padding: "0.5rem 1.5rem",
                        background: "hsla(var(--primary), 0.1)",
                        color: "hsl(var(--primary))",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        marginBottom: "1rem"
                    }}>
                        ⭐ NASIL ÇALIŞIR?
                    </div>
                    <h2 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1.5rem" }}>
                        Yemeğinin fotoğrafını çek.<br />
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Gerisi bizde.</span>
                    </h2>
                </div>

                <div style={{ position: "relative", maxWidth: "1000px", margin: "0 auto" }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        background: "linear-gradient(to bottom, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
                        transform: "translateX(-50%)",
                        borderRadius: "999px",
                        opacity: 0.3,
                        zIndex: 0
                    }} className="timeline-line" />

                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0;
                        const isVisible = visibleSteps.includes(index);

                        return (
                            <div
                                key={step.id}
                                ref={(el) => { observerRefs.current[index] = el; }}
                                data-index={index}
                                style={{
                                    display: "flex",
                                    justifyContent: isEven ? "flex-start" : "flex-end",
                                    alignItems: "center",
                                    marginBottom: "4rem",
                                    position: "relative",
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? "translateY(0)" : "translateY(50px)",
                                    transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                    zIndex: 1
                                }}
                                className="timeline-item"
                            >
                                {/* Center Dot */}
                                <div style={{
                                    position: "absolute",
                                    left: "50%",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background: "white",
                                    border: "4px solid hsl(var(--primary))",
                                    transform: "translateX(-50%) scale(1)",
                                    zIndex: 2,
                                    boxShadow: "0 0 0 4px hsla(var(--primary), 0.2)",
                                    transition: "transform 0.4s ease",
                                }} />

                                {/* Content Card */}
                                <div style={{
                                    width: "45%",
                                    position: "relative",
                                    padding: "2rem",
                                    background: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "2rem",
                                    border: "1px solid rgba(255, 255, 255, 0.6)",
                                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                                    transform: isVisible ? "translateX(0)" : `translateX(${isEven ? "-50px" : "50px"})`,
                                    transition: "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s"
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: "2rem",
                                        [isEven ? "right" : "left"]: "-3rem",
                                        fontSize: "4rem",
                                        fontWeight: "900",
                                        color: "hsla(var(--primary), 0.05)",
                                        lineHeight: 1,
                                        pointerEvents: "none"
                                    }}>
                                        {step.id}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                        <div style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "1rem",
                                            background: "var(--gradient-primary)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1.75rem",
                                            color: "white",
                                            boxShadow: "0 10px 20px -5px hsla(var(--primary), 0.4)"
                                        }}>
                                            {step.icon}
                                        </div>
                                        <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{step.title}</h3>
                                    </div>

                                    <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                                        {step.desc}
                                    </p>

                                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {step.features.map((feature, idx) => (
                                            <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "hsl(var(--foreground))" }}>
                                                <span style={{ color: "hsl(var(--primary))", fontSize: "0.8rem" }}>●</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .timeline-line {
                        left: 20px !important;
                        transform: none !important;
                    }
                    .timeline-item {
                        justify-content: flex-start !important;
                        padding-left: 50px;
                    }
                    .timeline-item > div:first-child { /* Dot */
                        left: 20px !important;
                        transform: translateX(-50%) !important;
                    }
                    .timeline-item > div:last-child { /* Card */
                        width: 100% !important;
                        transform: translateX(0) !important;
                    }
                }
            `}</style>
        </section>
    );
}
