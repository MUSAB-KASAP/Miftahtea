import React, { useState, useEffect } from "react";
import {
  getTranslatorProfile, // Backend'den sadece profil bilgilerini çekecek
  createTranslatorProfile, // Profili yeni bir ilan olarak POST edecek (veya güncelleyecek)
  toggleTranslatorProfileStatus, // İlanın durumunu Aktif/Pasif yapacak toggle fonksiyonu
} from "../../services/api";

// ==============================================================================
// PROFILE UPDATE (PROFİL GÜNCELLEME VE İLAN YÖNETİMİ)
// ==============================================================================
// Çevirmenin kendi ismini, biyografisini ve fotoğrafını güncellediği,
// aynı zamanda "İlanını" açıp kapatabildiği (Aktif/Pasif) sayfa.

const ProfileUpdate = () => {
  // Form Alanları State'leri
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // İlan Aktif/Pasif Durumu State'i
  const [isActive, setIsActive] = useState(false);

  // Yükleme (Loading) ve Hata Mesajı State'leri
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // Başarı veya hata mesajlarını ekranda göstermek için

  // 1. Sayfa açıldığında çevirmen profil bilgilerini backend'den çek
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Backend'deki GET /api/translator/profile endpoint'ini çağırıyoruz
      const res = await getTranslatorProfile();

      // Gelen yanıt başarılıysa formu doldur
      if (res.data.success && res.data.data) {
        const profileData = res.data.data;
        setFullName(profileData.fullName || "");
        setBio(profileData.bio || "");
        setPhotoUrl(profileData.photoUrl || "");

        // Backend'den "isActive" (İlan Aktif mi?) bilgisi true/false olarak dönmeli
        // Dönmüyorsa varsayılan false olsun.
        setIsActive(profileData.isActive || false);
      }
    } catch (error) {
      console.error("Profil bilgisi alınamadı:", error);
      // Profil daha önce hiç oluşturulmamış (404 Not Found) olabilir, panik yapmaya gerek yok.
    } finally {
      setLoading(false);
    }
  };

  // 2. Form gönderildiğinde profil bilgilerini kaydet/güncelle
  const handleUpdate = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle

    try {
      setMessage({ text: "Kaydediliyor...", type: "info" });

      // Backend'deki POST /api/translator/profile endpoint'ine datayı gönderiyoruz
      // Backend tarafında eğer ilan varsa güncelleyecek, yoksa oluşturacak.
      const res = await createTranslatorProfile({ fullName, bio, photoUrl });

      if (res.data.success) {
        setMessage({
          text: "Profiliniz (İlanınız) başarıyla güncellendi!",
          type: "success",
        });
      } else {
        setMessage({ text: "Güncelleme başarısız oldu.", type: "error" });
      }
    } catch (error) {
      setMessage({
        text:
          "Hata: " +
          (error.response?.data?.message || "Bilinmeyen bir hata oluştu"),
        type: "error",
      });
    }

    // 3 saniye sonra mesajı ekrandan kaldır
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // 3. İlan Durumunu (Aktif/Pasif) Değiştiren Fonksiyon
  const handleToggleStatus = async () => {
    try {
      // Backend'deki PUT /api/translator/profile/toggle endpoint'ini tetikler
      const res = await toggleTranslatorProfileStatus();

      if (res.data.success) {
        // Toggle başarılı olduysa UI'daki state'i (buton görünümünü) tersine çevir
        setIsActive(!isActive);
        setMessage({
          text: `İlanınız "${!isActive ? "Aktif" : "Pasif"}" duruma getirildi.`,
          type: "success",
        });
      }
    } catch (error) {
      setMessage({
        text:
          "Durum değiştirilirken hata oluştu: " +
          (error.response?.data?.message || "Hata"),
        type: "error",
      });
    }

    // 3 saniye sonra mesajı ekrandan kaldır
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  if (loading)
    return (
      <div style={{ padding: "20px" }}>Profil bilgileri yükleniyor...</div>
    );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Profil ve İlan Yönetimi</h2>

      {/* İlan Durumu Toggle Butonu (Aktif/Pasif) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
          background: isActive ? "#d4edda" : "#f8d7da", // Aktifse yeşilimsi, pasifse kırmızımsı arkaplan
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div>
          <strong>İlan Durumu: </strong>
          <span style={{ color: isActive ? "green" : "red" }}>
            {isActive
              ? "Aktif (Müşteriler sizi görebilir)"
              : "Pasif (Müşteriler sizi göremez)"}
          </span>
        </div>

        {/* Toggle Butonu */}
        <button
          onClick={handleToggleStatus}
          style={{
            padding: "8px 16px",
            background: isActive ? "#dc3545" : "#28a745", // Aktifse kırmızı "Gizle" butonu, Pasifse yeşil "Yayınla" butonu
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isActive ? "İlanı Gizle" : "İlanı Yayınla"}
        </button>
      </div>

      {/* Geri Bildirim Mesajı (Başarı/Hata) */}
      {message.text && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            color: "white",
            background:
              message.type === "success"
                ? "#28a745"
                : message.type === "error"
                  ? "#dc3545"
                  : "#17a2b8",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Profil Güncelleme Formu */}
      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* İsim Soyisim */}
        <div>
          <label style={{ fontWeight: "bold" }}>İsim Soyisim:</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Profil Fotoğrafı URL */}
        <div>
          <label style={{ fontWeight: "bold" }}>Profil Fotoğrafı URL:</label>
          <input
            type="text"
            value={photoUrl}
            placeholder="Örn: https://example.com/foto.jpg"
            onChange={(e) => setPhotoUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          {/* Fotoğraf Önizlemesi */}
          {photoUrl && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={photoUrl}
                alt="Profil Önizleme"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #007BFF",
                }}
                onError={(e) => (e.target.style.display = "none")} // Resim kırıksa gizle
              />
            </div>
          )}
        </div>

        {/* Biyografi */}
        <div>
          <label style={{ fontWeight: "bold" }}>
            Biyografi (Kendinizi tanıtın):
          </label>
          <textarea
            rows="5"
            value={bio}
            placeholder="Eğitiminiz, uzmanlık alanlarınız, deneyimleriniz..."
            onChange={(e) => setBio(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          ></textarea>
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Profil Bilgilerimi Kaydet
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
