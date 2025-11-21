// src/pages/Home.js (MODIFICADO)
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Carousel from '../components/Carousel';
import DestacadosSection from '../components/DestacadosSection';

import '../styles/home.css';

const PROMO_DEFAULTS = {
    promoTitulo: "Cargando...", 
    promoSubtitulo: "Cargando...",
    promoBotonTexto: "Cargando...",
    promoBotonLink: "#",
};

function Home() {
    const [promoData, setPromoData] = useState(PROMO_DEFAULTS); 

    // Cargar la data de promoción
    useEffect(() => {
        const loadPromoData = async () => {
            const docRef = doc(db, "config", "menu_promo"); 
            
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPromoData({ ...PROMO_DEFAULTS, ...docSnap.data() });
            } 
        };
        loadPromoData();
    }, []);

    return (
        <>
            <section className="hero-section">
                {/* Lado Izquierdo: Contenido Promocional */}
                <div className="promo-content">
                    <img src="/images/logo-nb.PNG" alt="Logo de Materiales SADA" className="promo-image" />
                    <h1>{promoData.promoTitulo}</h1>
                    <p>{promoData.promoSubtitulo}</p>
                    <a 
                        href={promoData.promoBotonLink} 
                        className="promo-button"
                    >
                        {promoData.promoBotonTexto}
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