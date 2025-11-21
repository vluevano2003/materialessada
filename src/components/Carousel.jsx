import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

function Carousel() {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchCarouselImages() {
      try {
        const snapshot = await getDocs(collection(db, "carousel"));
        const imageUrls = snapshot.docs.map(doc => doc.data().url);
        setImages(imageUrls);
      } catch (error) {
        console.error("Error al obtener imágenes del carrusel:", error);
      }
    }
    fetchCarouselImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const autoSlideInterval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(autoSlideInterval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length);
  };

  const prevSlide = () => {
    // Suma el length antes del módulo para manejar correctamente el índice negativo al retroceder desde 0
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (images.length === 0) {
    return <div className="carousel-placeholder"><p>Cargando anuncios...</p></div>;
  }

  return (
    <div className="carousel-container">
      <div className="carousel" id="carousel">
        {images.map((url, index) => (
          <div 
            className="slide" 
            key={index}
            style={{ display: index === currentSlide ? 'block' : 'none' }}
          >
            <img src={url} alt={`Anuncio ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="carousel-button prev" id="prevBtn" onClick={prevSlide}>‹</button>
      <button className="carousel-button next" id="nextBtn" onClick={nextSlide}>›</button>

      <div className="indicators" id="indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Carousel;