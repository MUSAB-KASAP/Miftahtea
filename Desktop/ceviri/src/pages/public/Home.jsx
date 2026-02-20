import React, { useState, useEffect } from "react";
import { getTranslators } from "../../services/api"; // API servisini çağır
import ContactModal from "../../components/ContactModal"; // Modal bileşenini çağır
import Billboard from "../../components/Billboard"; // Billboard bileşenini çağır
import { useNavigate } from "react-router-dom";

// ==============================================================================
// HOME PAGE (ANASAYFA)
// ==============================================================================

const Home = () => {
  // Çevirmen listesini tutacak state
  const [translators, setTranslators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal kontrolü için state'ler
  const [selectedTranslator, setSelectedTranslator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTranslators();
  }, []);

  const fetchTranslators = async () => {
    try {
      const response = await getTranslators();
      if (response.data.success) {
        setTranslators(response.data.data.items || []);
      }
    } catch (error) {
      console.error("Çevirmenler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenContact = (translator) => {
    setSelectedTranslator(translator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTranslator(null);
    setIsModalOpen(false);
  };

  const scrollToTranslators = () => {
    const section = document.getElementById("translator-list");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container-fluid" style={{ padding: "0" }}>
      {/* 1. BILLBOARD / HERO SECTION (Refactored) */}
      <Billboard
        onScrollTo={scrollToTranslators}
        onRegister={() => navigate("/register")}
      />

      {/* 2. TRANSLATOR LIST SECTION */}
      <section
        id="translator-list"
        className="container section"
        style={{ padding: "80px 20px" }}
      >
        <h2 className="heading-lg text-center" style={{ marginBottom: "40px" }}>
          Çevirmenlerimiz
        </h2>

        {loading ? (
          <p className="text-center text-muted">Yükleniyor...</p>
        ) : translators.length === 0 ? (
          <p className="text-center text-muted">
            Henüz kayıtlı çevirmen bulunmuyor.
          </p>
        ) : (
          <div className="grid-auto-fit">
            {translators.map((translator) => (
              <div key={translator.id} className="card">
                {/* Çevirmen Kartı İçeriği */}
                <h3
                  className="heading-lg"
                  style={{
                    color: "var(--primary-color)",
                    fontSize: "1.25rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {translator.fullName}
                </h3>
                <p
                  className="text-muted"
                  style={{ fontStyle: "italic", marginBottom: "1rem" }}
                >
                  {translator.bio || "Biyografi eklenmemiş."}
                </p>

                {/* Diller */}
                <div style={{ marginBottom: "15px" }}>
                  <strong>Diller:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {translator.languages && translator.languages.length > 0 ? (
                      translator.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "var(--bg-color)",
                            padding: "4px 12px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "0.875rem",
                            color: "var(--text-medium)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          {lang.sourceLanguage} - {lang.targetLanguage}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">Dil bilgisi yok</span>
                    )}
                  </div>
                </div>

                {/* İletişim Butonu */}
                <button
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                  onClick={() => handleOpenContact(translator)}
                >
                  İletişime Geç
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL BİLEŞENİ */}
      {isModalOpen && selectedTranslator && (
        <ContactModal
          translatorId={selectedTranslator.id}
          translatorName={selectedTranslator.fullName}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;
