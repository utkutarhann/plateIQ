"use client";

interface InsightCardProps {
    type: "success" | "warning" | "info";
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function InsightCard({ type, title, message, actionLabel, onAction }: InsightCardProps) {
    const colors = {
        success: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0", btn: "rgba(22, 101, 52, 0.1)" },
        warning: { bg: "#fef9c3", text: "#854d0e", border: "#fde047", btn: "rgba(133, 77, 14, 0.1)" },
        info: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe", btn: "rgba(30, 64, 175, 0.1)" },
    };

    const current = colors[type];

    return (
        <div
            className="card"
            style={{
                padding: "1rem",
                backgroundColor: current.bg,
                borderLeft: `4px solid ${current.border}`,
                marginBottom: "1rem",
                transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
                cursor: onAction ? "pointer" : "default",
                borderRadius: "var(--radius)", // Keep existing border-radius
                display: "flex",
                gap: "0.75rem",
                alignItems: "start"
            }}
            onMouseEnter={(e) => {
                if (onAction) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                }
            }}
            onMouseLeave={(e) => {
                if (onAction) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }
            }}
            onClick={onAction}
        >
            <div style={{ fontSize: "1.25rem" }}>
                {type === "success" ? "🎉" : type === "warning" ? "⚠️" : "💡"}
            </div>
            <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: "bold", color: current.text, marginBottom: "0.25rem" }}>{title}</h4>
                <p style={{ fontSize: "0.875rem", color: current.text, opacity: 0.9, marginBottom: actionLabel ? "0.75rem" : "0" }}>{message}</p>

                {actionLabel && (
                    <button
                        onClick={onAction}
                        style={{
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: current.text,
                            backgroundColor: current.btn,
                            padding: "0.4rem 0.8rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            cursor: "pointer",
                            transition: "opacity 0.2s"
                        }}
                        className="hover:opacity-80"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
