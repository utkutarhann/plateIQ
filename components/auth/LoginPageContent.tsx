"use client";

import { useState, useEffect } from "react";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";

import { useLanguage } from "@/components/providers/LanguageProvider";



export default function LoginPageContent({ message }: { message?: string }) {
    const { t } = useLanguage();
    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.5s ease-out"
        }}>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                    {t("login.title")}
                </h1>
                <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "1rem" }}>
                    {t("login.subtitle")}
                </p>
            </div>

            <LoginForm message={message} />

            <p style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.95rem", color: "hsl(var(--muted-foreground))" }}>
                {t("login.signup_prompt")}{" "}
                <Link href="/signup" style={{ color: "hsl(var(--primary))", textDecoration: "none", fontWeight: "600" }}>
                    {t("login.signup_link")}
                </Link>
            </p>
        </div>
    );
}
