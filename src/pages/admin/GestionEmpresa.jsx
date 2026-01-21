import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const formDefaults = {
  sobreNosotros: "",
  direccion: "",
  telefono: "",
  email: "",
  footerDireccion: "",
  footerTelefono: "",
  footerEmail: "",
  footerBottom: "© 2024 Materiales SADA. Todos los derechos reservados.",
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
          // Combinamos defaults con datos para asegurar que no falten campos
          setFormData({ ...formDefaults, ...docSnap.data() });
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
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // Guardamos la info. Nota: Si en la DB existía 'mensajeAnuncio', 
      // se mantendrá ahí a menos que lo borres manualmente o sobrescribas todo el documento sin merge.
      // Al usar setDoc sin {merge: true} (comportamiento por defecto es sobrescribir si no se especifica merge), 
      // se limpiarán campos antiguos no incluidos en formData.
      await setDoc(doc(db, "empresa", "info"), formData);
      setMessage({ text: "¡Información actualizada correctamente!", type: "success" });
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
        {/* DATOS GENERALES */}
        <div className="form-section-title">Información Pública</div>
        <div className="form-sections-grid">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="direccion">Dirección Física</label>
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
                <label htmlFor="telefono">Teléfono Principal</label>
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
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="sobreNosotros">Sobre Nosotros (Descripción)</label>
              <textarea
                id="sobreNosotros"
                rows="8"
                value={formData.sobreNosotros}
                onChange={handleChange}
                required
                placeholder="Describe la historia y misión de la empresa..."
              ></textarea>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* FOOTER */}
        <div className="form-section-title">Configuración del Pie de Página (Footer)</div>
        <div className="form-sections-grid">
            <div className="form-section">
                <div className="form-group">
                    <label htmlFor="footerDireccion">Dirección en Footer</label>
                    <input
                        type="text"
                        id="footerDireccion"
                        value={formData.footerDireccion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="footerBottom">Texto Copyright</label>
                    <input
                        type="text"
                        id="footerBottom"
                        value={formData.footerBottom}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="footerTelefono">Teléfono Footer</label>
                        <input
                            type="tel"
                            id="footerTelefono"
                            value={formData.footerTelefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="footerEmail">Email Footer</label>
                        <input
                            type="email"
                            id="footerEmail"
                            value={formData.footerEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
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