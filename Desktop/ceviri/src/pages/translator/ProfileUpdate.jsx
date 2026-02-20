import React, { useState, useEffect } from "react";
import {
  updateTranslatorProfile,
  getTranslatorDashboard,
} from "../../services/api";

// ==============================================================================
// PROFILE UPDATE (PROFİL GÜNCELLEME)
// ==============================================================================
// Çevirmenin kendi ismini ve biyografisini güncellediği sayfa.
// Sayfa açılışında mevcut bilgileri getirmeye çalışır (Dashboard üzerinden).

const ProfileUpdate = () => {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Profil bilgisini almak için ayrı bir endpoint yoksa Dashboard'dan deneyebiliriz.
      // Veya backend'de /me gibi bir endpoint varsa o kullanılmalı.
      // Şimdilik Dashboard'dan veri geliyorsa oradan alalım.
      const res = await getTranslatorDashboard();
      if (res.data.success && res.data.data.translatorProfile) {
        setFullName(res.data.data.translatorProfile.fullName || "");
        setBio(res.data.data.translatorProfile.bio || "");
        setPhotoUrl(res.data.data.translatorProfile.photoUrl || "");
      }
    } catch (error) {
      console.error("Profil bilgisi alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateTranslatorProfile({ fullName, bio, photoUrl });
      if (res.data.success) {
        alert("Profil başarıyla güncellendi!");
      }
    } catch (error) {
      alert(
        "Güncelleme hatası: " +
          (error.response?.data?.message || "Bilinmeyen hata"),
      );
    }
  };

  if (loading) return <div>Profil yükleniyor...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Profil Bilgilerim</h1>
      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* İsim Soyisim */}
        <div>
          <label>İsim Soyisim:</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        {/* Profil Fotoğrafı */}
        <div>
          <label>Profil Fotoğrafı URL:</label>
          <input
            type="text"
            value={photoUrl}
            placeholder="https://example.com/my-photo.jpg"
            onChange={(e) => setPhotoUrl(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
          {photoUrl && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={photoUrl}
                alt="Önizleme"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}
        </div>

        {/* Biyografi */}
        <div>
          <label>Biyografi (Kendinizi tanıtın):</label>
          <textarea
            rows="5"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Güncelle
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
