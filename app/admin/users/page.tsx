import { createClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: users } = await supabase
        .from("users")
        .select(`
      *,
      user_profiles (
        goal,
        body_type
      )
    `)
        .order("created_at", { ascending: false });

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a" }}>Kullanıcı Yönetimi</h2>
            </div>

            <div style={{ background: "white", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                        <tr>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Kullanıcı</th>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Rol</th>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Hedef</th>
                            <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>Kayıt Tarihi</th>
                            <th style={{ padding: "1rem", textAlign: "right", fontSize: "0.875rem", fontWeight: "600", color: "#64748b" }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e2e8f0", overflow: "hidden" }}>
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>👤</div>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "500", color: "#0f172a" }}>{user.full_name || "İsimsiz"}</div>
                                            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "999px",
                                        fontSize: "0.75rem",
                                        fontWeight: "500",
                                        background: user.role === 'admin' ? '#dbeafe' : '#f1f5f9',
                                        color: user.role === 'admin' ? '#1e40af' : '#475569'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#475569" }}>
                                    {user.user_profiles?.goal || "-"}
                                </td>
                                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#475569" }}>
                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                </td>
                                <td style={{ padding: "1rem", textAlign: "right" }}>
                                    <button style={{ color: "#3b82f6", fontWeight: "500", fontSize: "0.875rem" }}>Düzenle</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
