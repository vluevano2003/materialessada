// src/pages/admin/Gestion.jsx

import React, { useEffect } from "react";
import GestionCarousel from "./GestionCarousel";
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
    <div className="gestion-container">
      {/* Panel Izquierdo: Carrusel */}
      <div className="panel-izquierdo">
        <GestionCarousel />
      </div>

      {/* Panel Derecho: Información */}
      <div className="panel-derecho">
        <GestionEmpresa />
      </div>
    </div>
  );
}

export default Gestion;
