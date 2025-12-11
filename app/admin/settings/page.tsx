export default function AdminSettingsPage() {
    return (
        <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "2rem", color: "#0f172a" }}>Ayarlar</h2>

            <div style={{ background: "white", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "2rem", maxWidth: "600px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#0f172a" }}>Yapay Zeka Parametreleri</h3>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.5rem" }}>
                        OpenAI API Key
                    </label>
                    <input
                        type="password"
                        value="sk-........................"
                        disabled
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#94a3b8" }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                        API anahtarı çevresel değişkenlerden (ENV) okunmaktadır.
                    </p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.5rem" }}>
                        Kalori Hesaplama Modeli
                    </label>
                    <select style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", background: "white" }}>
                        <option>Standart (Harris-Benedict)</option>
                        <option>Mifflin-St Jeor</option>
                    </select>
                </div>

                <button className="btn btn-primary" style={{ width: "100%" }}>
                    Kaydet
                </button>
            </div>
        </div>
    );
}
