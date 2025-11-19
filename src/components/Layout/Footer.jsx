import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { doc, getDoc } from "firebase/firestore";

const footerDefault = { 
  direccion: "Lázaro Cárdenas No. 1705 Col. Puerto México Coatzacoalcos, Ver.",
  telefono: "(+52) 9211101741",
  email: "m2gise@hotmail.com",
  footerBottom: "© 2024 Materiales SADA. Todos los derechos reservados."
};

function Footer() {
  const [info, setInfo] = useState(footerDefault);
  const [bottomText, setBottomText] = useState(footerDefault.footerBottom);

  useEffect(() => {
    async function cargarFooterData() {
      try {
        const docSnap = await getDoc(doc(db, "empresa", "info"));
        
        // Prioriza datos de Firebase, usa default si falla
        const data = docSnap.exists() ? docSnap.data() : footerDefault;

        setInfo({
          direccion: data.footerDireccion || data.direccion,
          telefono: data.footerTelefono || data.telefono,
          email: data.footerEmail || data.email,
        });
        setBottomText(data.footerBottom || footerDefault.footerBottom);

      } catch (error) {
        console.error("Error al cargar el footer:", error);
      }
    }

    cargarFooterData();
  }, []);

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/images/logo-nb.PNG" alt="Logo de Materiales SADA" className="footer-image" />
          <h2>Materiales SADA</h2>
        </div>
        <div className="footer-info">
          <p id="footer-direccion">Dirección: {info.direccion}</p>
          <p id="footer-telefono">Teléfono: {info.telefono}</p>
          <p id="footer-email">Email: {info.email}</p>
        </div>
      </div>
      <div className="footer-bottom" id="footer-bottom-text">
        {bottomText}
      </div>
    </footer>
  );
}

export default Footer;