"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface DailySummaryProps {
    dailyStats: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    goals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

export default function DailySummaryCard({ dailyStats, goals }: DailySummaryProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const goalCalories = goals.calories || 2000; // Default to 2000 if 0 or NaN
    const currentCalories = dailyStats.calories || 0;

    const calorieProgress = goalCalories > 0 ? Math.min(100, (currentCalories / goalCalories) * 100) : 0;
    const remainingCalories = Math.max(0, goalCalories - currentCalories);
    const isOverLimit = currentCalories > goalCalories;

    if (isNaN(calorieProgress)) {
        // Fallback or return null if critical data is missing
    }

    return (
        <div className="card" style={{
            padding: "2rem",
            background: "white",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                    <div>
                        <h2 style={{ fontSize: "1rem", color: "hsl(var(--muted-foreground))", fontWeight: "600", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Günlük Özet</h2>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            <span style={{ fontSize: "3.5rem", fontWeight: "900", lineHeight: 1, letterSpacing: "-0.03em", color: "hsl(var(--foreground))" }}>
                                {remainingCalories}
                            </span>
                            <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "hsl(var(--muted-foreground))" }}>kcal kaldı</span>
                        </div>
                        <div style={{ fontSize: "0.9rem", color: isOverLimit ? "#ef4444" : "#22c55e", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            {isOverLimit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {isOverLimit ? "Hedef aşıldı" : "Hedefin altında"}
                        </div>
                    </div>

                    {/* Circular Progress for Calories */}
                    <div style={{ position: "relative", width: "120px", height: "120px" }}>
                        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" strokeOpacity="0.2" />
                            <circle
                                cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="10"
                                strokeDasharray="339"
                                strokeDashoffset={mounted ? 339 - (339 * calorieProgress) / 100 : 339}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                            />
                        </svg>
                        <div style={{
                            position: "absolute", top: "0", left: "0", width: "100%", height: "100%",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                        }}>
                            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "hsl(var(--foreground))" }}>%{Math.round(calorieProgress)}</span>
                            <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))", fontWeight: "600" }}>Tamamlandı</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                    <MacroItem label="Protein" current={dailyStats.protein} target={goals.protein} color="#3b82f6" mounted={mounted} />
                    <MacroItem label="Karbonhidrat" current={dailyStats.carbs} target={goals.carbs} color="#eab308" mounted={mounted} />
                    <MacroItem label="Yağ" current={dailyStats.fat} target={goals.fat} color="#ef4444" mounted={mounted} />
                </div>
            </div>
        </div>
    );
}

function MacroItem({ label, current, target, color, mounted }: { label: string, current: number, target: number, color: string, mounted: boolean }) {
    const percentage = Math.min(100, (current / target) * 100);

    return (
        <div className="group" style={{ cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", alignItems: "flex-end" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>{label}</span>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "hsl(var(--foreground))" }}>{Math.round(current)}g</span>
                    <span style={{ fontSize: "0.85rem", color: "hsl(var(--muted-foreground))", marginLeft: "0.25rem" }}>/ {target}g</span>
                </div>
            </div>
            <div style={{ width: "100%", height: "10px", background: "hsl(var(--muted))", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: color,
                    borderRadius: "999px",
                    transition: "width 1s ease-out",
                    transform: mounted ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left"
                }} />
            </div>
        </div>
    );
}

