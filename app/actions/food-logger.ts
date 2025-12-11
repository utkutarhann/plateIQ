"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logFood(data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Log the food
    const { error: logError } = await supabase.from("food_logs").insert({
        user_id: user.id,
        ...data
    });

    if (logError) throw new Error(logError.message);

    // 2. Handle Gamification (Streaks & Badges)
    const today = new Date().toISOString().split('T')[0];

    // Fetch profile
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("current_streak, longest_streak, last_log_date")
        .eq("user_id", user.id)
        .single();

    if (profile) {
        let newStreak = profile.current_streak;
        const lastLog = profile.last_log_date;

        if (lastLog === today) {
            // Already logged today, do nothing to streak
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastLog === yesterdayStr) {
                // Logged yesterday, increment streak
                newStreak += 1;
            } else {
                // Missed a day (or first log), reset to 1
                newStreak = 1;
            }
        }

        // Update profile
        await supabase.from("user_profiles").update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, profile.longest_streak),
            last_log_date: today
        }).eq("user_id", user.id);

        // Check & Award Badges
        const badgesToAward = [];

        // First Log Badge
        const { count } = await supabase.from("food_logs").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
        if (count === 1) badgesToAward.push('first_log');

        // Streak Badges
        if (newStreak >= 3) badgesToAward.push('streak_3');
        if (newStreak >= 7) badgesToAward.push('streak_7');
        if (newStreak >= 30) badgesToAward.push('streak_30');

        for (const badgeId of badgesToAward) {
            // Check if already earned
            const { data: existing } = await supabase
                .from("user_badges")
                .select("*")
                .eq("user_id", user.id)
                .eq("badge_id", badgeId)
                .single();

            if (!existing) {
                await supabase.from("user_badges").insert({
                    user_id: user.id,
                    badge_id: badgeId
                });
            }
        }
    }

    revalidatePath("/dashboard");
}

export async function getDailyAnalysisCount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    // Calculate start of today in TRT (UTC+3)
    const now = new Date();
    // Add 3 hours to get TRT time
    const trtNow = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    // Reset to start of day
    trtNow.setUTCHours(0, 0, 0, 0);
    // Subtract 3 hours to get UTC timestamp for start of TRT day
    const startOfTrtDay = new Date(trtNow.getTime() - (3 * 60 * 60 * 1000));

    const { count } = await supabase
        .from("food_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfTrtDay.toISOString());

    return count || 0;
}
