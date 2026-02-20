import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifySms } from "../../services/api";
import "../../css/login.css";

const VerifyPhone = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState(location.state?.phone || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!code || code.length < 6) {
      setError("Lütfen 6 haneli kodu giriniz.");
      return;
    }

    setIsLoading(true);

    try {
      // Backend expects phone and code as query params
      const res = await verifySms(phone, code);
      if (res.data.success) {
        setMessage("Telefon başarıyla doğrulandı! Giriş yapabilirsiniz.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Doğrulama başarısız. Kodu kontrol edin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="auth-container">
        <div className="heading">Telefon Doğrulama</div>
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Lütfen <strong>{phone}</strong> numaralı telefona gelen SMS kodunu
          giriniz.
        </p>

        <form className="form" onSubmit={handleVerify}>
          <div className="input-group">
            <input
              required
              className="input"
              type="text"
              placeholder="SMS Kodu (6 Haneli)"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              style={{
                textAlign: "center",
                letterSpacing: "5px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, marginTop: "15px" }}
          >
            {isLoading ? "Doğrulanıyor..." : "Doğrula"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "15px",
              color: "green",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "15px",
              color: "red",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        <div className="agreement" style={{ marginTop: "20px" }}>
          Kodu alamadınız mı? <Link to="/register">Tekrar Dene</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
