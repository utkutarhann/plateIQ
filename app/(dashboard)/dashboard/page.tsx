import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import FoodAnalyzer from "@/components/FoodAnalyzer";
import AdUnit from "@/components/AdUnit";
import GoalCelebration from "@/components/GoalCelebration";
import SuccessToast from "@/components/SuccessToast";
import DashboardView from "@/components/DashboardView";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch Profile for Goals
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    // Fetch Today's Logs for Summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayLogs } = await supabase
        .from("food_logs")
        .select("calories, protein, carbs, fat")
        .gte("created_at", today.toISOString());

    // Fetch Recent Logs for History
    const { data: recentLogs } = await supabase
        .from("food_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    // Calculate Totals
    const consumed = todayLogs?.reduce((acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Calculate Goals (Default if no profile)
    // If no profile exists or profile is incomplete (missing weight/height), redirect to onboarding
    const isProfileComplete = profile && profile.weight && profile.height;

    if (!isProfileComplete) {
        return redirect("/onboarding");
    }

    const { calculateGoals } = await import("@/lib/calculate-goals");
    const calculatedGoals = calculateGoals({
        gender: profile.gender || 'male',
        age: profile.age || 25,
        height: profile.height || 175,
        weight: profile.weight || 75,
        activity_level: profile.activity_level || 'moderate',
        goal: profile.goal || 'maintain',
        body_type: profile.body_type || 'mesomorph'
    });

    // Map to expected format and ensure valid numbers
    const goals = {
        calories: calculatedGoals.daily_calorie_goal || 2000,
        protein: calculatedGoals.daily_protein_goal || 150,
        carbs: calculatedGoals.daily_carbs_goal || 250,
        fat: calculatedGoals.daily_fat_goal || 70
    };

    const remainingCalories = goals.calories - consumed.calories;
    const progress = Math.min(100, (consumed.calories / goals.calories) * 100);

    const isGoalMet = progress >= 100;

    return (
        <DashboardView
            user={user}
            goals={goals}
            consumed={consumed}
            isGoalMet={isGoalMet}
            logs={recentLogs || []}
        />
    );
}
