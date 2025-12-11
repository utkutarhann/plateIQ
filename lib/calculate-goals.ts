export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph';
export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle';

export interface UserProfile {
    gender: 'male' | 'female';
    age: number;
    height: number; // cm
    weight: number; // kg
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal: 'lose_weight' | 'maintain' | 'gain_muscle';
    body_type: 'ectomorph' | 'mesomorph' | 'endomorph';
}

export interface Goals {
    bmr: number;
    tdee: number;
    daily_calorie_goal: number;
    daily_protein_goal: number;
    daily_carbs_goal: number;
    daily_fat_goal: number;
}

export function calculateGoals(profile: UserProfile): Goals {
    // 1. Calculate BMR (Mifflin-St Jeor Equation)
    let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
    if (profile.gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // 2. Calculate TDEE (Total Daily Energy Expenditure)
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };
    const tdee = bmr * activityMultipliers[profile.activity_level];

    // 3. Calculate Calorie Goal based on Goal
    let calorieGoal = tdee;
    if (profile.goal === 'lose_weight') {
        calorieGoal = tdee - 500;
    } else if (profile.goal === 'gain_muscle') {
        calorieGoal = tdee + 300;
    }

    // 4. Calculate Macros (Simple split: 30% P, 35% C, 35% F for now, can be customized)
    // Adjusting for goals slightly
    let proteinRatio = 0.3;
    let fatRatio = 0.3;
    let carbsRatio = 0.4;

    if (profile.goal === 'gain_muscle') {
        proteinRatio = 0.35;
        carbsRatio = 0.45;
        fatRatio = 0.2;
    } else if (profile.goal === 'lose_weight') {
        proteinRatio = 0.4;
        carbsRatio = 0.3;
        fatRatio = 0.3;
    }

    // Body Type Adjustments (Simple heuristic)
    if (profile.body_type === 'endomorph') {
        carbsRatio -= 0.05;
        fatRatio += 0.05;
    } else if (profile.body_type === 'ectomorph') {
        carbsRatio += 0.05;
        fatRatio -= 0.05;
    }

    const daily_protein_goal = (calorieGoal * proteinRatio) / 4;
    const daily_carbs_goal = (calorieGoal * carbsRatio) / 4;
    const daily_fat_goal = (calorieGoal * fatRatio) / 9;

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        daily_calorie_goal: Math.round(calorieGoal),
        daily_protein_goal: Math.round(daily_protein_goal),
        daily_carbs_goal: Math.round(daily_carbs_goal),
        daily_fat_goal: Math.round(daily_fat_goal)
    };
}
