"use client";

import { useEffect } from "react";

type AdUnitProps = {
    slot: string;
    format?: "auto" | "fluid" | "rectangle";
    responsive?: boolean;
};

export default function AdUnit({ slot, format = "auto", responsive = true }: AdUnitProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    // In development, show a placeholder because AdSense won't work on localhost without specific setup
    if (process.env.NODE_ENV === 'development') {
        return (
            <div style={{
                width: "100%",
                minHeight: "100px",
                background: "#f1f5f9",
                border: "1px dashed #cbd5e1",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: "0.875rem"
            }}>
                Reklam Alanı (Slot: {slot})
            </div>
        );
    }

    return (
        <div style={{ overflow: "hidden", minHeight: "100px", textAlign: "center" }}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual Publisher ID
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}
