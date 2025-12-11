import { createClient } from "@/lib/supabase/server";

export default async function AdminFoodsPage() {
    const supabase = await createClient();

    const { data: foods } = await supabase
        .from("foods")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a" }}>Yemek Veritabanı</h2>
                <button className="btn btn-primary" style={{ fontSize: "0.875rem" }}>+ Yeni Yemek Ekle</button>
            </div>

            <div style={{ background: "white", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <tr>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Yemek Adı</th>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Kalori (kcal)</th>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Protein (g)</th>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Durum</th>
                            <th style={{ padding: "1rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods?.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                                    Henüz kayıtlı yemek yok.
                                </td>
                            </tr>
                        ) : (
                            foods?.map((food) => (
                                <tr key={food.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "1rem", fontWeight: "500", color: "#0f172a" }}>{food.name}</td>
                                    <td style={{ padding: "1rem", color: "#475569" }}>{food.calories}</td>
                                    <td style={{ padding: "1rem", color: "#475569" }}>{food.protein}</td>
                                    <td style={{ padding: "1rem" }}>
                                        <span style={{
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "999px",
                                            fontSize: "0.75rem",
                                            fontWeight: "500",
                                            background: food.is_verified ? '#dcfce7' : '#f1f5f9',
                                            color: food.is_verified ? '#166534' : '#475569'
                                        }}>
                                            {food.is_verified ? 'Onaylı' : 'Taslak'}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1rem", textAlign: "right" }}>
                                        <button style={{ color: "#3b82f6", fontWeight: "500", fontSize: "0.875rem", marginRight: "1rem" }}>Düzenle</button>
                                        <button style={{ color: "#ef4444", fontWeight: "500", fontSize: "0.875rem" }}>Sil</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
