import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileView from "@/components/ProfileView";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch User Profile
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!profile) {
        return redirect("/onboarding");
    }

    // Fetch Recent Logs for Stats
    const { data: logs } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

    // Calculate Daily Stats
    const today = new Date().toISOString().split('T')[0];
    const todaysLogs = logs?.filter(log => new Date(log.created_at).toISOString().split('T')[0] === today) || [];

    const dailyStats = todaysLogs.reduce((acc, log) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbs) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Generate Insights
    const insights = [];
    if (dailyStats.calories > profile.daily_calorie_goal) {
        insights.push({ type: "warning", title: "Kalori Hedefi Aşıldı", message: `Bugün hedefini ${Math.round(dailyStats.calories - profile.daily_calorie_goal)} kcal aştın. Akşam yemeğinde daha hafif tercihler yapabilirsin.` });
    } else if (profile.daily_calorie_goal - dailyStats.calories < 300) {
        insights.push({ type: "success", title: "Hedefe Çok Yakınsın", message: "Günlük kalori hedefini tutturmak üzeresin, harika gidiyorsun!" });
    }

    if (dailyStats.protein < profile.daily_protein_goal * 0.5) {
        insights.push({ type: "info", title: "Protein İhtiyacı", message: "Bugün protein alımın biraz düşük kalmış. Bir sonraki öğününe tavuk, balık veya baklagil ekleyebilirsin." });
    }

    // General Goal Guidance (AI Persona)
    if (profile.goal === 'lose_weight') {
        insights.push({
            type: "info",
            title: "📉 Kilo Verme Stratejisi",
            message: "Kalori açığı oluştururken kas kütleni korumak için protein tüketimine dikkat etmelisin. Lifli sebzeler ve bol su tüketimi, tokluk hissini artırarak hedefine ulaşmanı kolaylaştıracaktır."
        });
    } else if (profile.goal === 'gain_muscle') {
        insights.push({
            type: "info",
            title: "💪 Kas İnşa Stratejisi",
            message: "Kas gelişimi için antrenman şiddetine paralel olarak kalori ve protein alımını artırmalısın. Özellikle antrenman sonrası karbonhidrat ve protein içeren öğünler toparlanmanı hızlandırır."
        });
    } else {
        insights.push({
            type: "info",
            title: "⚖️ Form Koruma Stratejisi",
            message: "Mevcut formunu korumak için dengeli beslenmeye ve porsiyon kontrolüne devam et. İşlenmiş gıdalardan kaçınmak ve aktif kalmak, uzun vadeli sağlığın için en iyi yatırımdır."
        });
    }

    // Calculate Goal Met Status
    const isGoalMet = dailyStats.calories >= profile.daily_calorie_goal;

    return (
        <ProfileView
            user={user}
            profile={profile}
            logs={logs || []}
            dailyStats={dailyStats}
            insights={insights}
            isGoalMet={isGoalMet}
        />
    );
}

function StatCard({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
    const percentage = Math.min(100, Math.round((current / target) * 100));

    return (
        <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>{label}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: color }}>{percentage}%</span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {Math.round(current)} <span style={{ fontSize: "0.875rem", color: "hsl(var(--muted-foreground))", fontWeight: "normal" }}>/ {target} {unit}</span>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "hsl(var(--secondary) / 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${percentage}%`, height: "100%", backgroundColor: color, transition: "width 0.5s ease" }} />
            </div>
        </div>
    );
}
