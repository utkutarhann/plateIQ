"use client";

import * as React from "react";


// Since we don't have radix-ui installed, we'll create a simple custom Tooltip component
// If the user had radix-ui, we would use that. For now, a simple CSS-based one or state-based one.

export function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginBottom: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#1f2937",
                    color: "white",
                    fontSize: "0.75rem",
                    borderRadius: "0.375rem",
                    whiteSpace: "nowrap",
                    zIndex: 50,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    pointerEvents: "none"
                }}>
                    {content}
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderWidth: "4px",
                        borderStyle: "solid",
                        borderColor: "#1f2937 transparent transparent transparent"
                    }} />
                </div>
            )}
        </div>
    );
}
