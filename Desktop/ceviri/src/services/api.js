import axios from "axios";

// 1. Temel yapılandırma
const api = axios.create({
  baseURL: "/api", // Proxy üzerinden gidecek
  headers: { "Content-Type": "application/json" },
});

// 2. Token'ı her isteğe otomatik ekleyen "Interceptor" (Ajan)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Tarayıcı hafızasından token'ı al
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Varsa başlığa ekle
  }
  return config;
});

// ==============================================================================
// 3. API ENDPOINT TANIMLARI (Fonksiyonlar)
// ==============================================================================

// 🔐 AUTH (Kimlik Doğrulama) İŞLEMLERİ
// Kullanıcı giriş yaparken bu fonksiyonu çağırır.
// Endpoint: POST /auth/login
export const loginUser = (data) => api.post("/auth/login", data);

// Endpoint: POST /auth/register
export const registerUser = (data) => api.post("/auth/register", data);

// Endpoint: POST /auth/forgot-password
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

// ==============================================================================
// 🌍 PUBLIC (HERKESE AÇIK) İŞLEMLER
// ==============================================================================

// Çevirmenleri listeleme (Anasayfada vitrin için). Arama, filtreleme vb. parametreleri alabilir.
// Endpoint: GET /public/translators
export const getTranslators = (params) =>
  api.get("/public/translators", { params });

// Çevirmene mesaj gönderme (Müşteri veya ziyaretçi gönderir).
// Endpoint: POST /public/contact
export const sendContactMessage = (data) => api.post("/public/contact", data);

// ==============================================================================
// 🧑‍💼 TRANSLATOR (ÇEVİRMEN) PANELİ İŞLEMLERİ
// ==============================================================================

// Çevirmen dashboard verilerini (okunmamış mesaj sayısı, dil sayısı, profil görüntülenme vs.) getirir.
// Endpoint: GET /translator/dashboard
export const getTranslatorDashboard = () => api.get("/translator/dashboard");

// Çevirmenin kendine gelen mesajları listelemesi.
// Endpoint: GET /translator/messages
export const getTranslatorMessages = () => api.get("/translator/messages");

// ---------------------------------------------------------
// YENİ EKLENEN PROFİL VE İLAN İŞLEMLERİ (1️⃣ Tercüman İlan Sistemi)
// ---------------------------------------------------------

// Çevirmenin kendi profil/ilan bilgilerini getirmesi. (Tercüman profili sekmesinde dolacak)
// Endpoint: GET /admin/profile (Backend'de yanlışlıkla AdminController'a konduğu için geçici rota)
export const getTranslatorProfile = () => api.get("/admin/profile");

// Çevirmenin kendi profil bilgilerini oluşturması veya genel yapıda kaydetmesi.
// Endpoint: POST /translator/profile
export const createTranslatorProfile = (data) =>
  api.post("/translator/profile", data);

// (Geriye dönük uyumluluk için olan profil güncelleme endpoint'i)
// Endpoint: PUT /translator/profile
export const updateTranslatorProfile = (data) =>
  api.put("/translator/profile", data);

// Çevirmenin ilanını aktif (görünür) veya pasif (gizli) duruma getirmesi.
// Endpoint: PUT /translator/profile/toggle
export const toggleTranslatorProfileStatus = () =>
  api.put("/translator/profile/toggle");

// ---------------------------------------------------------
// YENİ EKLENEN BİLDİRİM İŞLEMLERİ (4️⃣ Bildirim Sistemi)
// ---------------------------------------------------------

// Çevirmene gelen tüm bildirimleri (mesaj, favori vs.) getirmesi.
// Endpoint: GET /translator/notifications
export const getTranslatorNotifications = () =>
  api.get("/translator/notifications");

// Çevirmenin seçtiği veya gördüğü bir bildirimi "Okundu" olarak işaretlemesi.
// Endpoint: PUT /translator/notifications/{id}/read
export const markNotificationAsRead = (id) =>
  api.put(`/translator/notifications/${id}/read`);

// ---------------------------------------------------------
// DİL İŞLEMLERİ
// ---------------------------------------------------------

// Çevirmenin bildiği dilleri listelemesi.
// Endpoint: GET /translator/languages
export const getTranslatorLanguages = () => api.get("/translator/languages");

// Çevirmenin yeni bir dil çifti eklemesi.
// Endpoint: POST /translator/languages
export const addTranslatorLanguage = (data) =>
  api.post("/translator/languages", data);

// Çevirmenin var olan bir dil çiftini güncellemesi.
// Endpoint: PUT /public/languages (Backend'de PublicController'da mevcut)
export const updateTranslatorLanguage = (data) =>
  api.put("/public/languages", data);

// Çevirmenin bir dil çiftini silmesi.
// Endpoint: DELETE /public/languages/{id} (Backend'de PublicController'da mevcut)
export const deleteTranslatorLanguage = (id) =>
  api.delete(`/public/languages/${id}`);

// ==============================================================================
// 🛒 CUSTOMER (MÜŞTERİ) PANELİ İŞLEMLERİ (3️⃣ Favori Sistemi)
// ==============================================================================

// Müşterinin bir çevirmeni favorilerine eklemesi (Kalp ikonuna tıklanınca).
// Endpoint: POST /customer/favorite/{translatorId}
export const addFavoriteTranslator = (translatorId) =>
  api.post(`/customer/favorite/${translatorId}`);

// Müşterinin bir çevirmeni favorilerinden çıkarması (Kalp tikini kaldırınca).
// Endpoint: DELETE /customer/favorite/{translatorId}
export const removeFavoriteTranslator = (translatorId) =>
  api.delete(`/customer/favorite/${translatorId}`);

// Müşterinin kendi favoriye eklediği tüm çevirmenlerin listesini getirmesi.
// Endpoint: GET /customer/favorites
export const getCustomerFavorites = () => api.get("/customer/favorites");

// Müşterinin kendi profil bilgilerini getirmesi.
// Endpoint: GET /customer/profile (Backend CustomerController'da mevcut)
export const getCustomerProfile = () => api.get("/customer/profile");

// Müşterinin kendi profilini güncellemesi.
// Endpoint: PUT /customer/profile (Backend CustomerController'da mevcut)
export const updateCustomerProfile = (data) =>
  api.put("/customer/profile", data);

// ==============================================================================
// 👑 ADMIN PANELİ İŞLEMLERİ
// ==============================================================================

// Admin dashboard verilerini (genel istatistikler) getirir.
// Endpoint: GET /admin/dashboard
export const getAdminDashboard = () => api.get("/admin/dashboard");

// Sistemdeki tüm kullanıcıları listeler (Yönetim için).
// Endpoint: GET /admin/users
export const getAdminUsers = () => api.get("/admin/users");

// Sistemdeki tüm mesajları görüntüler (Denetim için).
// Endpoint: GET /admin/messages
export const getAdminMessages = () => api.get("/admin/messages");

// Bir kullanıcının rolünü değiştirir (Admin, Translator, Customer).
// Endpoint: PUT /admin/users/change-role
export const changeUserRole = (data) =>
  api.put("/admin/users/change-role", data);

// Bir kullanıcıyı aktif veya pasif duruma getirir (Banlama/Açma).
// Endpoint: PUT /admin/users/toggle-active/{id}
export const toggleUserActiveStatus = (id) =>
  api.put(`/admin/users/toggle-active/${id}`);

export default api;
