"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ProfileCharts({ logs }: { logs: any[] }) {
    // Process logs to group by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const data = last7Days.map(date => {
        const dayLogs = logs.filter(log => log.created_at.startsWith(date));
        return {
            name: new Date(date).toLocaleDateString('tr-TR', { weekday: 'short' }),
            Protein: dayLogs.reduce((sum, log) => sum + (log.protein || 0), 0),
            Karb: dayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0),
            Yağ: dayLogs.reduce((sum, log) => sum + (log.fat || 0), 0),
        };
    });

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))" }}
                        cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                    />
                    <Legend />
                    <Bar dataKey="Protein" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Karb" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Yağ" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
