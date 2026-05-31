import React, { useEffect } from "react";
import ReactDOM from "react-dom";

function ProductModal({ product, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const isOutOfStock = !product.disponibilidad;

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        {/* Columna Izquierda: Imagen */}
        <div className="modal-image-col">
          <img
            src={product.imagen}
            alt={product.nombre}
          />
        </div>

        {/* Columna Derecha: Información */}
        <div className="modal-info-col">
          <span className="modal-badge">{product.categoria}</span>

          <h3 className="modal-title">{product.nombre}</h3>

          <p className="modal-price">${product.precio}</p>

          <div className="modal-meta">
            <div className="modal-meta-row">
              <span>Marca</span>
              <strong>{product.marca}</strong>
            </div>
            <div className="modal-meta-row">
              <span>Disponibilidad</span>
              <span className={isOutOfStock ? "status-out" : "status-ok"}>
                {isOutOfStock ? "Agotado" : "Disponible"}
              </span>
            </div>
          </div>

          {product.descripcion && (
            <div className="modal-desc">
              <h4>Descripción General</h4>
              <p>{product.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const portalRoot = document.getElementById("portal-root") || document.body;
  return ReactDOM.createPortal(modalContent, portalRoot);
}

export default ProductModal;
