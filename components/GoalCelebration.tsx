"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { X } from "lucide-react";

export default function GoalCelebration({
    isGoalMet,
    show = false,
    type = 'calorie',
    onClose
}: {
    isGoalMet: boolean;
    show?: boolean;
    type?: 'calorie' | 'challenge';
    onClose?: () => void;
}) {
    const [hasCelebrated, setHasCelebrated] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if ((isGoalMet || show) && !hasCelebrated && !isDismissed) {
            const duration = 4 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: 0.5, y: 0.5 } });
            }, 250);

            setHasCelebrated(true);
        }
    }, [isGoalMet, show, hasCelebrated, isDismissed]);

    // Reset celebration state if show becomes false (allows re-triggering)
    useEffect(() => {
        if (!show && !isGoalMet) {
            setHasCelebrated(false);
            setIsDismissed(false);
        }
    }, [show, isGoalMet]);

    if ((!isGoalMet && !show) || isDismissed) return null;

    const message = type === 'challenge'
        ? "Günlük sağlıklı yaşam görevlerini tamamladın!"
        : t("goal.message");

    const handleClose = () => {
        setIsDismissed(true);
        if (onClose) onClose();
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto" // Changed to auto to allow clicking the button
        }}>
            <div className="animate-bounce-in" style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "2rem 3rem",
                borderRadius: "2rem",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.5)",
                maxWidth: "90%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem"
            }}>
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        color: "hsl(var(--muted-foreground))"
                    }}
                    className="hover:bg-muted transition-colors"
                >
                    <X size={24} />
                </button>

                <div style={{ fontSize: "4rem" }}>🎉</div>
                <div>
                    <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "hsl(var(--primary))", marginBottom: "0.5rem" }}>
                        {t("goal.congrats")}
                    </h2>
                    <p style={{ fontSize: "1.2rem", color: "hsl(var(--foreground))", fontWeight: "500" }}>
                        {message}
                    </p>
                </div>

                <button
                    onClick={handleClose}
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 2rem",
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        border: "none",
                        borderRadius: "999px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    className="hover:opacity-90 transition-opacity"
                >
                    Kapat
                </button>
            </div>
        </div>
    );
}
