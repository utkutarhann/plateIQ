"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

interface LogoutButtonProps {
    className?: string;
    style?: React.CSSProperties;
}

export function LogoutButton({ className, style }: LogoutButtonProps) {
    return (
        <form action={signOut}>
            <button
                type="submit"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem 2.5rem",
                    backgroundColor: "white",
                    color: "#ef4444", // Destructive red color
                    border: "none",
                    borderRadius: "999px",
                    boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.2), 0 4px 6px -2px rgba(0,0,0,0.05)", // Red-tinted shadow
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ...style
                }}
                className={`hover:bg-red-50 hover:scale-105 active:scale-95 ${className || ""}`}
            >
                <LogOut size={22} strokeWidth={2.5} />
                <span>Çıkış Yap</span>
            </button>
        </form>
    );
}
