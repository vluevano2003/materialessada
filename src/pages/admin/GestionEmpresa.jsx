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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const docRef = doc(db, "empresa", "info");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData({ ...formDefaults, ...docSnap.data() });
      } else {
        setFormData(formDefaults);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "empresa", "info"), formData);
      setMessage("Información actualizada correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
      setMessage("Error al actualizar la información.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (isLoading) return <h3>Cargando...</h3>;

  return (
    <section className="form-container">
      <h2>Información de la Empresa</h2>
      <form id="editar-form" onSubmit={handleSubmit}>
        <label htmlFor="sobreNosotros">Sobre Nosotros:</label>
        <textarea
          id="sobreNosotros"
          rows="3"
          value={formData.sobreNosotros}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="direccion">Dirección:</label>
        <input
          type="text"
          id="direccion"
          value={formData.direccion}
          onChange={handleChange}
          required
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h3>Pie de Página (Footer)</h3>

        <label htmlFor="footerDireccion">Dirección Footer:</label>
        <input
          type="text"
          id="footerDireccion"
          value={formData.footerDireccion}
          onChange={handleChange}
          required
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <label htmlFor="footerTelefono">Teléfono Footer:</label>
            <input
              type="tel"
              id="footerTelefono"
              value={formData.footerTelefono}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="footerEmail">Email Footer:</label>
            <input
              type="email"
              id="footerEmail"
              value={formData.footerEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="footerBottom">Copyright:</label>
        <input
          type="text"
          id="footerBottom"
          value={formData.footerBottom}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar Cambios</button>
      </form>

      {message && <div className="mensaje">{message}</div>}
    </section>
  );
}

export default GestionEmpresa;
