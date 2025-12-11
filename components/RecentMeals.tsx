"use client";

import Link from "next/link";
import { Plus, Clock, MoreHorizontal } from "lucide-react";

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

interface RecentMealsProps {
    logs: Log[];
    onAddMeal?: () => void;
}

export default function RecentMeals({ logs, onAddMeal }: RecentMealsProps) {
    return (
        <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Son Öğünler</h2>
                <Link href="/dashboard/history" style={{ fontSize: "0.9rem", color: "hsl(var(--primary))", fontWeight: "600" }}>Tümünü Gör</Link>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
                {/* Add Meal CTA */}
                <button
                    onClick={onAddMeal}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        borderRadius: "1rem",
                        border: "2px dashed hsl(var(--border))",
                        background: "hsl(var(--muted)/0.3)",
                        color: "hsl(var(--muted-foreground))",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        width: "100%",
                        textAlign: "left"
                    }}
                    className="hover:bg-accent hover:text-accent-foreground group"
                >
                    <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "0.75rem",
                        background: "hsl(var(--background))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid hsl(var(--border))"
                    }}>
                        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Öğün Ekle</div>
                        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Fotoğraf yükle veya yazarak ekle</div>
                    </div>
                </button>

                {logs && logs.length > 0 ? (
                    logs.map((log) => (
                        <div key={log.id} className="group hover:bg-accent/50 hover:border-border" style={{
                            padding: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            transition: "all 0.2s",
                            cursor: "pointer",
                            borderRadius: "1rem",
                            border: "1px solid transparent"
                        }}>
                            <div style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "1rem",
                                overflow: "hidden",
                                backgroundColor: "hsl(var(--muted))",
                                flexShrink: 0,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                position: "relative"
                            }}>
                                {log.image_url && log.image_url !== "placeholder" ? (
                                    <img src={log.image_url} alt={log.food_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", background: "hsl(var(--secondary)/0.1)", color: "hsl(var(--secondary))" }}>
                                        {getMealIcon(log.created_at)}
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.25rem" }}>
                                    <h3 style={{ fontWeight: "600", fontSize: "1rem", color: "hsl(var(--foreground))" }}>{log.food_name}</h3>
                                    <span style={{ fontWeight: "700", color: "hsl(var(--primary))", fontSize: "0.9rem" }}>{log.calories} kcal</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", marginBottom: "0.5rem" }}>
                                    <Clock size={12} />
                                    <span>{formatTime(log.created_at)}</span>
                                    <span>•</span>
                                    <span>{log.portion_size === 'small' ? 'Küçük' : log.portion_size === 'medium' ? 'Orta' : 'Büyük'} Porsiyon</span>
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" }} /> {log.protein}g</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#eab308" }} /> {log.carbs}g</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }} /> {log.fat}g</span>
                                </div>
                            </div>

                            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-background rounded-full transition-all">
                                <MoreHorizontal size={16} className="text-muted-foreground" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{
                        textAlign: "center",
                        padding: "2rem",
                        backgroundColor: "hsl(var(--muted)/0.2)",
                        borderRadius: "1rem",
                        border: "2px dashed hsl(var(--border))"
                    }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🍽️</div>
                        <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Henüz yemek kaydı yok</h3>
                        <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            İlk yemeğini ekleyerek takibe başla!
                        </p>
                        <button
                            onClick={onAddMeal}
                            style={{
                                background: "hsl(var(--primary))",
                                color: "hsl(var(--primary-foreground))",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            İlk Yemeğini Ekle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function getMealIcon(dateString: string) {
    const hour = new Date(dateString).getHours();
    if (hour >= 5 && hour < 11) return "🌅"; // Breakfast
    if (hour >= 11 && hour < 17) return "🌞"; // Lunch
    if (hour >= 17 && hour < 22) return "🌙"; // Dinner
    return "🌑"; // Late night
}

function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' });
}
