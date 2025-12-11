"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MeasurementEntryForm({ userId }: { userId: string }) {
    const [formData, setFormData] = useState({
        waist: "",
        hips: "",
        chest: "",
        neck: "",
        thigh: "",
        bicep: "",
        note: ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Filter out empty strings and convert to numbers
        const dataToSubmit: any = {
            user_id: userId,
            date: new Date().toISOString().split('T')[0],
            note: formData.note || null
        };

        const fields = ["waist", "hips", "chest", "neck", "thigh", "bicep"];
        let hasData = false;

        fields.forEach(field => {
            if (formData[field as keyof typeof formData]) {
                dataToSubmit[field] = parseFloat(formData[field as keyof typeof formData]);
                hasData = true;
            }
        });

        if (!hasData) {
            alert("Lütfen en az bir ölçü girin.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from("body_measurements")
                .insert(dataToSubmit);

            if (error) throw error;

            setFormData({
                waist: "",
                hips: "",
                chest: "",
                neck: "",
                thigh: "",
                bicep: "",
                note: ""
            });
            router.refresh();
        } catch (error) {
            console.error("Error logging measurements:", error);
            alert("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                    <label className="label">Bel (cm)</label>
                    <input name="waist" type="number" step="0.1" className="input" value={formData.waist} onChange={handleChange} placeholder="Örn: 80" />
                </div>
                <div>
                    <label className="label">Kalça (cm)</label>
                    <input name="hips" type="number" step="0.1" className="input" value={formData.hips} onChange={handleChange} placeholder="Örn: 100" />
                </div>
                <div>
                    <label className="label">Göğüs (cm)</label>
                    <input name="chest" type="number" step="0.1" className="input" value={formData.chest} onChange={handleChange} placeholder="Örn: 95" />
                </div>
                <div>
                    <label className="label">Boyun (cm)</label>
                    <input name="neck" type="number" step="0.1" className="input" value={formData.neck} onChange={handleChange} placeholder="Örn: 35" />
                </div>
                <div>
                    <label className="label">Bacak (cm)</label>
                    <input name="thigh" type="number" step="0.1" className="input" value={formData.thigh} onChange={handleChange} placeholder="Örn: 55" />
                </div>
                <div>
                    <label className="label">Kol (cm)</label>
                    <input name="bicep" type="number" step="0.1" className="input" value={formData.bicep} onChange={handleChange} placeholder="Örn: 30" />
                </div>
            </div>

            <div>
                <label className="label">Not (Opsiyonel)</label>
                <input name="note" type="text" className="input" value={formData.note} onChange={handleChange} placeholder="Not ekle..." />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>

            <style jsx>{`
                .label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    color: hsl(var(--foreground));
                }
            `}</style>
        </form>
    );
}
