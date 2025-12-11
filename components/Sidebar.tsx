"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LogoutButton } from "@/components/ui/LogoutButton";

export default function Sidebar() {
    const pathname = usePathname();
    const isProfilePage = pathname === "/dashboard/profile";
    const { t } = useLanguage();

    return (
        <aside style={{
            width: "250px",
            backgroundColor: "hsl(var(--card))",
            borderRight: "1px solid hsl(var(--border))",
            padding: "2rem 1rem",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh"
        }}>
            <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                        <span style={{ fontSize: "2rem", fontWeight: "900", color: "hsl(var(--foreground))", letterSpacing: "-0.03em" }}>
                            Plate<span style={{ color: "hsl(var(--primary))" }}>IQ</span>
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "hsl(var(--muted-foreground))", fontWeight: "500", letterSpacing: "0.05em", marginTop: "2px" }}>
                            Eat. Snap. Nurture.
                        </span>
                    </div>
                </Link>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <Link href="/dashboard" className="nav-item" style={{
                    padding: "0.75rem",
                    borderRadius: "var(--radius)",
                    color: pathname === "/dashboard" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    textDecoration: "none",
                    backgroundColor: pathname === "/dashboard" ? "hsl(var(--primary) / 0.1)" : "transparent",
                    fontWeight: pathname === "/dashboard" ? "600" : "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <span>🏠</span> Ana Sayfa
                </Link>

                <Link href="/dashboard/profile" className="nav-item" style={{
                    padding: "0.75rem",
                    borderRadius: "var(--radius)",
                    color: pathname === "/dashboard/profile" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    textDecoration: "none",
                    backgroundColor: pathname === "/dashboard/profile" ? "hsl(var(--primary) / 0.1)" : "transparent",
                    fontWeight: pathname === "/dashboard/profile" ? "600" : "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <span>👤</span> {t("sidebar.home")}
                </Link>

                <Link href="/onboarding" className="nav-item" style={{
                    padding: "0.75rem",
                    borderRadius: "var(--radius)",
                    color: pathname === "/onboarding" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    textDecoration: "none",
                    backgroundColor: pathname === "/onboarding" ? "hsl(var(--primary) / 0.1)" : "transparent",
                    fontWeight: pathname === "/onboarding" ? "600" : "400",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                }}>
                    <span>🎯</span> {t("sidebar.goals")}
                </Link>
            </nav>

            <div style={{ marginTop: "auto", display: "flex", justifyContent: "center" }}>
                <LogoutButton />
            </div>
        </aside>
    );
}
