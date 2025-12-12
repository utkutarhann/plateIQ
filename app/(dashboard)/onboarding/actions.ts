"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateGoals } from "@/lib/calculate-goals";

// Define the input type expected from the client form
export interface UserStats {
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal: 'lose_weight' | 'maintain' | 'gain_muscle';
    bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
}

export async function saveProfile(stats: UserStats) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // Map UserStats (old interface from client) to UserProfile (new interface expected by calculateGoals)
    // The client sends 'activityLevel' but calculateGoals expects 'activity_level'
    // The client sends 'bodyType' but calculateGoals expects 'body_type'
    const profile = {
        gender: stats.gender,
        age: stats.age,
        height: stats.height,
        weight: stats.weight,
        activity_level: stats.activityLevel,
        goal: stats.goal,
        body_type: stats.bodyType
    };

    const goals = calculateGoals(profile);

    const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        gender: stats.gender,
        age: stats.age,
        height: stats.height,
        weight: stats.weight,
        activity_level: stats.activityLevel,
        body_type: stats.bodyType,
        goal: stats.goal,
        bmr: goals.bmr,
        tdee: goals.tdee,
        daily_calorie_goal: goals.daily_calorie_goal,
        daily_protein_goal: goals.daily_protein_goal,
        daily_carbs_goal: goals.daily_carbs_goal,
        daily_fat_goal: goals.daily_fat_goal,
        updated_at: new Date().toISOString(),
    });

    if (error) {
        console.error("Supabase Error saving profile:", error);
        throw new Error(`Failed to save profile: ${error.message}`);
    }

    return { success: true };
}
