import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Carousel from '../components/Carousel';
import DestacadosSection from '../components/DestacadosSection';

import '../styles/home.css';

function Home() {
  const [promoData, setPromoData] = useState(null);

  // Cargar la data de promoción
  useEffect(() => {
    const loadPromoData = async () => {
      // CAMBIA ESTA LÍNEA:
      const docRef = doc(db, "config", "menu_promo"); 
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPromoData(docSnap.data());
      }
    };
    loadPromoData();
  }, []);

  return (
    <>
      <section className="hero-section">
        {/* Lado Izquierdo: Contenido Promocional */}
        <div className="promo-content">
          <img src="/images/logo-nb.PNG" alt="Ilustración de Cerebro" className="promo-image" />
          <h1>{promoData ? promoData.promoTitulo : "Título por defecto"}</h1>
          <p>{promoData ? promoData.promoSubtitulo : "Subtítulo por defecto"}</p>
          <a 
            href={promoData ? promoData.promoBotonLink : "#"} 
            className="promo-button"
          >
            {promoData ? promoData.promoBotonTexto : "Botón"}
          </a>
        </div>

        {/* Lado Derecho: Carrusel */}
        <div className="carousel-wrapper">
          <Carousel />
        </div>
      </section>

      <DestacadosSection />
    </>
  );
}

export default Home;