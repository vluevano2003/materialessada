import React, { useEffect } from "react";
import GestionEmpresa from "./GestionEmpresa";
import "../../styles/gestion.css";

function Gestion() {
  useEffect(() => {
    document.body.classList.add("page-gestion");
    return () => {
      document.body.classList.remove("page-gestion");
    };
  }, []);

  return (
    <div className="gestion-page">
      <header className="gestion-header">
        <div className="header-info">
          <h1>Configuración General</h1>
          <p className="subtitle">Administra la información de contacto y pie de página de la empresa.</p>
        </div>
      </header>

      <div className="gestion-content">
        <GestionEmpresa />
      </div>
    </div>
  );
}

export default Gestion;