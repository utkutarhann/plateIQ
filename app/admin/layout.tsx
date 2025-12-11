import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!userData || userData.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
            {/* Admin Sidebar */}
            <aside style={{
                width: "250px",
                background: "white",
                borderRight: "1px solid #e2e8f0",
                padding: "2rem 1rem",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                position: "fixed",
                height: "100vh",
                overflowY: "auto"
            }}>
                <div style={{ padding: "0 1rem" }}>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a" }}>PlateIQ Admin</h1>
                    <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Yönetim Paneli</p>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <AdminNavLink href="/admin" icon="📊" label="Dashboard" />
                    <AdminNavLink href="/admin/users" icon="👥" label="Kullanıcılar" />
                    <AdminNavLink href="/admin/foods" icon="🍎" label="Yemek Veritabanı" />
                    <AdminNavLink href="/admin/moderation" icon="🛡️" label="Moderasyon" />
                    <AdminNavLink href="/admin/settings" icon="⚙️" label="Ayarlar" />
                </nav>

                <div style={{ marginTop: "auto", padding: "0 1rem" }}>
                    <Link href="/dashboard" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        color: "#64748b",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        transition: "all 0.2s"
                    }}>
                        <span>⬅️</span> Uygulamaya Dön
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: "250px", padding: "2rem" }}>
                {children}
            </main>
        </div>
    );
}

function AdminNavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <Link href={href} style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            color: "#334155",
            textDecoration: "none",
            fontWeight: "500",
            transition: "background 0.2s"
        }} className="hover:bg-slate-100">
            <span style={{ fontSize: "1.2rem" }}>{icon}</span>
            {label}
        </Link>
    );
}
