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
// Endpoint: POST /auth/forgot-password
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

// Endpoint: POST /auth/verify-sms
export const verifySms = (phone, code) =>
  api.post("/auth/verify-sms", null, { params: { phone, code } });

// 🌍 PUBLIC (HERKESE AÇIK) İŞLEMLER
// Çevirmenleri listeleme (Anasayfada vitrin için).
// Endpoint: GET /public/translators
export const getTranslators = () => api.get("/public/translators");

// Çevirmene mesaj gönderme (Müşteri veya ziyaretçi gönderir).
// Endpoint: POST /public/contact
export const sendContactMessage = (data) => api.post("/public/contact", data);

// 🧑‍💼 TRANSLATOR (ÇEVİRMEN) PANELİ İŞLEMLERİ
// Çevirmen dashboard verilerini (okunmamış mesaj sayısı, dil sayısı vb.) getirir.
// Endpoint: GET /translator/dashboard
export const getTranslatorDashboard = () => api.get("/translator/dashboard");

// Çevirmenin kendine gelen mesajları listelemesi.
// Endpoint: GET /translator/messages
export const getTranslatorMessages = () => api.get("/translator/messages");

// Çevirmenin kendi profil bilgilerini (isim, bio) güncellemesi.
// Endpoint: PUT /translator/update-profile
export const updateTranslatorProfile = (data) =>
  api.put("/translator/profile", data);

// Çevirmenin bildiği dilleri listelemesi.
// Endpoint: GET /translator/languages
export const getTranslatorLanguages = () => api.get("/translator/languages");

// Çevirmenin yeni bir dil çifti eklemesi.
// Endpoint: POST /translator/languages
export const addTranslatorLanguage = (data) =>
  api.post("/translator/languages", data);

// Çevirmenin var olan bir dil çiftini güncellemesi.
// Endpoint: PUT /translator/languages
export const updateTranslatorLanguage = (data) =>
  api.put("/translator/languages", data);

// Çevirmenin bir dil çiftini silmesi.
// Endpoint: DELETE /translator/languages/{id}
export const deleteTranslatorLanguage = (id) =>
  api.delete(`/translator/languages/${id}`);

// 👑 ADMIN PANELİ İŞLEMLERİ
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
