"use client";

import { useState, useMemo } from "react";
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface Log {
    id: string;
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    created_at: string;
    image_url?: string;
    portion_size?: string;
}

interface AllMealsModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: Log[];
}

type FilterType = 'daily' | 'weekly' | 'monthly' | 'range';

export default function AllMealsModal({ isOpen, onClose, logs }: AllMealsModalProps) {
    const [filterType, setFilterType] = useState<FilterType>('daily');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateRange, setDateRange] = useState<{ start: string, end: string }>({
        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logDate = new Date(log.created_at);
            const logDateStr = logDate.toISOString().split('T')[0];

            if (filterType === 'daily') {
                return logDateStr === selectedDate.toISOString().split('T')[0];
            } else if (filterType === 'weekly') {
                const startOfWeek = new Date(selectedDate);
                startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1); // Monday
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);

                return logDate >= startOfWeek && logDate <= endOfWeek;
            } else if (filterType === 'monthly') {
                return logDate.getMonth() === selectedDate.getMonth() && logDate.getFullYear() === selectedDate.getFullYear();
            } else if (filterType === 'range') {
                return logDateStr >= dateRange.start && logDateStr <= dateRange.end;
            }
            return true;
        });
    }, [logs, filterType, selectedDate, dateRange]);

    if (!isOpen) return null;

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        if (filterType === 'daily') {
            newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (filterType === 'weekly') {
            newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (filterType === 'monthly') {
            newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setSelectedDate(newDate);
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
        }}>
            <div className="card" style={{
                width: "100%",
                maxWidth: "600px",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                animation: "scaleIn 0.2s ease-out"
            }}>
                {/* Header */}
                <div style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid hsl(var(--border))",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Yemek Geçmişi</h2>
                    <button onClick={onClose} style={{ padding: "0.5rem", borderRadius: "50%", cursor: "pointer" }} className="hover:bg-muted">
                        <X size={20} />
                    </button>
                </div>

                {/* Filters */}
                <div style={{ padding: "1rem", borderBottom: "1px solid hsl(var(--border))", display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                    {(['daily', 'weekly', 'monthly', 'range'] as FilterType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "999px",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                border: filterType === type ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
                                backgroundColor: filterType === type ? "hsl(var(--primary)/0.1)" : "transparent",
                                color: filterType === type ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {type === 'daily' ? 'Günlük' : type === 'weekly' ? 'Haftalık' : type === 'monthly' ? 'Aylık' : 'Tarih Aralığı'}
                        </button>
                    ))}
                </div>

                {/* Date Navigation */}
                {filterType !== 'range' ? (
                    <div style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "hsl(var(--muted)/0.2)" }}>
                        <button onClick={() => navigateDate('prev')} style={{ padding: "0.5rem" }}><ChevronLeft size={20} /></button>
                        <span style={{ fontWeight: "600" }}>
                            {filterType === 'daily' && selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {filterType === 'weekly' && `Hafta: ${selectedDate.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}`}
                            {filterType === 'monthly' && selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => navigateDate('next')} style={{ padding: "0.5rem" }}><ChevronRight size={20} /></button>
                    </div>
                ) : (
                    <div style={{ padding: "1rem", display: "flex", gap: "1rem", alignItems: "center", background: "hsl(var(--muted)/0.2)" }}>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid hsl(var(--border))" }}
                        />
                        <span>-</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            style={{ padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid hsl(var(--border))" }}
                        />
                    </div>
                )}

                {/* List */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
                    {filteredLogs.length > 0 ? (
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {filteredLogs.map(log => (
                                <div key={log.id} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    padding: "0.75rem",
                                    borderRadius: "0.75rem",
                                    border: "1px solid hsl(var(--border))",
                                    background: "hsl(var(--card))"
                                }}>
                                    <div style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "0.5rem",
                                        overflow: "hidden",
                                        backgroundColor: "hsl(var(--muted))",
                                        flexShrink: 0
                                    }}>
                                        {log.image_url && log.image_url !== "placeholder" ? (
                                            <img src={log.image_url} alt={log.food_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🍽️</div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                            <h4 style={{ fontWeight: "600" }}>{log.food_name}</h4>
                                            <span style={{ fontWeight: "700", color: "hsl(var(--primary))" }}>{log.calories} kcal</span>
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>
                                            {new Date(log.created_at).toLocaleDateString('tr-TR')} • {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--muted-foreground))" }}>
                            Bu tarih aralığında kayıt bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
