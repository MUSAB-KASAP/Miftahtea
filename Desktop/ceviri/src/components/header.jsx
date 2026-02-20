import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Sayfa geçişleri için Link, yönlendirme için useNavigate
import logo from "../logo/Logo.png";

function Header() {
  const navigate = useNavigate();

  // Kullanıcının giriş yapıp yapmadığını kontrol ediyoruz.
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // Çıkış yapınca giriş sayfasına at
    window.location.reload(); // Header'ın güncellenmesi için sayfayı yenile (Basit çözüm)
  };

  // Kullanıcı rolüne göre panel adresi belirleme
  const getDashboardPath = () => {
    if (userRole === "Admin") return "/admin/dashboard";
    if (userRole === "Translator") return "/translator/dashboard";
    return "/";
  };

  return (
    <header className="main-header">
      <div className="container">
        {/* LOGO KISMI */}
        <div className="logo">
          <Link to="/">
            MiftahTEA
            <span>
              <img src={logo} alt="Logo" width="40" height="40" />
            </span>
          </Link>
        </div>

        {/* MENÜ KISMI */}
        <nav className="nav-menu">
          <ul>
            <li>
              <Link to="/">Anasayfa</Link>
            </li>
            <li className="nav-item has-dropdown">
              <Link to="#">
                UZMANLIK ALANLARI <span className="arrow-down">▾</span>
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="#">İngilizce</Link>
                </li>
                <li>
                  <Link to="#">Almanca</Link>
                </li>
                <li>
                  <Link to="#">Fransızca</Link>
                </li>
                <li>
                  <Link to="#">İspanyolca</Link>
                </li>
                <li>
                  <Link to="#">İtalyanca</Link>
                </li>
                <li>
                  <Link to="#">Rusça</Link>
                </li>
                <li>
                  <Link to="#">Çince</Link>
                </li>
                <li>
                  <Link to="#">Arapça</Link>
                </li>
                <li>
                  <Link to="#">Portekizce</Link>
                </li>
                <li>
                  <Link to="#">Hollandaca</Link>
                </li>
                <li>
                  <Link to="#">İskandinav Dilleri</Link>
                </li>
                <li>
                  <Link to="#">Doğu Avrupa Dilleri</Link>
                </li>
                <li>
                  <Link to="#">Asya Dilleri</Link>
                </li>
                <li>
                  <Link to="#">Afrika Dilleri</Link>
                </li>
                <li>
                  <Link to="#">Diğer Diller</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/contact">İletişim</Link>
            </li>
          </ul>
        </nav>

        {/* SAĞ TARAFTAKİ BUTONLAR (Giriş / Çıkış) */}
        <div className="header-action">
          {!token ? (
            // Giriş YAPMAMIŞ kullanıcılar için:
            <>
              <Link to="/register" className="btn-contact">
                KAYIT OL
              </Link>
              <Link to="/login" className="btn-contact">
                GİRİŞ YAP
              </Link>
            </>
          ) : (
            // Giriş YAPMIŞ kullanıcılar için:
            <>
              <Link
                to={getDashboardPath()}
                className="btn-contact"
                style={{ backgroundColor: "#28a745" }}
              >
                PANELİM
              </Link>
              <button
                onClick={handleLogout}
                className="btn-contact"
                style={{
                  backgroundColor: "#dc3545",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ÇIKIŞ
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
