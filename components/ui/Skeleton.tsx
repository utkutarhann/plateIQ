"use client";

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div
            className={className}
            style={{
                backgroundColor: "#e5e7eb",
                borderRadius: "0.5rem",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                ...style
            }}
        >
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}</style>
        </div>
    );
}
