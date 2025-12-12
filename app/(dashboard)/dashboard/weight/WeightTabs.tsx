"use client";

import { useState } from "react";
import WeightChart from "@/components/WeightChart";
import WeightEntryForm from "@/components/WeightEntryForm";
import MeasurementChart from "@/components/MeasurementChart";
import MeasurementEntryForm from "@/components/MeasurementEntryForm";

interface WeightTabsProps {
    userId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    weightLogs: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    measurementLogs: any[];
    currentWeight: number;
    change: number;
    bmi: number;
    bmiStatus: string;
    bmiColor: string;
    targetWeight: number;
    remaining: number;
}

export default function WeightTabs({
    userId,
    weightLogs,
    measurementLogs,
    currentWeight,
    change,
    bmi,
    bmiStatus,
    bmiColor,
    targetWeight,
    remaining
}: WeightTabsProps) {
    const [activeTab, setActiveTab] = useState<"weight" | "measurements">("weight");

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                <button
                    onClick={() => setActiveTab("weight")}
                    style={{
                        padding: "0.75rem 1.5rem",
                        borderBottom: activeTab === "weight" ? "3px solid #667eea" : "3px solid transparent",
                        color: activeTab === "weight" ? "#667eea" : "#666",
                        fontWeight: activeTab === "weight" ? "700" : "500",
                        background: "transparent",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                        transition: "all 0.2s"
                    }}
                >
                    ⚖️ Kilo ve Vücut Takibi
                </button>
                <button
                    onClick={() => setActiveTab("measurements")}
                    style={{
                        padding: "0.75rem 1.5rem",
                        borderBottom: activeTab === "measurements" ? "3px solid #667eea" : "3px solid transparent",
                        color: activeTab === "measurements" ? "#667eea" : "#666",
                        fontWeight: activeTab === "measurements" ? "700" : "500",
                        background: "transparent",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                        transition: "all 0.2s"
                    }}
                >
                    📏 Vücut Ölçüleri
                </button>
            </div>

            {activeTab === "weight" ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>

                    {/* Top Section: 3-Column Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", gap: "1.5rem", alignItems: "stretch" }}>

                        {/* Column 1: Entry Form */}
                        <div className="card" style={{
                            padding: "1.5rem",
                            borderRadius: "1.5rem",
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
                        }}>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "#111" }}>Yeni Kayıt Ekle</h2>
                            <WeightEntryForm userId={userId} />
                        </div>

                        {/* Column 2: Current Weight + Target */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Current Weight Card */}
                            <div className="card" style={{
                                padding: "1.25rem",
                                background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                                border: "1px solid #7dd3fc",
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: "1.5rem",
                                flex: 1
                            }}>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ fontSize: "0.85rem", color: "#0369a1", fontWeight: "600", marginBottom: "0.25rem" }}>Güncel Kilo</div>
                                    <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#0c4a6e" }}>{currentWeight} <span style={{ fontSize: "1rem" }}>kg</span></div>
                                    <div style={{ fontSize: "0.8rem", color: "#0284c7", marginTop: "0.25rem" }}>Son ölçüm</div>
                                </div>
                                <div style={{ position: "absolute", right: "-10px", bottom: "-10px", fontSize: "4rem", opacity: 0.1 }}>⚖️</div>
                            </div>

                            {/* Target Card */}
                            <div className="card" style={{
                                padding: "1.25rem",
                                background: "linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%)",
                                border: "1px solid #c084fc",
                                borderRadius: "1.5rem",
                                flex: 1
                            }}>
                                <div style={{ fontSize: "0.85rem", color: "#6b21a8", fontWeight: "600", marginBottom: "0.25rem" }}>Hedefe Kalan</div>
                                {targetWeight > 0 ? (
                                    <>
                                        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#581c87" }}>
                                            {Math.abs(remaining).toFixed(1)} <span style={{ fontSize: "1rem" }}>kg</span>
                                        </div>
                                        <div style={{ width: "100%", height: "5px", background: "rgba(255,255,255,0.5)", borderRadius: "999px", marginTop: "0.75rem", overflow: "hidden" }}>
                                            <div style={{ width: "60%", height: "100%", background: "#9333ea", borderRadius: "999px" }}></div>
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "#7e22ce", marginTop: "0.4rem", textAlign: "right" }}>Hedef: {targetWeight} kg</div>
                                    </>
                                ) : (
                                    <div style={{ fontSize: "0.95rem", color: "#6b21a8", marginTop: "0.5rem" }}>Hedef belirlenmedi</div>
                                )}
                            </div>
                        </div>

                        {/* Column 3: BMI + Change */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* BMI Card */}
                            <div className="card" style={{
                                padding: "1.25rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderLeft: `5px solid ${bmiColor}`,
                                borderRadius: "1.5rem",
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(10px)",
                                flex: 1
                            }}>
                                <div>
                                    <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600", marginBottom: "0.25rem" }}>Vücut Kitle İndeksi</div>
                                    <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "#111" }}>{bmi.toFixed(1)}</div>
                                    <div style={{
                                        display: "inline-block",
                                        padding: "0.2rem 0.6rem",
                                        borderRadius: "999px",
                                        background: `${bmiColor}20`,
                                        color: bmiColor,
                                        fontWeight: "700",
                                        fontSize: "0.8rem"
                                    }}>
                                        {bmiStatus}
                                    </div>
                                </div>
                                <div style={{ width: "70px", height: "70px", position: "relative" }}>
                                    <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={bmiColor} strokeWidth="3" strokeDasharray={`${Math.min(100, (bmi / 40) * 100)}, 100`} />
                                    </svg>
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>🧍</div>
                                </div>
                            </div>

                            {/* Total Change Card */}
                            <div className="card" style={{
                                padding: "1.25rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                borderRadius: "1.5rem",
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(10px)",
                                flex: 1
                            }}>
                                <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600", marginBottom: "0.25rem" }}>Toplam Değişim</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                                    <div style={{ fontSize: "2.25rem", fontWeight: "800", color: change <= 0 ? "#10b981" : "#ef4444" }}>
                                        {change > 0 ? "+" : ""}{change.toFixed(1)}
                                    </div>
                                    <span style={{ fontSize: "1rem", color: change <= 0 ? "#10b981" : "#ef4444" }}>kg</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem", fontSize: "0.85rem", color: change <= 0 ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                                    {change <= 0 ? "📉 Harika gidiyorsun!" : "📈 Dikkat etmelisin"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Chart - Full Width */}
                    <div className="card" style={{
                        padding: "1.5rem",
                        width: "100%",
                        borderRadius: "1.5rem",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                        flex: 1,
                        minHeight: "350px"
                    }}>
                        <WeightChart data={weightLogs} targetWeight={targetWeight} />
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>
                    {/* Left Column: Entry Form */}
                    <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "2rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>Yeni Ölçü Ekle</h2>
                        <MeasurementEntryForm userId={userId} />
                    </div>

                    {/* Right Column: Chart */}
                    <div className="card" style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>Ölçü Değişimi</h2>
                        <div style={{ height: "500px" }}>
                            <MeasurementChart data={measurementLogs} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
