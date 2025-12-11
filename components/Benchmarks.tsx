"use client";

import { useEffect, useState } from "react";
import { getBenchmarks } from "@/app/(dashboard)/dashboard/actions";

export default function Benchmarks({ userProfile }: { userProfile: any }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await getBenchmarks();
                setData(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="animate-pulse h-40 bg-gray-100 rounded-xl"></div>;
    if (!data) return null;

    const { avgCalories, avgProtein, percentile } = data;

    return (
        <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Global Sıralama 🌍</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Senin Sıralaman</span>
                        <span style={{ fontWeight: "bold", color: "hsl(var(--primary))" }}>Top %{percentile}</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", backgroundColor: "hsl(var(--secondary) / 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ width: `${100 - percentile}%`, height: "100%", backgroundColor: "hsl(var(--primary))" }} />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", marginTop: "0.5rem" }}>
                        Benzer kullanıcılardan daha istikrarlısın!
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ padding: "1rem", backgroundColor: "hsl(var(--background))", borderRadius: "1rem" }}>
                        <div style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>Ortalama Kalori</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{Math.round(avgCalories)} kcal</div>
                        <div style={{ fontSize: "0.8rem", color: userProfile.daily_calorie_goal > avgCalories ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                            {userProfile.daily_calorie_goal > avgCalories ? "Ortalama üstü" : "Ortalama altı"}
                        </div>
                    </div>
                    <div style={{ padding: "1rem", backgroundColor: "hsl(var(--background))", borderRadius: "1rem" }}>
                        <div style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>Ortalama Protein</div>
                        <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{Math.round(avgProtein)} g</div>
                        <div style={{ fontSize: "0.8rem", color: userProfile.daily_protein_goal > avgProtein ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                            {userProfile.daily_protein_goal > avgProtein ? "Ortalama üstü" : "Ortalama altı"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
