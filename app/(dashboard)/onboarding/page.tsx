"use client";

import { useState, useEffect } from "react";
import { saveProfile, UserStats } from "./actions";
import { ActivityLevel, Goal, calculateGoals } from "@/lib/calculate-goals";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
    const [step, setStep] = useState(1); // 1: Goal, 2: Gender/Age, 3: Height, 4: Weight, 5: Activity, 6: Summary
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [mode, setMode] = useState<"view" | "edit">("edit");
    const [formData, setFormData] = useState<UserStats>({
        gender: "male",
        age: 25,
        height: 175,
        weight: 75,
        activityLevel: "moderate",
        bodyType: "mesomorph",
        goal: "maintain",
    });

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from("user_profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (profile) {
                    setFormData({
                        gender: profile.gender || "male",
                        age: profile.age || 25,
                        height: profile.height || 175,
                        weight: profile.weight || 75,
                        activityLevel: profile.activity_level || "moderate",
                        bodyType: profile.body_type || "mesomorph",
                        goal: profile.goal || "maintain",
                    });

                    if (profile.weight && profile.height) {
                        setMode("view");
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await saveProfile(formData);
            // If in edit mode, maybe just switch back to view or redirect?
            // For now, let's redirect to dashboard profile as before, or stay here in view mode.
            // User request implies they want to see analysis details.
            setMode("view");
            router.push("/dashboard"); // Redirect to dashboard after saving
        } catch (error) {
            console.error(error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate BMR and Targets
    const goals = calculateGoals({
        ...formData,
        activity_level: formData.activityLevel,
        body_type: formData.bodyType,
        goal: formData.goal
    });

    if (initialLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
                <div className="spinner">⏳</div>
            </div>
        );
    }

    // VIEW MODE: Show Analysis Details
    if (mode === "view") {
        // Calculate BMI
        const heightM = formData.height / 100;
        const bmi = formData.weight / (heightM * heightM);
        let bmiStatus = "Normal";
        let bmiColor = "#10b981";
        let bmiDescription = "Harika! İdeal kilonu koruyorsun.";

        if (bmi < 18.5) {
            bmiStatus = "Hedefin Altında";
            bmiColor = "#3b82f6";
            bmiDescription = "Biraz kilo alarak ideal aralığa ulaşabilirsin.";
        }
        else if (bmi >= 25 && bmi < 30) {
            bmiStatus = "Hedefin Üzerinde";
            bmiColor = "#f59e0b"; // Orange instead of red
            bmiDescription = "Küçük değişikliklerle ideal aralığa yaklaşabilirsin.";
        }
        else if (bmi >= 30) {
            bmiStatus = "Daha Sağlıklı Olabilir";
            bmiColor = "#f97316"; // Orange-Red
            bmiDescription = "Sağlıklı bir yaşam için adım atmaya hazırsın!";
        }

        return (
            <div style={{
                minHeight: "calc(100vh - 60px)",
                background: "#f8f9fa",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
            }}>
                {/* 1. ANA HEDEF BANNER - En Üstte, Full Width */}
                <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "1.5rem",
                    padding: "2rem",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)"
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: "absolute",
                        top: "-50%",
                        right: "-10%",
                        width: "400px",
                        height: "400px",
                        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                        borderRadius: "50%"
                    }} />

                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.9, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    🎯 Ana Hedef
                                </div>
                                <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                                    {formData.goal === 'lose_weight' ? 'Kilo Vermek' : formData.goal === 'gain_muscle' ? 'Kas Kazanmak' : 'Formu Korumak'}
                                </h1>
                                <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: "500px", lineHeight: 1.5 }}>
                                    {formData.goal === 'lose_weight'
                                        ? "Kalori açığı oluşturarak yağ yakımını hedefliyoruz. Haftada 0.5-1 kg vermek sağlıklı bir hedef."
                                        : formData.goal === 'gain_muscle'
                                            ? "Protein ağırlıklı beslenme ve kalori fazlası ile kas inşası hedefliyoruz."
                                            : "Dengeli beslenme ile mevcut kilonu ve sağlığını koruyoruz."}
                                </p>
                            </div>
                            <button
                                onClick={() => { setMode("edit"); setStep(1); }}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.2)",
                                    backdropFilter: "blur(10px)",
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    fontSize: "0.9rem",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s"
                                }}
                            >
                                ✏️ Düzenle
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN CONTENT - İki Kolon */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", flex: 1 }}>

                    {/* Sol Kolon: Vücut Profili + BMI */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                        {/* Vücut Profili - Kompakt */}
                        <div className="card" style={{
                            padding: "1.5rem",
                            borderRadius: "1.5rem",
                            background: "white",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
                        }}>
                            <h2 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#333" }}>
                                👤 Vücut Profilin
                            </h2>

                            {/* Mini Stats Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
                                {[
                                    { value: formData.age, label: "Yaş" },
                                    { value: formData.height, label: "cm" },
                                    { value: formData.weight, label: "kg" },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        textAlign: "center",
                                        padding: "0.75rem 0.5rem",
                                        background: "#f8f9fa",
                                        borderRadius: "1rem"
                                    }}>
                                        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111" }}>{item.value}</div>
                                        <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: "500" }}>{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Detail Info */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Cinsiyet</span>
                                    <span style={{ fontWeight: "600", color: "#333" }}>{formData.gender === "male" ? "Erkek" : "Kadın"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Aktivite</span>
                                    <span style={{ fontWeight: "600", color: "#333", textTransform: "capitalize" }}>{formData.activityLevel}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Vücut Tipi</span>
                                    <span style={{ fontWeight: "600", color: "#333", textTransform: "capitalize" }}>{formData.bodyType}</span>
                                </div>
                            </div>
                        </div>

                        {/* BMI Widget */}
                        <div className="card" style={{
                            padding: "1.25rem",
                            borderRadius: "1.5rem",
                            background: "white",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                            borderLeft: `5px solid ${bmiColor}`
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: "0.8rem", color: "#666", fontWeight: "600", marginBottom: "0.25rem" }}>📊 Vücut Kitle İndeksi</div>
                                    <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "#111" }}>{bmi.toFixed(1)}</div>
                                    <div style={{
                                        display: "inline-block",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "999px",
                                        background: `${bmiColor}15`,
                                        color: bmiColor,
                                        fontWeight: "700",
                                        fontSize: "0.8rem",
                                        marginTop: "0.25rem"
                                    }}>
                                        {bmiStatus}
                                    </div>
                                </div>
                                <div style={{ width: "70px", height: "70px", position: "relative" }}>
                                    <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3.5" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={bmiColor} strokeWidth="3.5" strokeDasharray={`${Math.min(100, (bmi / 40) * 100)}, 100`} strokeLinecap="round" />
                                    </svg>
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🧍</div>
                                </div>
                            </div>
                            <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#888" }}>
                                {bmiDescription}
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon: Günlük İhtiyaç + Makrolar (Birleşik) */}
                    <div className="card" style={{
                        padding: "2rem",
                        borderRadius: "1.5rem",
                        background: "white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#333" }}>
                            📊 Günlük Hedefin
                        </h2>

                        {/* Kalori - Huge Display */}
                        <div style={{
                            textAlign: "center",
                            padding: "2rem",
                            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(217, 70, 239, 0.06) 100%)",
                            borderRadius: "1.5rem",
                            marginBottom: "2rem"
                        }}>
                            <div style={{
                                fontSize: "4rem",
                                fontWeight: "900",
                                lineHeight: 1,
                                background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                {goals.daily_calorie_goal}
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#888", marginTop: "0.5rem" }}>kcal / gün</div>
                        </div>

                        {/* Makrolar - Büyük Progress Bar'lar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>
                            {[
                                { icon: "🥩", label: "Protein", value: goals.daily_protein_goal, color: "#ef4444", percent: 30, desc: "Kas onarımı ve gelişimi için" },
                                { icon: "🥑", label: "Yağ", value: goals.daily_fat_goal, color: "#f59e0b", percent: 25, desc: "Hormonal denge ve enerji" },
                                { icon: "🍞", label: "Karbonhidrat", value: goals.daily_carbs_goal, color: "#3b82f6", percent: 45, desc: "Günlük enerji ihtiyacın" },
                            ].map((macro, i) => (
                                <div key={i}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <span style={{ fontSize: "1.25rem" }}>{macro.icon}</span>
                                                <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#333" }}>{macro.label}</span>
                                            </div>
                                            <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.15rem" }}>{macro.desc}</div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ fontSize: "1.75rem", fontWeight: "800", color: macro.color }}>{macro.value}g</span>
                                            <span style={{ fontSize: "0.85rem", color: "#888", marginLeft: "0.5rem" }}>{macro.percent}%</span>
                                        </div>
                                    </div>
                                    {/* Big Progress Bar */}
                                    <div style={{
                                        width: "100%",
                                        height: "12px",
                                        background: "#f0f0f0",
                                        borderRadius: "999px",
                                        overflow: "hidden"
                                    }}>
                                        <div style={{
                                            width: `${macro.percent}%`,
                                            height: "100%",
                                            background: `linear-gradient(90deg, ${macro.color} 0%, ${macro.color}cc 100%)`,
                                            borderRadius: "999px",
                                            transition: "width 1s ease-out"
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // EDIT MODE: Existing Form
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fa"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "480px",
                background: "white",
                borderRadius: "2rem",
                padding: "2.5rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
            }}>
                {/* Progress Indicator */}
                <div style={{ marginBottom: "2.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#8b5cf6" }}>Adım {step}/7</span>
                        <span style={{ fontSize: "0.9rem", color: "#9ca3af" }}>{Math.round((step / 7) * 100)}%</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{
                            width: `${(step / 7) * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                            borderRadius: "999px",
                            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                        }} />
                    </div>
                </div>

                {/* Step 1: Goal */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: "0.75rem", color: "#111", letterSpacing: "-0.02em" }}>
                            Hedefini Seç 🎯
                        </h1>
                        <p style={{ color: "#666", marginBottom: "2.5rem", fontSize: "1.1rem", lineHeight: "1.6" }}>
                            Sana özel bir plan oluşturacağız. Önce hedefini belirle!
                        </p>

                        <div style={{ display: "grid", gap: "1.25rem" }}>
                            {[
                                { val: "lose_weight", label: "Kilo Vermek 💪", desc: "Sağlıklı şekilde zayıfla, enerjini koru! 🔥" },
                                { val: "maintain", label: "Kilomu Korumak ⚖️", desc: "Formunda kal, dengeli yaşa! ⚖️" },
                                { val: "gain_muscle", label: "Kas Kazanmak 🏋️", desc: "Güçlen, kas kazan, formunu inşa et! 🏋️" },
                            ].map((opt) => {
                                const isSelected = formData.goal === opt.val;
                                return (
                                    <button
                                        key={opt.val}
                                        onClick={() => {
                                            setFormData({ ...formData, goal: opt.val as Goal });
                                            // Auto advance for better UX
                                            setTimeout(() => handleNext(), 300);
                                        }}
                                        style={{
                                            textAlign: "left",
                                            padding: "1.5rem",
                                            borderRadius: "1.5rem",
                                            border: isSelected ? "none" : "2px solid #e5e7eb",
                                            background: isSelected
                                                ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
                                                : "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
                                            color: isSelected ? "white" : "#374151",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            cursor: "pointer",
                                            boxShadow: isSelected
                                                ? "0 10px 25px -5px rgba(139, 92, 246, 0.5)"
                                                : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                            transform: isSelected ? "scale(1.02)" : "scale(1)",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = "#a78bfa";
                                                e.currentTarget.style.transform = "scale(1.01)";
                                                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(167, 139, 250, 0.15)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = "#e5e7eb";
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
                                            }
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                            <div style={{ fontWeight: "800", fontSize: "1.2rem" }}>{opt.label}</div>
                                            {isSelected && <div className="animate-in zoom-in duration-300">✅</div>}
                                        </div>
                                        <div style={{ fontSize: "0.95rem", opacity: isSelected ? 0.95 : 0.7, lineHeight: "1.4" }}>{opt.desc}</div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleNext}
                            className="btn"
                            style={{
                                width: "100%",
                                marginTop: "2.5rem",
                                padding: "1.25rem",
                                borderRadius: "1rem",
                                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                                color: "white",
                                border: "none",
                                fontSize: "1.1rem",
                                fontWeight: "700",
                                boxShadow: "0 10px 20px -5px rgba(139, 92, 246, 0.4)",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 15px 25px -5px rgba(139, 92, 246, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 10px 20px -5px rgba(139, 92, 246, 0.4)";
                            }}
                        >
                            Devam Et →
                        </button>
                    </div>
                )}

                {/* Step 2: Gender & Age */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "2rem", color: "#111" }}>Senin Hakkında</h1>

                        <div style={{ marginBottom: "2.5rem" }}>
                            <label style={{ marginBottom: "1rem", display: "block", fontWeight: "600", color: "#444" }}>Cinsiyet</label>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                {["male", "female"].map((g) => {
                                    const isSelected = formData.gender === g;
                                    return (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, gender: g as "male" | "female" })}
                                            style={{
                                                flex: 1,
                                                padding: "1.25rem",
                                                fontSize: "1.1rem",
                                                borderRadius: "1rem",
                                                border: isSelected ? "none" : "2px solid #e5e7eb",
                                                background: isSelected ? "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)" : "white",
                                                color: isSelected ? "white" : "#444",
                                                fontWeight: "600",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {g === "male" ? "Erkek 👨" : "Kadın 👩"}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label style={{ marginBottom: "1rem", display: "block", fontWeight: "600", color: "#444" }}>Yaş</label>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", fontWeight: "800", color: "#8b5cf6", marginBottom: "1rem" }}>
                                {formData.age}
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                style={{ width: "100%", accentColor: "#8b5cf6", height: "6px" }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                            <button onClick={handleBack} className="btn" style={{ flex: 1, border: "2px solid #e5e7eb", borderRadius: "999px" }}>Geri</button>
                            <button onClick={handleNext} className="btn" style={{ flex: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", color: "white", borderRadius: "999px" }}>İleri</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Height */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem", color: "#111" }}>Boyun Kaç?</h1>
                        <p style={{ color: "#666", marginBottom: "3rem" }}>Günlük kalori ihtiyacını hesaplamak için gerekli.</p>

                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <span style={{ fontSize: "4rem", fontWeight: "800", color: "#111" }}>{formData.height}</span>
                            <span style={{ fontSize: "1.5rem", color: "#666", marginLeft: "0.5rem" }}>cm</span>
                        </div>

                        <input
                            type="range"
                            min="100"
                            max="250"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                            style={{ width: "100%", accentColor: "#8b5cf6", height: "8px" }}
                        />

                        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                            <button onClick={handleBack} className="btn" style={{ flex: 1, border: "2px solid #e5e7eb", borderRadius: "999px" }}>Geri</button>
                            <button onClick={handleNext} className="btn" style={{ flex: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", color: "white", borderRadius: "999px" }}>İleri</button>
                        </div>
                    </div>
                )}

                {/* Step 4: Weight */}
                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem", color: "#111" }}>Kilon Kaç?</h1>
                        <p style={{ color: "#666", marginBottom: "3rem" }}>Hedefine ulaşman için başlangıç noktamız.</p>

                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <span style={{ fontSize: "4rem", fontWeight: "800", color: "#111" }}>{formData.weight}</span>
                            <span style={{ fontSize: "1.5rem", color: "#666", marginLeft: "0.5rem" }}>kg</span>
                        </div>

                        <input
                            type="range"
                            min="30"
                            max="200"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                            style={{ width: "100%", accentColor: "#8b5cf6", height: "8px" }}
                        />

                        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                            <button onClick={handleBack} className="btn" style={{ flex: 1, border: "2px solid #e5e7eb", borderRadius: "999px" }}>Geri</button>
                            <button onClick={handleNext} className="btn" style={{ flex: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", color: "white", borderRadius: "999px" }}>İleri</button>
                        </div>
                    </div>
                )}

                {/* Step 5.5: Body Type (New Step) */}
                {step === 5 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem", color: "#111" }}>Vücut Tipin?</h1>
                        <p style={{ color: "#666", marginBottom: "2rem" }}>Metabolizma hızını ve makro ihtiyaçlarını belirler.</p>

                        <div style={{ display: "grid", gap: "1rem" }}>
                            {[
                                { val: "ectomorph", label: "Ectomorph (İnce)", desc: "İnce yapılı, hızlı metabolizma, zor kilo alan.", icon: "🏃" },
                                { val: "mesomorph", label: "Mesomorph (Atletik)", desc: "Atletik yapı, kolay kas yapan, orantılı.", icon: "💪" },
                                { val: "endomorph", label: "Endomorph (Geniş)", desc: "Geniş yapılı, yavaş metabolizma, kolay yağlanan.", icon: "🐻" },
                            ].map((opt) => {
                                const isSelected = formData.bodyType === opt.val;
                                return (
                                    <button
                                        key={opt.val}
                                        onClick={() => {
                                            setFormData({ ...formData, bodyType: opt.val as any });
                                            setTimeout(() => setStep(6), 200); // Skip to activity or next step
                                        }}
                                        style={{
                                            justifyContent: "flex-start",
                                            textAlign: "left",
                                            padding: "1.25rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            borderRadius: "1.5rem",
                                            border: isSelected ? "none" : "2px solid #e5e7eb",
                                            background: isSelected ? "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)" : "white",
                                            color: isSelected ? "white" : "#111",
                                            transition: "all 0.2s",
                                            transform: isSelected ? "scale(1.02)" : "scale(1)"
                                        }}
                                    >
                                        <div style={{ fontSize: "2rem" }}>{opt.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{opt.label}</div>
                                            <div style={{ fontSize: "0.85rem", opacity: isSelected ? 0.9 : 0.7 }}>{opt.desc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                            <button onClick={handleBack} className="btn" style={{ flex: 1, border: "2px solid #e5e7eb", borderRadius: "999px" }}>Geri</button>
                            <button onClick={() => setStep(6)} className="btn" style={{ flex: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", color: "white", borderRadius: "999px" }}>İleri</button>
                        </div>
                    </div>
                )}

                {/* Step 6: Activity (Shifted from 5) */}
                {step === 6 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem", color: "#111" }}>Günlük Aktivite</h1>
                        <p style={{ color: "#666", marginBottom: "2rem" }}>Günlük kalori yakımını tahmin etmemizi sağlar.</p>

                        <div style={{ display: "grid", gap: "1rem" }}>
                            {[
                                { val: "sedentary", label: "Hareketsiz", desc: "Masa başı iş, az egzersiz", icon: "🛋️" },
                                { val: "light", label: "Az Hareketli", desc: "Haftada 1-3 gün hafif egzersiz", icon: "🚶" },
                                { val: "moderate", label: "Orta Hareketli", desc: "Haftada 3-5 gün spor", icon: "🏃" },
                                { val: "active", label: "Çok Hareketli", desc: "Haftada 6-7 gün yoğun spor", icon: "🏋️" },
                            ].map((opt) => {
                                const isSelected = formData.activityLevel === opt.val;
                                return (
                                    <button
                                        key={opt.val}
                                        onClick={() => {
                                            setFormData({ ...formData, activityLevel: opt.val as ActivityLevel });
                                            setTimeout(() => setStep(7), 200);
                                        }}
                                        style={{
                                            justifyContent: "flex-start",
                                            textAlign: "left",
                                            padding: "1.25rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            borderRadius: "1.5rem",
                                            border: isSelected ? "none" : "2px solid #e5e7eb",
                                            background: isSelected ? "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)" : "white",
                                            color: isSelected ? "white" : "#111",
                                            transition: "all 0.2s",
                                            transform: isSelected ? "scale(1.02)" : "scale(1)"
                                        }}
                                    >
                                        <div style={{ fontSize: "2rem" }}>{opt.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{opt.label}</div>
                                            <div style={{ fontSize: "0.85rem", opacity: isSelected ? 0.9 : 0.7 }}>{opt.desc}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                            <button onClick={handleBack} className="btn" style={{ flex: 1, border: "2px solid #e5e7eb", borderRadius: "999px" }}>Geri</button>
                            <button onClick={() => setStep(7)} className="btn" style={{ flex: 2, background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", color: "white", borderRadius: "999px" }}>İleri</button>
                        </div>
                    </div>
                )}

                {/* Step 7: Summary / Plan (Shifted from 6) */}
                {step === 7 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "1.5rem", color: "#111" }}>Beslenme Planın Hazır! ✅</h1>

                        <div style={{ padding: "1.5rem", background: "#f3f4f6", borderRadius: "1.5rem", marginBottom: "2rem" }}>
                            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.25rem" }}>Günlük Hedef</div>
                                <div style={{ fontSize: "3rem", fontWeight: "800", color: "#8b5cf6" }}>
                                    {goals.daily_calorie_goal} <span style={{ fontSize: "1rem", fontWeight: "normal", color: "#111" }}>kalori</span>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center" }}>
                                <div>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444", margin: "0 auto 0.5rem" }} />
                                    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{goals.daily_protein_goal}g</div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>Protein</div>
                                </div>
                                <div>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308", margin: "0 auto 0.5rem" }} />
                                    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{goals.daily_fat_goal}g</div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>Yağ</div>
                                </div>
                                <div>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#3b82f6", margin: "0 auto 0.5rem" }} />
                                    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{goals.daily_carbs_goal}g</div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>Karb</div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "1rem",
                                fontSize: "1.1rem",
                                borderRadius: "999px",
                                background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
                                color: "white",
                                border: "none",
                                fontWeight: "600",
                                boxShadow: "0 10px 20px -5px rgba(139, 92, 246, 0.4)"
                            }}
                        >
                            {loading ? "Kaydediliyor..." : "Hemen Başla 🚀"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfileItem({ icon, label, value, capitalize = false }: { icon: string, label: string, value: string | number, capitalize?: boolean }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
                width: "40px", height: "40px", borderRadius: "10px", background: "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem"
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontWeight: "600", color: "#111", textTransform: capitalize ? "capitalize" : "none" }}>{value}</div>
            </div>
        </div>
    );
}

function MacroRow({ label, value, color, desc, percent }: { label: string, value: number, color: string, desc: string, percent: number }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
                width: "60px", height: "60px", borderRadius: "1rem", background: `${color}15`,
                display: "flex", alignItems: "center", justifyContent: "center", color: color, fontWeight: "800", fontSize: "1.25rem"
            }}>
                {value}g
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>{label}</div>
                    <div style={{ fontSize: "0.85rem", color: color, fontWeight: "600" }}>{percent}%</div>
                </div>
                <div style={{ width: "100%", height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden", marginBottom: "0.25rem" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: color, borderRadius: "3px" }} />
                </div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>{desc}</div>
            </div>
        </div>
    );
}
