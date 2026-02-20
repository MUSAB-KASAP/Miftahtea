import React from "react";
import "../css/deneme.css";

const Deneme = () => {
  return (
    <nav className="main-nav">
      <ul className="nav-list">
        <li className="nav-item">HAKKIMIZDA</li>

        {/* Hizmetlerimiz Menüsü */}
        <li className="nav-item has-dropdown">
          HİZMETLERİMİZ <span className="arrow-down">▾</span>
          {/* Birinci Seviye Dropdown */}
          <ul className="dropdown-menu">
            <li className="dropdown-item has-submenu">
              YAZILI TERCÜME <span className="arrow-right">›</span>
              {/* İkinci Seviye (Yana Açılan) Menü */}
              <ul className="submenu">
                <li>Resmi Belge Tercümesi</li>
                <li>Medikal Tercüme</li>
                <li>Edebi Tercüme</li>
                <li>Teknik Tercüme</li>
                <li>Hukuki Tercüme</li>
              </ul>
            </li>
            <li className="dropdown-item">
              SÖZLÜ TERCÜME <span className="arrow-right">›</span>
            </li>
            <li className="dropdown-item">
              YERELLEŞTİRME <span className="arrow-right">›</span>
            </li>
            <li className="dropdown-item">
              MULTİMEDYA <span className="arrow-right">›</span>
            </li>
          </ul>
        </li>

        <li className="nav-item">SEKTÖRLER</li>
        <li className="nav-item">DİLLER</li>
      </ul>
    </nav>
  );
};

export default Deneme;
