import React, { useState, useEffect } from "react";
import { getAdminDashboard } from "../../services/api";

// ==============================================================================
// ADMIN DASHBOARD (YÖNETİCİ PANELİ)
// ==============================================================================
// Bu sayfa SADECE "Admin" rolüne sahip kullanıcılar tarafından görülebilir.
// Yönetici burada site genelindeki kullanıcı sayılarını, mesaj trafiğini
// görebilecek ve kullanıcıları yönetebilecek.

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTranslators: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getAdminDashboard();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Admin dashboard hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Yönetici Paneli (Admin)</h1>
      <p>Sistem genel durumunu buradan izleyebilirsiniz.</p>

      {/* İSTATİSTİK KARTLARI */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Kart 1: Toplam Kullanıcı */}
        <div style={cardStyle}>
          <h3>Toplam Kullanıcı</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {stats.totalUsers}
          </p>
        </div>

        {/* Kart 2: Toplam Çevirmen */}
        <div style={{ ...cardStyle, borderLeft: "5px solid purple" }}>
          <h3>Toplam Çevirmen</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "purple" }}>
            {stats.totalTranslators}
          </p>
        </div>

        {/* Kart 3: Toplam Mesaj */}
        <div style={{ ...cardStyle, borderLeft: "5px solid orange" }}>
          <h3>Toplam Mesaj</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "orange" }}>
            {stats.totalMessages}
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

export default AdminDashboard;
