"use client";

import { useState, useEffect } from "react";

const slides = [
    {
        id: 1,
        title: "Fotoğrafını Çek & Analiz Et",
        description: "Yemeğinin fotoğrafını yükle, yapay zeka saniyeler içinde kalori ve besin değerlerini hesaplasın.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 2,
        title: "Makrolarını Takip Et",
        description: "Günlük protein, karbonhidrat ve yağ dengeni kolayca gör ve hedeflerine ulaş.",
        color: "from-violet-500 to-purple-500"
    },
    {
        id: 3,
        title: "Hedeflerine Ulaş",
        description: "Kilo vermek, kas yapmak veya formunu korumak... Hedefin ne olursa olsun yanındayız.",
        color: "from-emerald-500 to-green-500"
    },
    {
        id: 4,
        title: "İstikrarlı Ol & Kazan",
        description: "Her gün düzenli kayıt tut, serilerini bozma ve rozetleri topla!",
        color: "from-orange-500 to-amber-500"
    }
];

export default function TutorialSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const renderMockup = (index: number) => {
        switch (index) {
            case 0: // Camera / Analysis
                return (
                    <div className="mockup-content" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
                        <div style={{ flex: 1, background: "#f3f4f6", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                            <div style={{ fontSize: "4rem", animation: "scaleIn 0.5s ease-out" }}>🥗</div>

                            {/* Scanning Line Animation */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: "#3b82f6",
                                boxShadow: "0 0 10px #3b82f6",
                                animation: "scan 2s linear infinite",
                                zIndex: 5
                            }} />

                            <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", background: "rgba(255,255,255,0.9)", padding: "0.75rem", borderRadius: "0.75rem", backdropFilter: "blur(4px)", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", animation: "slideUp 0.5s ease-out 0.5s backwards" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Sezar Salata</span>
                                    <span style={{ fontSize: "0.8rem", color: "#666" }}>320 kcal</span>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: "#fee2e2", color: "#ef4444", borderRadius: "4px" }}>Protein: 25g</span>
                                    <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: "#dbeafe", color: "#3b82f6", borderRadius: "4px" }}>Karb: 12g</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "4px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#ef4444", transition: "transform 0.2s", cursor: "pointer" }} className="hover:scale-95"></div>
                            </div>
                        </div>
                    </div>
                );
            case 1: // Macros
                return (
                    <div className="mockup-content" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%", justifyContent: "center" }}>
                        <div style={{ textAlign: "center", marginBottom: "1rem", animation: "fadeIn 0.5s ease-out" }}>
                            <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#111" }}>1,450</div>
                            <div style={{ color: "#666", fontSize: "0.9rem" }}>Alınan Kalori</div>
                        </div>
                        {[
                            { label: "Protein", val: "85g", target: "140g", color: "#ef4444", pct: "60%", delay: "0.2s" },
                            { label: "Karbonhidrat", val: "120g", target: "200g", color: "#3b82f6", pct: "60%", delay: "0.4s" },
                            { label: "Yağ", val: "45g", target: "70g", color: "#eab308", pct: "65%", delay: "0.6s" },
                        ].map((m, i) => (
                            <div key={i} style={{ animation: `slideInRight 0.5s ease-out ${m.delay} backwards` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                                    <span style={{ fontWeight: "600" }}>{m.label}</span>
                                    <span style={{ color: "#666" }}>{m.val} / {m.target}</span>
                                </div>
                                <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                                    <div style={{ width: m.pct, height: "100%", background: m.color, borderRadius: "4px", animation: `fillBar${i} 1s ease-out ${m.delay} backwards` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 2: // Goals
                return (
                    <div className="mockup-content" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%", justifyContent: "center" }}>
                        <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid #bbf7d0", animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                <div style={{ fontSize: "2rem", animation: "bounce 2s infinite" }}>⚖️</div>
                                <div>
                                    <div style={{ fontWeight: "bold", color: "#166534" }}>Hedef: 70 kg</div>
                                    <div style={{ fontSize: "0.8rem", color: "#15803d" }}>Başlangıç: 78 kg</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                                <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "#166534" }}>74.2</span>
                                <span style={{ fontSize: "1rem", color: "#15803d", marginBottom: "0.5rem" }}>kg</span>
                            </div>
                            <div style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "white", borderRadius: "999px", display: "inline-block", fontSize: "0.8rem", color: "#166534", fontWeight: "600", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", animation: "fadeInUp 0.5s ease-out 0.5s backwards" }}>
                                🎉 3.8 kg verdin!
                            </div>
                        </div>
                    </div>
                );
            case 3: // Streaks
                return (
                    <div className="mockup-content" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <div style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "4rem",
                            boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.5)",
                            animation: "pulse 2s infinite"
                        }}>
                            🔥
                        </div>
                        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease-out 0.3s backwards" }}>
                            <div style={{ fontSize: "3rem", fontWeight: "900", color: "#111", lineHeight: 1 }}>12</div>
                            <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#f97316" }}>Günlük Seri</div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", animation: "fadeIn 0.5s ease-out 0.6s backwards" }}>
                            {[1, 2, 3, 4, 5].map((d, i) => (
                                <div key={d} style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: "#fff7ed",
                                    border: "2px solid #fdba74",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.8rem",
                                    color: "#c2410c",
                                    fontWeight: "bold",
                                    animation: `popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.8 + (i * 0.1)}s backwards`
                                }}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            width: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.5rem",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Background Gradient */}
            <div style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${currentSlide === 0 ? '#eff6ff' : currentSlide === 1 ? '#f5f3ff' : currentSlide === 2 ? '#f0fdf4' : '#fff7ed'} 0%, white 100%)`,
                transition: "background 1s ease",
                opacity: 0.5
            }} />

            <div style={{
                width: "100%",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                {/* Phone Mockup - Smaller */}
                <div style={{
                    position: "relative",
                    width: "180px", // Smaller width
                    aspectRatio: "9/16",
                    marginBottom: "1.5rem",
                    borderRadius: "1.5rem",
                    background: "white",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 0 0 4px white",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    transform: "translateY(0)",
                    transition: "all 0.5s ease"
                }}>
                    {/* Status Bar Mockup */}
                    <div style={{ height: "20px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 0.75rem", alignItems: "center", fontSize: "0.5rem", fontWeight: "600", color: "#111" }}>
                        <span>9:41</span>
                        <div style={{ display: "flex", gap: "2px" }}>
                            <span>📶</span>
                            <span>🔋</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ height: "calc(100% - 20px)", position: "relative", fontSize: "0.7rem" }}>
                        {renderMockup(currentSlide)}
                    </div>
                </div>

                {/* Text Content */}
                <div style={{ textAlign: "center" }}>
                    <h2 style={{
                        fontSize: "1.25rem",
                        fontWeight: "800",
                        marginBottom: "0.5rem",
                        color: "#1e293b",
                        letterSpacing: "-0.02em",
                        minHeight: "1.5rem"
                    }}>
                        {slides[currentSlide].title}
                    </h2>
                    <p style={{
                        fontSize: "0.9rem",
                        color: "#64748b",
                        lineHeight: 1.5,
                        minHeight: "2.7rem",
                        maxWidth: "300px",
                        margin: "0 auto"
                    }}>
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* Indicators */}
                <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginTop: "1rem" }}>
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            style={{
                                width: idx === currentSlide ? "20px" : "6px",
                                height: "6px",
                                borderRadius: "3px",
                                backgroundColor: idx === currentSlide ? "#3b82f6" : "#cbd5e1",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fillBar0 { from { width: 0; } to { width: 60%; } }
                @keyframes fillBar1 { from { width: 0; } to { width: 60%; } }
                @keyframes fillBar2 { from { width: 0; } to { width: 65%; } }
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeInUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
                }
                /* Scale down content for smaller mockup */
                .mockup-content {
                    zoom: 0.6;
                }
            `}</style>
        </div>
    );
}
