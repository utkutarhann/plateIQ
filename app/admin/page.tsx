import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch Stats
    const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true });
    const { count: photoCount } = await supabase.from("food_logs").select("*", { count: "exact", head: true });

    // Calculate DAU (Unique users who logged a meal today)
    const today = new Date().toISOString().split('T')[0];
    const { count: dauCount } = await supabase
        .from("food_logs")
        .select("user_id", { count: "exact", head: true })
        .gte("created_at", today);

    return (
        <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "2rem", color: "#0f172a" }}>Genel Bakış</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                <StatCard title="Toplam Kullanıcı" value={userCount || 0} icon="👥" color="bg-blue-50 text-blue-600" />
                <StatCard title="Toplam Fotoğraf" value={photoCount || 0} icon="📸" color="bg-purple-50 text-purple-600" />
                <StatCard title="Bugünkü Aktif Kullanıcı (DAU)" value={dauCount || 0} icon="⚡" color="bg-green-50 text-green-600" />
            </div>

            <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Son Aktiviteler</h3>
                <p style={{ color: "#64748b" }}>Grafik ve detaylı raporlar yakında eklenecek.</p>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    return (
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className={color} style={{ width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>{title}</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a" }}>{value}</p>
            </div>
        </div>
    );
}
