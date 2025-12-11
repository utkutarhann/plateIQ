"use client";

import { useState, useEffect } from "react";
import { getWeeklyStats } from "@/app/(dashboard)/dashboard/actions";

export default function WeeklyReport() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getWeeklyStats();
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;
    if (!stats) return null;

    const { weekdayAvg, weekendAvg } = stats;
    const diff = weekendAvg - weekdayAvg;
    const percentDiff = weekdayAvg ? Math.round((diff / weekdayAvg) * 100) : 0;

    return (
        <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Haftalık AI Raporu 📅</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                    <h4 style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", marginBottom: "0.5rem" }}>Hafta İçi vs Hafta Sonu</h4>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", height: "100px" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: "100%", height: `${Math.min(100, (weekdayAvg / 3000) * 100)}%`, backgroundColor: "hsl(var(--primary))", borderRadius: "0.5rem" }} />
                            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Hafta İçi</span>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ width: "100%", height: `${Math.min(100, (weekendAvg / 3000) * 100)}%`, backgroundColor: diff > 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))", borderRadius: "0.5rem" }} />
                            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Hafta Sonu</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ padding: "1rem", backgroundColor: "hsl(var(--secondary) / 0.1)", borderRadius: "1rem" }}>
                        <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                            🤖 <strong>AI Özeti:</strong>
                            <br />
                            {diff > 200 ? (
                                `Hafta sonu kalori alımın hafta içine göre %${percentDiff} daha yüksek. Hafta sonu kaçamaklarına dikkat! 🚨`
                            ) : diff < -200 ? (
                                `Hafta sonu hafta içine göre daha az yemişsin. Enerjini korumayı unutma! ⚡`
                            ) : (
                                `Hafta içi ve hafta sonu dengen harika! İstikrarını koruyorsun. 🌟`
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
