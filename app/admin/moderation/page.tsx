import { createClient } from "@/lib/supabase/server";

export default async function AdminModerationPage() {
    const supabase = await createClient();

    const { data: logs } = await supabase
        .from("food_logs")
        .select(`
      *,
      users (full_name, email)
    `)
        .order("created_at", { ascending: false })
        .limit(50);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a" }}>Fotoğraf Moderasyonu</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {logs?.map((log) => (
                    <div key={log.id} style={{ background: "white", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                        <div style={{ height: "200px", background: "#f1f5f9", position: "relative" }}>
                            <img src={log.image_url} alt={log.food_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "0.5rem", background: "rgba(0,0,0,0.6)", color: "white", fontSize: "0.75rem" }}>
                                {new Date(log.created_at).toLocaleString('tr-TR')}
                            </div>
                        </div>
                        <div style={{ padding: "1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                                <h3 style={{ fontWeight: "600", color: "#0f172a" }}>{log.food_name}</h3>
                                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{log.calories} kcal</span>
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
                                Kullanıcı: {log.users?.full_name || log.users?.email}
                            </p>

                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", fontSize: "0.875rem", color: "#334155" }}>
                                    Düzelt
                                </button>
                                <button style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #fee2e2", background: "#fef2f2", fontSize: "0.875rem", color: "#ef4444" }}>
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
