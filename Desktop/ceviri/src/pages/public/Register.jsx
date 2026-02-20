import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
  FaTwitter,
} from "react-icons/fa";
import { registerUser } from "../../services/api";
import "../../css/login.css";

const countryCodes = [
  { code: "+90", short: "TR", name: "Türkiye" },
  { code: "+994", short: "AZ", name: "Azerbaijan" },
  { code: "+1", short: "US", name: "USA" },
  { code: "+44", short: "GB", name: "United Kingdom" }, // FlagCDN uses GB for UK
  { code: "+49", short: "DE", name: "Germany" },
  { code: "+33", short: "FR", name: "France" },
  { code: "+39", short: "IT", name: "Italy" },
  { code: "+34", short: "ES", name: "Spain" },
  { code: "+31", short: "NL", name: "Netherlands" },
  { code: "+32", short: "BE", name: "Belgium" },
  { code: "+7", short: "RU", name: "Russia" },
  { code: "+86", short: "CN", name: "China" },
  { code: "+81", short: "JP", name: "Japan" },
  { code: "+82", short: "KR", name: "South Korea" },
  { code: "+91", short: "IN", name: "India" },
  { code: "+61", short: "AU", name: "Australia" },
  { code: "+55", short: "BR", name: "Brazil" },
  { code: "+52", short: "MX", name: "Mexico" },
  { code: "+966", short: "SA", name: "Saudi Arabia" },
  { code: "+971", short: "AE", name: "UAE" },
  { code: "+20", short: "EG", name: "Egypt" },
  { code: "+98", short: "IR", name: "Iran" },
  { code: "+964", short: "IQ", name: "Iraq" },
  { code: "+30", short: "GR", name: "Greece" },
  { code: "+359", short: "BG", name: "Bulgaria" },
  { code: "+380", short: "UA", name: "Ukraine" },
  { code: "+77", short: "KZ", name: "Kazakhstan" },
  { code: "+963", short: "SY", name: "Syria" },
];

