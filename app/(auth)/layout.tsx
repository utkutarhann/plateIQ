

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100vw",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem",
            background: "radial-gradient(circle at 50% 0%, #dcfce7 0%, #f1f5f9 100%)", // Stronger green-gray gradient
            position: "relative"
        }}>
            {/* Background Decor */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                backgroundImage: "radial-gradient(#94a3b8 1.5px, transparent 1.5px)", // Darker, slightly larger dots
                backgroundSize: "30px 30px", // Denser pattern
                opacity: 0.5, // Increased opacity
                zIndex: 0,
                pointerEvents: "none"
            }} />

            {/* Auth Card */}
            <div style={{
                width: "100%",
                maxWidth: "480px", // Slightly wider
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2.5rem", // More padding
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                borderRadius: "2rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.03)", // Premium shadow
                zIndex: 1,
                position: "relative"
            }}>
                <div style={{ width: "100%" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
