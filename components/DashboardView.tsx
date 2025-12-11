"use client";

import Link from "next/link";
import FoodAnalyzer from "@/components/FoodAnalyzer";
import AdUnit from "@/components/AdUnit";
import GoalCelebration from "@/components/GoalCelebration";
import SuccessToast from "@/components/SuccessToast";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LogoutButton } from "@/components/ui/LogoutButton";
import InsightCard from "@/components/InsightCard";
import { Plus } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface DashboardViewProps {
    user: any;
    goals: any;
    consumed: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    isGoalMet: boolean;
    logs?: any[]; // Added logs prop
}

export default function DashboardView({ user, goals, consumed, isGoalMet, logs }: DashboardViewProps) {
    const { t } = useLanguage();

    return (
        <>
            <SuccessToast />
            <div style={{ maxWidth: "100%", overflowX: "hidden", paddingBottom: "8rem" }}>
                {/* Header Navigation */}
                <nav style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 50,
                    width: "100%"
                }}>
                    {/* Left: Logo */}
                    <Link href="/dashboard" style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        opacity: 0.9,
                        transition: "opacity 0.2s"
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                            <span style={{ fontSize: "2rem", fontWeight: "900", color: "hsl(var(--foreground))", letterSpacing: "-0.03em" }}>
                                Plate<span style={{ color: "hsl(var(--primary))" }}>IQ</span>
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "hsl(var(--muted-foreground))", fontWeight: "500", letterSpacing: "0.05em", marginTop: "2px" }}>
                                Eat. Snap. Nurture.
                            </span>
                        </div>
                    </Link>

                    {/* Right: Profile Button */}
                    <Link href="/dashboard/profile" className="shadow-soft" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(10px)",
                        padding: "0.5rem 1.25rem 0.5rem 0.5rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease"
                    }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid hsl(var(--primary))",
                            position: "relative"
                        }}>
                            {user.user_metadata.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", background: "hsl(var(--primary))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span style={{ fontWeight: "600", color: "hsl(var(--foreground))", fontSize: "0.95rem" }}>{t("dashboard.profile")}</span>
                    </Link>
                </nav>

                {/* Background Image */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('/dashboard-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.5,
                    zIndex: 0,
                    maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                    pointerEvents: "none"
                }} />

                <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* Decorative Background Elements */}
                    <div className="animate-float" style={{
                        position: "absolute",
                        top: "-10%",
                        left: "5%",
                        width: "200px",
                        height: "200px",
                        background: "radial-gradient(circle, hsla(var(--primary), 0.2) 0%, transparent 70%)",
                        filter: "blur(40px)",
                        zIndex: -1
                    }} />
                    <div className="animate-float" style={{
                        position: "absolute",
                        top: "20%",
                        right: "5%",
                        width: "300px",
                        height: "300px",
                        background: "radial-gradient(circle, hsla(var(--secondary), 0.2) 0%, transparent 70%)",
                        filter: "blur(60px)",
                        zIndex: -1,
                        animationDelay: "2s"
                    }} />

                    <div style={{ maxWidth: "800px", animation: "slideUp 0.8s ease-out", textAlign: "center" }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1.5rem",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            color: "hsl(var(--primary))",
                            borderRadius: "999px",
                            fontWeight: "600",
                            marginBottom: "2rem",
                            fontSize: "0.9rem",
                            boxShadow: "var(--shadow-sm)"
                        }}>
                            <span style={{ fontSize: "1.2rem" }}>✨</span> {t("dashboard.ai_assistant")}
                        </div>

                        <h1 style={{
                            fontSize: "clamp(2.5rem, 6vw, 4rem)",
                            fontWeight: "800",
                            marginBottom: "1.5rem",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            color: "hsl(var(--foreground))"
                        }}>
                            {t("dashboard.welcome")}, <span style={{
                                background: "var(--gradient-primary)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "inline-block"
                            }}>{user.user_metadata.full_name?.split(' ')[0] || 'Kullanıcı'}</span>
                        </h1>

                        <h2 style={{
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            fontWeight: "800",
                            marginBottom: "1.5rem",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            color: "hsl(var(--foreground))"
                        }}>
                            {t("dashboard.hero_title_1")} <span style={{
                                background: "var(--gradient-primary)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                display: "inline-block"
                            }}>{t("dashboard.hero_title_2")}</span>,<br />
                            {t("dashboard.hero_title_3")}
                        </h2>

                        <p style={{
                            fontSize: "1.1rem",
                            color: "#333",
                            marginBottom: "3rem",
                            maxWidth: "600px",
                            margin: "0 auto 3rem",
                            lineHeight: 1.8
                        }}>
                            {t("dashboard.hero_subtitle")}
                        </p>
                    </div>

                    {/* Main Content - Centered */}
                    <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                            <div style={{ width: "100%", animation: "fadeIn 1.5s ease-out" }}>
                                <FoodAnalyzer isAuthenticated={true} />
                            </div>
                        </div>
                    </div>
                </div>

                <GoalCelebration isGoalMet={isGoalMet} />

                <div style={{ marginTop: "4rem" }}>
                    <AdUnit slot="dashboard-bottom" />
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
        </>
    );
}

