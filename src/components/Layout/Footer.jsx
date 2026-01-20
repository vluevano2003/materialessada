import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; 
import { db } from '../../firebaseConfig'; 
import { doc, getDoc } from "firebase/firestore";

const footerDefault = { 
  direccion: "Lázaro Cárdenas No. 1705 Col. Puerto México Coatzacoalcos, Ver.",
  telefono: "(+52) 9211101741",
  email: "m2gise@hotmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61578593066586",
  footerBottom: "© 2024 Materiales SADA. Todos los derechos reservados."
};

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

function Footer() {
  const [info, setInfo] = useState(footerDefault);
  const [bottomText, setBottomText] = useState(footerDefault.footerBottom);

  useEffect(() => {
    async function cargarFooterData() {
      try {
        const docSnap = await getDoc(doc(db, "empresa", "info"));
        const data = docSnap.exists() ? docSnap.data() : footerDefault;

        setInfo({
          direccion: data.footerDireccion || data.direccion,
          telefono: data.footerTelefono || data.telefono,
          email: data.footerEmail || data.email,
          facebook: data.footerFacebook || footerDefault.facebook
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
          <img src="/images/logo-blanco.png" alt="Logo de Materiales SADA" className="footer-image" />
          <h2>Materiales SADA</h2>
        </div>
        <div className="footer-links">
          <h3>Explorar</h3>
          <ul>
            <li><Link to="/">Menú Principal</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/informacion">Conócenos</Link></li>
          </ul>
        </div>
        <div className="footer-info">
          <p id="footer-direccion"><strong>Dirección:</strong> {info.direccion}</p>
          <p id="footer-telefono"><strong>Teléfono:</strong> {info.telefono}</p>
          <p id="footer-email"><strong>Email:</strong> {info.email}</p>
          <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="btn-facebook">
            <FacebookIcon /> Visítanos en Facebook
          </a>
        </div>
      </div>
      
      <div className="footer-bottom" id="footer-bottom-text">
        {bottomText}
      </div>
    </footer>
  );
}

export default Footer;