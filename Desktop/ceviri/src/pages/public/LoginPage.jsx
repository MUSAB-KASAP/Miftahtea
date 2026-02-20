import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
  FaTwitter,
} from "react-icons/fa";
import { loginUser } from "../../services/api";
import "../../css/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const emailDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"];
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

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
    setError("");
  };

  // Email önerisine tıklayınca çalışacak fonksiyon
  const handleEmailSuggestionClick = (suggestedEmail) => {
    setData({ ...data, email: suggestedEmail });
    setEmailSuggestions([]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!data.email || !data.password) {
      setError("E-posta ve şifre boş olamaz.");
      return;
    }
    try {
      const res = await loginUser(data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("role", res.data.data.role);

        const userRole = res.data.data.role;
        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "Translator") {
          navigate("/translator/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError(err.response?.data?.message || "Giriş başarısız oldu.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="auth-container">
        <div className="heading">Giriş Yapın</div>

        <form className="form" onSubmit={handleFormSubmit}>
          {/* E-mail Input */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              required
              className="input"
              type="text"
              name="email"
              id="email"
              placeholder="E-mail"
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

          {/* Şifre Input + İkon */}
          <div className="password-wrapper">
            <input
              required
              className="input"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Şifre"
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

          {/* Şifremi Unuttum */}
          <div className="forgot-password">
            <Link to="/forgot-password">Parolanızı mı unuttunuz ?</Link>
          </div>

          {/* Giriş Butonu */}
          <button className="login-button" type="submit">
            Giriş Yapın
          </button>

          {error && (
            <div
              style={{
                color: "#ff4d4d",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </form>

        {/* --- Sosyal Medya Butonları (YENİ TASARIM) --- */}
        <div className="social-divider">Veya şununla oturum açın</div>

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

        {/* Alt Link - Güncellendi */}
        <div
          className="agreement"
          style={{ marginTop: "15px", fontSize: "12px", color: "#555" }}
        >
          Hesabınız yok mu?{" "}
          <Link to="/register" style={{ fontWeight: "bold" }}>
            Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
