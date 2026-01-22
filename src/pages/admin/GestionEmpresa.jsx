import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const formDefaults = {
  sobreNosotros: "",
  direccion: "",
  telefono: "",
  whatsappWidget: "",
  email: "",
};

function GestionEmpresa() {
  const [formData, setFormData] = useState(formDefaults);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, "empresa", "info");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const {
            footerDireccion,
            footerTelefono,
            footerEmail,
            footerBottom,
            ...cleanData
          } = data;

          setFormData({
            ...formDefaults,
            ...cleanData,
          });
        } else {
          setFormData(formDefaults);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "whatsappWidget") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [id]: onlyNums }));
      return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await setDoc(doc(db, "empresa", "info"), formData);
      setMessage({
        text: "¡Información actualizada correctamente!",
        type: "success",
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      setMessage({ text: "Error al guardar los cambios.", type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (isLoading) {
    return <div className="loading-state">Cargando configuración...</div>;
  }

  return (
    <div className="form-card full-form">
      <div className="form-header-simple">
        <h3>🏢 Detalles de la Organización</h3>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-section-title">Información Pública y Contacto</div>
        <div className="form-sections-grid">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="direccion">
                Dirección Física (Visible en Web y Footer)
              </label>
              <input
                type="text"
                id="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono Oficina</label>
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div
              className="form-group"
              style={{
                marginTop: "15px",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <label htmlFor="whatsappWidget">
                📱 Número WhatsApp (Para el Chat)
              </label>
              <input
                type="text"
                id="whatsappWidget"
                value={formData.whatsappWidget}
                onChange={handleChange}
                placeholder="Ej: 9211234567"
                maxLength="10"
                inputMode="numeric"
                required
              />
              <small style={{ fontSize: "0.8rem", color: "#666" }}>
                Ingresa solo los 10 dígitos. El sistema agregará el código de
                México (+52) automáticamente.
              </small>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="sobreNosotros">Sobre Nosotros</label>
              <textarea
                id="sobreNosotros"
                rows="8"
                value={formData.sobreNosotros}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-footer-action">
          {message.text && (
            <div className={`status-message ${message.type}`}>
              {message.text}
            </div>
          )}
          <button
            type="submit"
            className="btn-primary-large"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GestionEmpresa;
