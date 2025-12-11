"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Challenge = {
    id: string;
    title: string;
    description: string;
    target_count: number;
    unit: string;
    reward: string;
};

type UserChallenge = {
    challenge_id: string;
    progress: number;
    completed: boolean;
};

export default function Challenges({ onAllCompleted }: { onAllCompleted?: () => void }) {
    const supabase = createClient();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [userProgress, setUserProgress] = useState<Record<string, UserChallenge>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch all daily challenges
            const { data: challengesData } = await supabase
                .from("challenges")
                .select("*")
                .eq("type", "daily")
                .limit(3); // Show 3 random daily challenges (in a real app, rotate these daily)

            if (challengesData) {
                setChallenges(challengesData);
            }

            // Fetch user's progress for today
            const today = new Date().toISOString().split('T')[0];
            const { data: progressData } = await supabase
                .from("user_challenges")
                .select("*")
                .eq("user_id", user.id)
                .eq("date", today);

            const progressMap: Record<string, UserChallenge> = {};
            progressData?.forEach((p: any) => {
                progressMap[p.challenge_id] = {
                    challenge_id: p.challenge_id,
                    progress: p.progress,
                    completed: p.completed
                };
            });
            setUserProgress(progressMap);
        } catch (error) {
            console.error("Error fetching challenges:", error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleChallenge(challengeId: string, currentStatus: boolean) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newStatus = !currentStatus;
        const today = new Date().toISOString().split('T')[0];

        // Optimistic update
        const updatedProgress = {
            ...userProgress,
            [challengeId]: {
                challenge_id: challengeId,
                progress: newStatus ? 1 : 0,
                completed: newStatus
            }
        };
        setUserProgress(updatedProgress);

        // Check if all challenges are completed
        const allCompleted = challenges.every(c => {
            if (c.id === challengeId) return newStatus;
            return updatedProgress[c.id]?.completed;
        });

        if (allCompleted && onAllCompleted) {
            onAllCompleted();
        }

        try {
            // Check if record exists
            const { data: existing } = await supabase
                .from("user_challenges")
                .select("id")
                .eq("user_id", user.id)
                .eq("challenge_id", challengeId)
                .eq("date", today)
                .single();

            if (existing) {
                await supabase
                    .from("user_challenges")
                    .update({ completed: newStatus, progress: newStatus ? 1 : 0 })
                    .eq("id", existing.id);
            } else {
                await supabase
                    .from("user_challenges")
                    .insert({
                        user_id: user.id,
                        challenge_id: challengeId,
                        date: today,
                        completed: newStatus,
                        progress: newStatus ? 1 : 0
                    });
            }
        } catch (error) {
            console.error("Error updating challenge:", error);
            // Revert optimistic update on error
            fetchData();
        }
    }

    if (loading) return <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>Yükleniyor...</div>;

    return (
        <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Günün Görevleri 🏆</h3>
                <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>Her gün yenilenir</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {challenges.map(challenge => {
                    const progress = userProgress[challenge.id];
                    const isCompleted = progress?.completed || false;

                    return (
                        <div
                            key={challenge.id}
                            onClick={() => toggleChallenge(challenge.id, isCompleted)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                padding: "1rem",
                                border: `1px solid ${isCompleted ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                                borderRadius: "1rem",
                                backgroundColor: isCompleted ? "hsl(var(--primary) / 0.05)" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <div style={{
                                fontSize: "2rem",
                                filter: isCompleted ? "none" : "grayscale(100%)",
                                transition: "filter 0.3s"
                            }}>
                                {challenge.reward}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    textDecoration: isCompleted ? "line-through" : "none",
                                    color: isCompleted ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))"
                                }}>
                                    {challenge.title}
                                </h4>
                                <p style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>{challenge.description}</p>
                            </div>
                            <div style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: `2px solid ${isCompleted ? "hsl(var(--primary))" : "hsl(var(--muted))"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isCompleted ? "hsl(var(--primary))" : "transparent"
                            }}>
                                {isCompleted && <span style={{ color: "white", fontSize: "0.8rem" }}>✓</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