const Register = () => {
  const navigate = useNavigate();

  /* Form verileri */
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "+90",
    role: "Customer",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email öneri sistemi için state
  const emailDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  // Custom Dropdown State
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Telefon numarası formatlama fonksiyonu
  const formatPhoneNumber = (value, countryCode) => {
    // Sadece rakamları al
    const cleaned = value.replace(/\D/g, "");

    // Türkiye (+90) için özel format: 5XX XXX XX XX
    if (countryCode === "+90") {
      if (cleaned.length === 0) return "";
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6)
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      if (cleaned.length <= 8)
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    }

    // Diğer ülkeler için genel format (3'erli gruplama)
    return cleaned.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    // Telefon numarası formatlama
    if (id === "phoneNumber") {
      const formatted = formatPhoneNumber(value, data.countryCode);
      if (formatted.replace(/\D/g, "").length > 15) return; // Max uzunluk kontrolü
      setData({ ...data, [id]: formatted });
      if (error) setError("");
      return;
    }

    // Email öneri mantığı
    if (id === "email") {
      const [localPart, domainPart] = value.split("@");
      if (value.includes("@")) {
        if (!domainPart) {
          setEmailSuggestions(
            emailDomains.map((domain) => `${localPart}@${domain}`),
          );
        } else {
          const filtered = emailDomains
            .filter((domain) => domain.startsWith(domainPart))
            .map((domain) => `${localPart}@${domain}`);
          setEmailSuggestions(filtered);
        }
      } else {
        setEmailSuggestions([]);
      }
    }

    setData({ ...data, [id]: value });
    // Kullanıcı yazarken hataları temizle
    if (error) setError("");
  };

  const handleEmailSuggestionClick = (suggestedEmail) => {
    setData({ ...data, email: suggestedEmail });
    setEmailSuggestions([]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    // Temizlenmiş telefon numarası (Boşluksuz)
    const cleanPhoneNumber = data.phoneNumber.replace(/\D/g, "");

    // 1. Koşul: Boş alan kontrolü
    // 1. Koşul: Boş alan kontrolü
    if (!data.fullName || !data.email || !data.password || !cleanPhoneNumber) {
      setError("Her alanı doldurmak zorunludur.");
      return;
    }

    // 2. Koşul: Geçerli e-posta formatı
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Geçersiz e-posta formatı.");
      return;
    }

    // 3. Koşul: Şifre uzunluğu ve karmaşıklığı
    if (data.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);

    try {
      // API'ye gönderilecek veriyi hazırla (Ülke kodu ile telefonu birleştir)
      const payload = {
        ...data,
        phoneNumber: `${data.countryCode}${cleanPhoneNumber}`,
      };

      const res = await registerUser(payload);
      if (res.data.success) {
        setMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        setData({
          fullName: "",
          email: "",
          password: "",
          phoneNumber: "",
          countryCode: "+90",
          role: "Customer",
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Kayıt işlemi sırasında bir hata oluştu.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="auth-container">
        <div className="heading">Kayıt Olun</div>

        <form className="form" onSubmit={handleFormSubmit}>
          {/* FullName Input */}
          <input
            required
            className="input"
            type="text"
            placeholder="Ad Soyad"
            id="fullName"
            value={data.fullName}
            onChange={handleInputChange}
            autoComplete="name"
          />

          {/* Email Input */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              required
              className="input"
              type="text"
              placeholder="Email"
              id="email"
              value={data.email}
              onChange={handleInputChange}
              autoComplete="off"
            />
            {/* Email Önerileri Listesi */}
            {emailSuggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "15px",
                  right: "15px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                  listStyle: "none",
                  padding: "0",
                  margin: "0",
                  zIndex: 100,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                {emailSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleEmailSuggestionClick(suggestion)}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#555",
                      borderBottom:
                        index !== emailSuggestions.length - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f2f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "white")
                    }
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Password Input */}
          <div className="password-wrapper">
            <input
              required
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="Şifre"
              id="password"
              value={data.password}
              onChange={handleInputChange}
            />
            <span
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* PhoneNumber Input with Country Code */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {/* Custom Ülke Kodu Seçimi */}
            <div
              style={{ width: "120px", position: "relative" }}
              id="custom-dropdown-container"
            >
              <div
                className="input"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                style={{
                  width: "100%",
                  padding: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  userSelect: "none",
                }}
              >
                {(() => {
                  const selected =
                    countryCodes.find((c) => c.code === data.countryCode) ||
                    countryCodes[0];
                  return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={`https://flagcdn.com/w20/${selected.short.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${selected.short.toLowerCase()}.png 2x`}
                        width="20"
                        alt={selected.name}
                        style={{ marginRight: "5px", borderRadius: "2px" }}
                      />
                      <span>
                        {selected.short} {selected.code}
                      </span>
                    </div>
                  );
                })()}
                <span style={{ fontSize: "10px", marginLeft: "5px" }}>▼</span>
              </div>

              {/* Dropdown Listesi */}
              {showCountryDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    width: "300px",
                    maxHeight: "300px",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    zIndex: 1000,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Arama Kutusu */}
                  <div
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      background: "#f8f9fa",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Ülke ara..."
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Liste */}
                  <ul
                    style={{
                      overflowY: "auto",
                      listStyle: "none",
                      padding: "0",
                      margin: "0",
                      flex: 1,
                    }}
                  >
                    {countryCodes
                      .filter(
                        (c) =>
                          c.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          c.code.includes(searchTerm) ||
                          c.short
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      )
                      .map((item, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setData({ ...data, countryCode: item.code });
                            setShowCountryDropdown(false);
                            setSearchTerm(""); // Aramayı temizle
                          }}
                          className="country-option"
                          style={{
                            padding: "10px 15px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "14px",
                            transition: "background 0.2s",
                            backgroundColor:
                              data.countryCode === item.code
                                ? "#eef2ff"
                                : "white",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f0f2f5")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              data.countryCode === item.code
                                ? "#eef2ff"
                                : "white")
                          }
                        >
                          <img
                            src={`https://flagcdn.com/w40/${item.short.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w80/${item.short.toLowerCase()}.png 2x`}
                            width="30"
                            alt={item.name}
                            style={{
                              marginRight: "12px",
                              borderRadius: "3px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          />
                          <span
                            style={{
                              flex: 1,
                              fontWeight: "500",
                              color: "#333",
                            }}
                          >
                            {item.name}
                          </span>
                          <span style={{ color: "#666", fontWeight: "bold" }}>
                            ({item.code})
                          </span>
                        </li>
                      ))}
                    {countryCodes.filter((c) =>
                      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    ).length === 0 && (
                      <li
                        style={{
                          padding: "15px",
                          textAlign: "center",
                          color: "#888",
                          fontSize: "13px",
                        }}
                      >
                        Sonuç bulunamadı
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Telefon Numarası */}
            <input
              required
              className="input"
              type="tel"
              placeholder="Telefon Numarası"
              id="phoneNumber"
              value={data.phoneNumber || ""}
              onChange={handleInputChange}
              autoComplete="tel"
              style={{ flex: 1, marginTop: "0" }}
            />
          </div>

          {/* Role Selection */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              margin: "15px 0 5px",
              color: "#555",
              fontSize: "14px",
              justifyContent: "center",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="role"
                value="Customer"
                checked={data.role === "Customer"}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              />
              Müşteri Ol
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="role"
                value="Translator"
                checked={data.role === "Translator"}
                onChange={(e) => setData({ ...data, role: e.target.value })}
              />
              Çevirmen Ol
            </label>
          </div>

          {/* Register Button */}
          <button
            className="login-button"
            type="submit"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? "İşleniyor..." : "Kaydol"}
          </button>

          {/* Mesaj Alanları */}
          {message && (
            <div
              style={{
                color: "#28a745",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "5px",
                fontWeight: "500",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                color: "#ff4d4d",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "5px",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}
        </form>

        {/* --- YENİ EKLENEN SOSYAL MEDYA BUTONLARI --- */}
        <div className="social-divider">Veya şununla kaydolun:</div>

        <ul className="wrapper">
          {/* Google */}
          <li className="icon google">
            <span className="tooltip">Google</span>
            <FaGoogle />
          </li>
          {/* Apple */}
          <li className="icon apple">
            <span className="tooltip">Apple</span>
            <FaApple style={{ fontSize: "22px", marginTop: "-2px" }} />
          </li>
          {/* Twitter */}
          <li className="icon twitter">
            <span className="tooltip">Twitter</span>
            <FaTwitter />
          </li>
        </ul>

        {/* Login Link */}
        <div
          className="agreement"
          style={{ marginTop: "20px", fontSize: "12px", color: "#555" }}
        >
          Hesabınız var mı?{" "}
          <Link to="/login" style={{ fontWeight: "bold" }}>
            Giriş Yapın
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
