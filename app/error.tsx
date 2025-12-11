"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Unhandled error:", error);
    }, [error]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
            background: "#f8f9fa"
        }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#111" }}>
                Bir şeyler ters gitti! 😕
            </h2>
            <p style={{ color: "#666", marginBottom: "2rem", maxWidth: "400px" }}>
                Beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya daha sonra ziyaret edin.
            </p>
            <button
                onClick={reset}
                style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    background: "#111",
                    color: "white",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer"
                }}
            >
                Tekrar Dene
            </button>
        </div>
    );
}
