"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function WeightEntryForm({ userId }: { userId: string }) {
    const [weight, setWeight] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from("weight_logs")
                .insert({
                    user_id: userId,
                    weight: parseFloat(weight),
                    date: new Date().toISOString().split('T')[0],
                    note: note || null
                });

            if (error) throw error;

            // Also update user profile current weight
            await supabase
                .from("user_profiles")
                .update({ weight: parseFloat(weight) })
                .eq("user_id", userId);

            setWeight("");
            setNote("");
            router.refresh();
        } catch (error) {
            console.error("Error logging weight:", error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "relative",
            background: "linear-gradient(to right, #667eea, #764ba2)",
            padding: "2px",
            borderRadius: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        }}>
            <form onSubmit={handleSubmit} style={{
                background: "white",
                borderRadius: "calc(1rem - 2px)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.4rem", color: "#333" }}>
                            Kilo (kg)
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="input"
                                required
                                style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "bold",
                                    padding: "0.6rem 2.5rem 0.6rem 0.75rem",
                                    width: "100%",
                                    borderRadius: "0.5rem"
                                }}
                            />
                            <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#888", fontWeight: "500" }}>kg</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.4rem", color: "#666" }}>
                            Not <span style={{ fontWeight: "400", opacity: 0.7 }}>(Opsiyonel)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Bugün nasıl hissediyorsun?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="input"
                            style={{
                                fontSize: "0.9rem",
                                padding: "0.6rem 0.75rem",
                                width: "100%",
                                borderRadius: "0.5rem"
                            }}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "linear-gradient(to right, #667eea, #764ba2)",
                        color: "white",
                        padding: "1rem",
                        borderRadius: "0.75rem",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        boxShadow: "0 4px 6px -1px rgba(102, 126, 234, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    {loading ? (
                        <>⏳ Kaydediliyor...</>
                    ) : (
                        <>💾 Kaydet</>
                    )}
                </button>
            </form>
        </div>
    );
}
