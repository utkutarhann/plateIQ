"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const success = searchParams.get("success");
        if (success === "meal_logged") {
            setMessage("🎉 Tebrikler! Öğün başarıyla kaydedildi.");
            setShow(true);

            // Clear the URL parameter
            const url = new URL(window.location.href);
            url.searchParams.delete("success");
            window.history.replaceState({}, "", url.pathname);

            // Auto-hide after 4 seconds
            const timer = setTimeout(() => {
                setShow(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                animation: "slideDown 0.5s ease-out, fadeOut 0.5s ease-out 3.5s forwards"
            }}
        >
            <div
                style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 40px rgba(16, 185, 129, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "1.1rem",
                    fontWeight: "600"
                }}
            >
                <span style={{ fontSize: "1.5rem" }}>✅</span>
                {message}
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
