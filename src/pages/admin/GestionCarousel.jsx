import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const IMGBB_API_KEY = "e8b72545a514b6da09673f2dc63502e9";
const CAROUSEEL_COLLECTION = "carousel";

// Valores por defecto SÓLO para la configuración de PROMOCIÓN
const menuPromoDefaults = {
  promoTitulo: "",
  promoSubtitulo: "",
  promoBotonTexto: "",
  promoBotonLink: "",
};

function GestionCarousel() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [menuPromoData, setMenuPromoData] = useState(menuPromoDefaults);
  const [message, setMessage] = useState("");

  // Carga las imágenes del carrusel
  useEffect(() => {
    const collRef = collection(db, CAROUSEEL_COLLECTION);
    const unsubscribe = onSnapshot(collRef, (snapshot) => {
      const loadedImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url,
      }));
      setImages(loadedImages);
    });
    return () => unsubscribe();
  }, []);

  // Carga los textos de la promoción
  useEffect(() => {
    const loadMenuPromo = async () => {
      const docRef = doc(db, "config", "menu_promo");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMenuPromoData({ ...menuPromoDefaults, ...docSnap.data() });
      } else {
        setMenuPromoData(menuPromoDefaults);
      }
    };
    loadMenuPromo();
  }, []);

  // Manejadores para el formulario de promoción
  const handleMenuPromoChange = (e) => {
    const { id, value } = e.target;
    setMenuPromoData((prev) => ({ ...prev, [id]: value }));
  };

  const handleMenuPromoSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "config", "menu_promo"), menuPromoData, { merge: true });
      setMessage("Textos de Promoción actualizados.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error al guardar textos:", error);
      setMessage("Error al actualizar los textos.");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  
  const deleteImage = async (id) => {
    if (!window.confirm("¿Borrar imagen?")) return;
    try {
      await deleteDoc(doc(db, CAROUSEEL_COLLECTION, id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecciona una imagen");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error("Error al subir");

      await addDoc(collection(db, CAROUSEEL_COLLECTION), {
        url: data.data.url,
      });

      e.target.reset();
      setFile(null);
    } catch (error) {
      alert("Error al subir imagen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="carousel-section">
      <h2>Gestión del Home</h2>
      <form onSubmit={handleMenuPromoSubmit} className="config-form">
        
        <label htmlFor="promoTitulo">Título:</label>
        <input
          type="text"
          id="promoTitulo"
          value={menuPromoData.promoTitulo}
          onChange={handleMenuPromoChange}
        />
        <label htmlFor="promoSubtitulo">Subtítulo:</label>
        <textarea
          id="promoSubtitulo"
          rows="3"
          value={menuPromoData.promoSubtitulo}
          onChange={handleMenuPromoChange}
        ></textarea>
        <label htmlFor="promoBotonTexto">Texto del Botón:</label>
        <input
          type="text"
          id="promoBotonTexto"
          value={menuPromoData.promoBotonTexto}
          onChange={handleMenuPromoChange}
        />
        <label htmlFor="promoBotonLink">Link del Botón (URL):</label>
        <input
          type="url"
          id="promoBotonLink"
          value={menuPromoData.promoBotonLink}
          onChange={handleMenuPromoChange}
        />

        <button type="submit">Guardar Textos de Promoción</button>
        {message && <div className="mensaje">{message}</div>}
      </form>
      
      <hr/>

      <h3>Imágenes del Carrusel</h3>

      <form id="upload-form" onSubmit={handleSubmit}>
        <label htmlFor="image-input">Subir nueva imagen:</label>
        <input
          type="file"
          id="image-input"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Subiendo..." : "Subir Imagen"}
        </button>
      </form>

      <div id="carousel-preview">
        {images.map((img) => (
          <div key={img.id} className="carousel-item">
            <img src={img.url} alt="Carrusel" />
            <button onClick={() => deleteImage(img.id)}>X</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GestionCarousel;