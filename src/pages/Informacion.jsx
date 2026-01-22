// src/pages/Informacion.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import WhatsAppWidget from "../components/WhatsAppWidget";
import '../styles/info.css';

const infoDefault = {
  sobreNosotros: "Cargando información...",
  direccion: "Cargando...",
  telefono: "Cargando...",
  email: "Cargando...",
  mapaUrl: "https://www.google.com/maps/embed?pb=!4v1731131892797!6m8!1m7!1sfwuwLXagDnJ6r_cinxHV7w!2m2!1d18.15076709905163!2d-94.4428635153618!3f177.3487840321954!4f-0.29297102906518546!5f0.7820865974627469"
};

function Informacion() {
  const [info, setInfo] = useState(infoDefault);

  useEffect(() => {
    async function cargarInfo() {
      try {
        const docSnap = await getDoc(doc(db, "empresa", "info"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInfo({
            sobreNosotros: data.sobreNosotros || infoDefault.sobreNosotros,
            direccion: data.direccion || infoDefault.direccion,
            telefono: data.telefono || infoDefault.telefono,
            email: data.email || infoDefault.email,
            mapaUrl: data.mapaUrl || infoDefault.mapaUrl
          });
        } else {
          setInfo(infoDefault);
        }
      } catch (error) {
        console.error("Error al cargar la información:", error);
        setInfo(infoDefault);
      }
    }
    cargarInfo();
  }, []);

  return (
    <div className="info-page-wrapper">
        <div className="info-container">
        {/* Sección de Texto (Izquierda) */}
        <section className="info-content">
            <h2>Sobre Nosotros</h2>
            <p className="description">{info.sobreNosotros}</p>

            <div className="contact-details">
                <h3>Dirección:</h3>
                <p>{info.direccion}</p>

                <h3>Teléfono:</h3>
                <p>{info.telefono}</p>

                <h3>Email:</h3>
                <p>{info.email}</p>
            </div>
        </section>

        {/* Sección de Mapa (Derecha) */}
        <div className="map-container">
            <iframe
            src={info.mapaUrl}
            title="Ubicación Materiales SADA"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
        </div>
        <WhatsAppWidget />
    </div>
  );
}

export default Informacion;