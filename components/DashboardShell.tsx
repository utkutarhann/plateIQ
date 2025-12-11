"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Hide sidebar only on the main dashboard page ("/" or "/dashboard")
    // Assuming the dashboard home is "/dashboard"
    const isDashboardHome = pathname === "/dashboard";

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {!isDashboardHome && <Sidebar />}

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: isDashboardHome ? "0" : "2rem",
                backgroundColor: "hsl(var(--background))",
                position: "relative"
            }}>
                <div style={{ maxWidth: isDashboardHome ? "100%" : "1200px", margin: "0 auto" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
