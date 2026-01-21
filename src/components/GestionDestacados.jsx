import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

function GestionDestacados() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(["", "", ""]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "productos"));
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre
        })).sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        setAllProducts(productsList);

        const configDoc = await getDoc(doc(db, "empresa", "destacados"));
        if (configDoc.exists() && configDoc.data().ids) {
          const savedIds = configDoc.data().ids;
          const paddedIds = [...savedIds, "", "", ""].slice(0, 3);
          setSelectedIds(paddedIds);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (index, value) => {
    const newIds = [...selectedIds];
    newIds[index] = value;
    setSelectedIds(newIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await setDoc(doc(db, "empresa", "destacados"), {
        ids: selectedIds
      });
      setMessage({ text: "¡Productos destacados actualizados!", type: "success" });
    } catch (error) {
      console.error("Error al guardar:", error);
      setMessage({ text: "Error al guardar.", type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (isLoading) return <div className="loading-state">Cargando productos...</div>;

  return (
    <div className="form-card full-form" style={{ marginTop: '2rem' }}>
      <div className="form-header-simple">
        <h3>⭐ Productos Destacados (Home)</h3>
        <p className="subtitle">Selecciona los 3 productos que aparecerán en la portada.</p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-sections-grid">
          {selectedIds.map((currentId, index) => (
            <div className="form-section" key={index}>
              <div className="form-group">
                <label>Posición {index + 1}</label>
                <select
                  value={currentId}
                  onChange={(e) => handleSelectChange(index, e.target.value)}
                >
                  <option value="">-- Seleccionar Producto --</option>
                  {allProducts.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
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
            {isSaving ? "Guardando..." : "Actualizar Destacados"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GestionDestacados;