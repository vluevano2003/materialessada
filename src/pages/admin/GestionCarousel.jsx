import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const IMGBB_API_KEY = "e8b72545a514b6da09673f2dc63502e9";
const CAROUSEEL_COLLECTION = "carousel";

function GestionCarousel() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
      <h2>Imágenes del Carrusel</h2>

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
