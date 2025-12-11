"use client";

import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function MeasurementChart({ data }: { data: any[] }) {
    const [range, setRange] = useState<"30d" | "90d" | "all">("30d");

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
        return range === "30d" ? diffDays <= 30 : diffDays <= 90;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const chartData = filteredData.map(log => ({
        ...log,
        date: new Date(log.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
    }));

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "1rem" }}>
                {[
                    { val: "30d", label: "30 Gün" },
                    { val: "90d", label: "3 Ay" },
                    { val: "all", label: "Tümü" }
                ].map(opt => (
                    <button
                        key={opt.val}
                        onClick={() => setRange(opt.val as any)}
                        style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "999px",
                            fontSize: "0.8rem",
                            border: "none",
                            background: range === opt.val ? "hsl(var(--primary))" : "hsl(var(--muted))",
                            color: range === opt.val ? "white" : "hsl(var(--muted-foreground))",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                            domain={['auto', 'auto']}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "white",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="waist" name="Bel" stroke="#ef4444" strokeWidth={2} dot={false} connectNulls />
                        <Line type="monotone" dataKey="hips" name="Kalça" stroke="#eab308" strokeWidth={2} dot={false} connectNulls />
                        <Line type="monotone" dataKey="chest" name="Göğüs" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls />
                        <Line type="monotone" dataKey="thigh" name="Bacak" stroke="#8b5cf6" strokeWidth={2} dot={false} connectNulls />
                        <Line type="monotone" dataKey="bicep" name="Kol" stroke="#10b981" strokeWidth={2} dot={false} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
