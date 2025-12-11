"use client";

import { signup, signInWithGoogle } from "@/app/(auth)/actions";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
export function SignupForm({ message }: { message?: string }) {
    const { t } = useLanguage();

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            position: "relative",
            backgroundColor: "hsl(var(--background))"
        }}>
            <div style={{ width: "100%", maxWidth: "420px", animation: "fadeIn 0.5s ease-out" }}>
                <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                        {t("signup.title")}
                    </h1>
                    <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "1rem" }}>
                        {t("signup.subtitle")}
                    </p>
                </div>

                <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label htmlFor="email" style={{ fontSize: "0.9rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                            {t("signup.email")}
                        </label>
                        <input
                            className="input"
                            name="email"
                            placeholder="ornek@email.com"
                            required
                            style={{
                                padding: "0.875rem",
                                borderRadius: "1rem",
                                border: "1px solid hsl(var(--border))",
                                backgroundColor: "hsl(var(--background))",
                                color: "hsl(var(--foreground))",
                                fontSize: "1rem",
                                transition: "all 0.2s"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label htmlFor="password" style={{ fontSize: "0.9rem", fontWeight: "600", color: "hsl(var(--foreground))" }}>
                            {t("signup.password")}
                        </label>
                        <input
                            className="input"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            style={{
                                padding: "0.875rem",
                                borderRadius: "1rem",
                                border: "1px solid hsl(var(--border))",
                                backgroundColor: "hsl(var(--background))",
                                color: "hsl(var(--foreground))",
                                fontSize: "1rem"
                            }}
                        />
                    </div>

                    <button formAction={signup} className="btn btn-primary" style={{
                        marginTop: "0.5rem",
                        padding: "1rem",
                        borderRadius: "1rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        boxShadow: "0 4px 12px hsl(var(--primary) / 0.2)"
                    }}>
                        {t("signup.submit")}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
                        <div style={{ flex: 1, height: "1px", backgroundColor: "hsl(var(--border))" }}></div>
                        <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", fontWeight: "500" }}>
                            {t("signup.or")}
                        </span>
                        <div style={{ flex: 1, height: "1px", backgroundColor: "hsl(var(--border))" }}></div>
                    </div>

                    <button formAction={signInWithGoogle} formNoValidate className="btn" style={{
                        backgroundColor: "white",
                        border: "1px solid hsl(var(--border))",
                        color: "black",
                        padding: "1rem",
                        borderRadius: "1rem",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem"
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {t("signup.google")}
                    </button>

                    {message && (
                        <p style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))", borderRadius: "1rem", fontSize: "0.9rem", textAlign: "center", fontWeight: "500" }}>
                            {message}
                        </p>
                    )}
                </form>

                <p style={{ marginTop: "2.5rem", textAlign: "center", fontSize: "0.95rem", color: "hsl(var(--muted-foreground))" }}>
                    {t("signup.login_prompt")}{" "}
                    <Link href="/login" style={{ color: "hsl(var(--primary))", textDecoration: "none", fontWeight: "600" }}>
                        {t("signup.login_link")}
                    </Link>
                </p>
            </div>
        </div>
    );
}

