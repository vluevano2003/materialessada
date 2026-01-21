import React, { useEffect } from "react";
import GestionEmpresa from "./GestionEmpresa";
import GestionDestacados from "../../components/GestionDestacados";
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
          <p className="subtitle">
            Administra la información de contacto y productos destacados.
          </p>
        </div>
      </header>

      <div
        className="gestion-content"
        style={{ flexDirection: "column", gap: "20px" }}
      >
        <GestionEmpresa />
        <GestionDestacados />
      </div>
    </div>
  );
}

export default Gestion;
