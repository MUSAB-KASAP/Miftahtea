import React, { useState, useEffect } from "react";
import { getTranslatorDashboard } from "../../services/api";

// ==============================================================================
// TRANSLATOR DASHBOARD (ÇEVİRMEN PANELİ)
// ==============================================================================
// Bu sayfa SADECE "Translator" rolüne sahip kullanıcılar tarafından görülebilir.
// Çevirmen burada kendisine gelen mesajları, çeviri istatistiklerini
// ve dil ayarlarını görecek.

const TranslatorDashboard = () => {
  // Verileri tutacak state
  // Varsayılan değerler: 0
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    languageCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getTranslatorDashboard();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard verisi alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Çevirmen Paneli</h1>
      <p>Hoş geldiniz, değerli çevirmenimiz. İşte durum özetiniz:</p>

      {/* İSTATİSTİK KARTLARI */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Kart 1: Toplam Mesaj */}
        <div style={cardStyle}>
          <h3>Toplam Mesaj</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {stats.totalMessages}
          </p>
        </div>

        {/* Kart 2: Okunmamış Mesaj */}
        <div style={{ ...cardStyle, borderLeft: "5px solid orange" }}>
          <h3>Okunmamış Mesaj</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "orange" }}>
            {stats.unreadMessages}
          </p>
        </div>

        {/* Kart 3: Dil Çiftleri */}
        <div style={{ ...cardStyle, borderLeft: "5px solid green" }}>
          <h3>Dil Çiftleri</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "green" }}>
            {stats.languageCount}
          </p>
        </div>
      </div>
    </div>
  );
};

// Basit kart stili
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  flex: 1,
  borderLeft: "5px solid #007BFF",
};

export default TranslatorDashboard;
