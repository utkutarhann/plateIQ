"use client";

import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

export default function WeightChart({ data, targetWeight }: { data: any[], targetWeight?: number }) {
    const [range, setRange] = useState<"7d" | "30d" | "all">("30d");

    if (!data || data.length === 0) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "hsl(var(--muted-foreground))" }}>
                Henüz veri yok.
            </div>
        );
    }

    // Filter and format data
    const filteredData = data.filter(log => {
        if (range === "all") return true;
        const date = new Date(log.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return range === "7d" ? diffDays <= 7 : diffDays <= 30;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartData = filteredData.map(log => ({
        date: new Date(log.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
        weight: log.weight,
        note: log.note
    }));

    // Calculate min/max for Y-axis domain to make chart look better
    const weights = chartData.map(d => d.weight);
    if (targetWeight) weights.push(targetWeight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const domainMin = Math.floor(minWeight - 1);
    const domainMax = Math.ceil(maxWeight + 1);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "1rem",
                    backdropFilter: "blur(4px)"
                }}>
                    <p style={{ fontWeight: "bold", marginBottom: "0.25rem", color: "hsl(var(--foreground))" }}>{label}</p>
                    <p style={{ color: "#764ba2", fontWeight: "700", fontSize: "1.25rem" }}>{payload[0].value} kg</p>
                    {payload[0].payload.note && (
                        <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid hsl(var(--border))" }}>
                            <p style={{ fontSize: "0.85rem", color: "hsl(var(--muted-foreground))" }}>
                                📝 {payload[0].payload.note}
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>Kilo Değişimi</h3>
                <div style={{ display: "flex", gap: "0.25rem", background: "hsl(var(--muted))", padding: "0.25rem", borderRadius: "999px" }}>
                    {[
                        { val: "7d", label: "7 Gün" },
                        { val: "30d", label: "30 Gün" },
                        { val: "all", label: "Tümü" }
                    ].map(opt => (
                        <button
                            key={opt.val}
                            onClick={() => setRange(opt.val as any)}
                            style={{
                                padding: "0.35rem 1rem",
                                borderRadius: "999px",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                border: "none",
                                background: range === opt.val ? "white" : "transparent",
                                color: range === opt.val ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                                boxShadow: range === opt.val ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#764ba2" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#764ba2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[domainMin, domainMax]}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {targetWeight && (
                            <ReferenceLine y={targetWeight} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Hedef", position: "right", fill: "#10b981", fontSize: 12 }} />
                        )}
                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="#764ba2"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorWeight)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#764ba2" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
