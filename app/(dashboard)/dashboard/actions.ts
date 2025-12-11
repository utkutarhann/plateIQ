"use server";

import { createClient } from "@/lib/supabase/server";

export async function getBenchmarks() {
    const supabase = await createClient();

    // In a real app, we would query the DB for averages.
    // For now, we'll mock this or do a simple query if we had enough data.
    // Let's try to get average from user_profiles if possible, otherwise mock.

    const { data: profiles } = await supabase
        .from("user_profiles")
        .select("daily_calorie_goal, daily_protein_goal");

    if (!profiles || profiles.length === 0) {
        return {
            avgCalories: 2000,
            avgProtein: 120,
            percentile: 50
        };
    }

    const totalCals = profiles.reduce((acc, p) => acc + (p.daily_calorie_goal || 0), 0);
    const totalProt = profiles.reduce((acc, p) => acc + (p.daily_protein_goal || 0), 0);

    return {
        avgCalories: totalCals / profiles.length,
        avgProtein: totalProt / profiles.length,
        percentile: 15 // Mock percentile for now as we don't have user specific rank logic yet
    };
}

export async function getTopFoods() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: logs } = await supabase
        .from("food_logs")
        .select("food_name")
        .eq("user_id", user.id);

    if (!logs) return [];

    const foodCounts: Record<string, number> = {};
    logs.forEach(log => {
        const name = log.food_name;
        foodCounts[name] = (foodCounts[name] || 0) + 1;
    });

    return Object.entries(foodCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
}

export async function getWeeklyStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { weekday: [], weekend: [] };

    // Fetch last 30 days logs
    const { data: logs } = await supabase
        .from("food_logs")
        .select("created_at, calories")
        .eq("user_id", user.id)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!logs) return { weekday: [], weekend: [] };

    let weekdayCals = 0;
    let weekdayCount = 0;
    let weekendCals = 0;
    let weekendCount = 0;

    logs.forEach(log => {
        const date = new Date(log.created_at);
        const day = date.getDay();
        const isWeekend = day === 0 || day === 6; // Sunday or Saturday

        if (isWeekend) {
            weekendCals += Number(log.calories);
            weekendCount++;
        } else {
            weekdayCals += Number(log.calories);
            weekdayCount++;
        }
    });

    return {
        weekdayAvg: weekdayCount ? Math.round(weekdayCals / weekdayCount) : 0,
        weekendAvg: weekendCount ? Math.round(weekendCals / weekendCount) : 0
    };
}
