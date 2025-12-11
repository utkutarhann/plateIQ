"use client";

import { useState, useEffect } from "react";

const quotes = [
    "Sağlık, her gün verdiğin küçük kararların toplamıdır.",
    "Bedenin senin tapınağın, ona iyi bak.",
    "Yediğin her şey ya hastalıkla savaşır ya da onu besler.",
    "Bugün kendine yapacağın en iyi yatırım, sağlıklı bir öğündür.",
    "Hareket etmek, bedenin mutluluk dilidir.",
    "Su içmek, hücrelerine 'seni seviyorum' demektir.",
    "Denge, mükemmellikten daha önemlidir.",
    "Sağlıklı yaşam bir varış noktası değil, bir yolculuktur.",
    "Tabağındaki renkler, hayatındaki enerjiyi yansıtır.",
    "Kendini sevmek, kendine iyi bakmakla başlar."
];

export default function DailyQuote() {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        // Use the date to select a consistent quote for the day
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const quoteIndex = dayOfYear % quotes.length;
        setQuote(quotes[quoteIndex]);
    }, []);

    return (
        <div className="card" style={{
            padding: "1.5rem",
            background: "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--secondary)/0.1) 100%)",
            border: "1px solid hsl(var(--primary)/0.2)",
            marginBottom: "2rem"
        }}>
            <h3 style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "hsl(var(--primary))",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
            }}>
                <span>💡</span> Günün Sözü
            </h3>
            <p style={{
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "hsl(var(--foreground))",
                lineHeight: "1.6"
            }}>
                "{quote}"
            </p>
        </div>
    );
}
