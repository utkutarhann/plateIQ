import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
            {/* Hero Skeleton */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <Skeleton style={{ width: "200px", height: "32px", margin: "0 auto 1rem" }} />
                <Skeleton style={{ width: "300px", height: "20px", margin: "0 auto" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Food Analyzer Skeleton */}
                    <Skeleton style={{ width: "100%", height: "300px", borderRadius: "1.5rem" }} />

                    {/* Summary Card Skeleton */}
                    <Skeleton style={{ width: "100%", height: "200px", borderRadius: "1.5rem" }} />

                    {/* Recent Meals Skeleton */}
                    <Skeleton style={{ width: "100%", height: "400px", borderRadius: "1.5rem" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* AI Suggestions Skeleton */}
                    <Skeleton style={{ width: "100%", height: "150px", borderRadius: "1rem" }} />
                    <Skeleton style={{ width: "100%", height: "150px", borderRadius: "1rem" }} />
                </div>
            </div>
        </div>
    );
}
