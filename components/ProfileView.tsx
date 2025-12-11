"use client";

import { useState } from "react";
import Link from "next/link";
import InsightCard from "@/components/InsightCard";
import ProfileCharts from "@/components/ProfileCharts";
import Benchmarks from "@/components/Benchmarks";
import Challenges from "@/components/Challenges";
import GoalCelebration from "@/components/GoalCelebration";
import DailySummaryCard from "@/components/DailySummaryCard";
import { LogoutButton } from "@/components/ui/LogoutButton";
import DailyQuote from "@/components/DailyQuote";
import AllMealsModal from "@/components/AllMealsModal";
import RecentMeals from "@/components/RecentMeals";

interface ProfileViewProps {
    user: any;
    profile: any;
    logs: any[];
    dailyStats: any;
    insights: any[];
    isGoalMet: boolean;
}

export default function ProfileView({ user, profile, logs, dailyStats, insights, isGoalMet }: ProfileViewProps) {
    const [showCelebration, setShowCelebration] = useState(false);
    const [showAllMealsModal, setShowAllMealsModal] = useState(false);

    // Limit recent meals to 3
    const recentLogs = logs.slice(0, 3);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "4rem" }}>

            <GoalCelebration
                isGoalMet={isGoalMet}
                show={showCelebration}
                type={showCelebration ? 'challenge' : 'calorie'}
                onClose={() => setShowCelebration(false)}
            />

            {/* Daily Quote - Full Width */}
            <DailyQuote />

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }} className="lg:grid-cols-[2fr_1fr] grid-cols-1">
                {/* Main Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                    {/* Daily Summary */}
                    <DailySummaryCard
                        dailyStats={dailyStats}
                        goals={{
                            calories: profile.daily_calorie_goal,
                            protein: profile.daily_protein_goal,
                            carbs: profile.daily_carbs_goal,
                            fat: profile.daily_fat_goal
                        }}
                    />

                    {/* Recent Meals */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Son Öğünler</h2>
                            <button
                                onClick={() => setShowAllMealsModal(true)}
                                style={{ fontSize: "0.9rem", color: "hsl(var(--primary))", fontWeight: "500", background: "none", border: "none", cursor: "pointer" }}
                            >
                                Tümünü Gör
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "1rem" }}>
                            {recentLogs.length > 0 ? (
                                recentLogs.map((log) => (
                                    <div key={log.id} className="card group" style={{
                                        padding: "1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1.25rem",
                                        transition: "all 0.2s",
                                        cursor: "pointer",
                                        border: "1px solid transparent"
                                    }}>
                                        <div style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "1rem",
                                            overflow: "hidden",
                                            backgroundColor: "hsl(var(--muted))",
                                            flexShrink: 0,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                        }}>
                                            {log.image_url && log.image_url !== "placeholder" ? (
                                                <img src={log.image_url} alt={log.food_name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} className="group-hover:scale-110" />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", background: "hsl(var(--muted)/0.5)" }}>
                                                    🍽️
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                                <h3 style={{ fontWeight: "700", fontSize: "1.1rem", marginBottom: "0.25rem", color: "hsl(var(--foreground))" }}>{log.food_name}</h3>
                                                <span style={{ fontWeight: "700", color: "hsl(var(--primary))" }}>{log.calories} kcal</span>
                                            </div>
                                            <div style={{ fontSize: "0.85rem", color: "hsl(var(--muted-foreground))", marginBottom: "0.5rem" }}>
                                                {new Date(log.created_at).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })} • {log.portion_size === 'small' ? 'Küçük' : log.portion_size === 'medium' ? 'Orta' : 'Büyük'} Porsiyon
                                            </div>
                                            <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></span> {log.protein}g Prot</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308" }}></span> {log.carbs}g Karb</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></span> {log.fat}g Yağ</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    padding: "3rem",
                                    textAlign: "center",
                                    color: "hsl(var(--muted-foreground))",
                                    background: "hsl(var(--muted)/0.3)",
                                    borderRadius: "1.5rem",
                                    border: "2px dashed hsl(var(--border))"
                                }}>
                                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🥗</div>
                                    <p style={{ fontWeight: "500" }}>Henüz yemek kaydı yok.</p>
                                    <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>İlk yemeğini ekleyerek analize başla.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Analysis */}
                    <div className="card" style={{ padding: "2rem", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                            <div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Haftalık Analiz</h3>
                                <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))" }}>Son 7 günlük makro dağılımın</p>
                            </div>
                        </div>
                        <ProfileCharts logs={logs || []} />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                    {/* Section 5: AI Suggestions */}
                    <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>AI Önerileri 🤖</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {insights.length > 0 ? (
                                insights.map((insight, idx) => (
                                    // @ts-ignore
                                    <InsightCard key={idx} {...insight} />
                                ))
                            ) : (
                                <div className="card" style={{ padding: "1rem", textAlign: "center", color: "hsl(var(--muted-foreground))" }}>
                                    Henüz yeterli veri yok.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 4: Global Benchmark */}
                    <Benchmarks userProfile={profile} />

                    {/* Gamification */}
                    <Challenges onAllCompleted={() => setShowCelebration(true)} />
                </div>
            </div>
            <LogoutButton
                style={{
                    position: "fixed",
                    bottom: "2rem",
                    left: "2rem",
                    zIndex: 100
                }}
            />

            <AllMealsModal
                isOpen={showAllMealsModal}
                onClose={() => setShowAllMealsModal(false)}
                logs={logs}
            />
        </div>
    );
}
