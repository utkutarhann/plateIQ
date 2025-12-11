import { createClient } from "@/lib/supabase/server";
import WeightTabs from "./WeightTabs";

export default async function WeightPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch weight logs, measurements, and user profile
    const [logsResult, measurementsResult, profileResult] = await Promise.all([
        supabase.from("weight_logs").select("*").eq("user_id", user.id).order("date", { ascending: true }),
        supabase.from("body_measurements").select("*").eq("user_id", user.id).order("date", { ascending: true }),
        supabase.from("user_profiles").select("*").eq("user_id", user.id).single()
    ]);

    const logs = logsResult.data || [];
    const measurements = measurementsResult.data || [];
    const profile = profileResult.data;

    // Get current weight (last log)
    const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : (profile?.weight || 0);

    // Calculate change (vs first log)
    const startWeight = logs.length > 0 ? logs[0].weight : currentWeight;
    const change = currentWeight - startWeight;

    // BMI Calculation
    const heightM = (profile?.height || 175) / 100;
    const bmi = currentWeight / (heightM * heightM);
    let bmiStatus = "Normal";
    let bmiColor = "#10b981";
    if (bmi < 18.5) { bmiStatus = "Zayıf"; bmiColor = "#3b82f6"; }
    else if (bmi >= 25 && bmi < 30) { bmiStatus = "Fazla Kilolu"; bmiColor = "#eab308"; }
    else if (bmi >= 30) { bmiStatus = "Obez"; bmiColor = "#ef4444"; }

    // Target Calculation
    const targetWeight = profile?.target_weight || profile?.weight || 0; // Fallback if no target
    const remaining = currentWeight - targetWeight;

    // Simple estimation: Avg loss per week based on last 4 weeks
    // For now, let's just show the remaining amount

    return (
        <div style={{
            minHeight: "calc(100vh - 60px)",
            height: "100%",
            background: "#f8f9fa",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, animation: "fadeIn 0.5s ease-out" }}>
                <header style={{ marginBottom: "1.5rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#111", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                        Kilo ve Vücut Takibi ⚖️
                    </h1>
                    <p style={{ color: "#666", fontSize: "0.95rem" }}>
                        İlerlemeni takip et, hedefine ulaş ve vücudundaki değişimi gör.
                    </p>
                </header>

                <WeightTabs
                    userId={user.id}
                    weightLogs={logs}
                    measurementLogs={measurements}
                    currentWeight={currentWeight}
                    change={change}
                    bmi={bmi}
                    bmiStatus={bmiStatus}
                    bmiColor={bmiColor}
                    targetWeight={targetWeight}
                    remaining={remaining}
                />
            </div>
        </div>
    );
}
