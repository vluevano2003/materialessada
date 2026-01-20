import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function ProductModal({ product, isOpen, onClose }) {
  
  // BLOQUEAR SCROLL
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("pop-up-overlay")) {
      onClose();
    }
  };

  const modalContent = (
    <div className="pop-up-overlay" onClick={handleOverlayClick}>
      <div className="pop-up-content">
        <button className="cerrar-pop-up" onClick={onClose} aria-label="Cerrar">&times;</button>
        
        <div className="pop-up-body">
          {/* Imagen */}
          <div className="pop-up-image-container">
            <img src={product.imagen} alt={product.nombre} className="pop-up-image" />
          </div>

          {/* Información */}
          <div className="pop-up-info">
            <span className="badge-categoria">{product.categoria}</span>
            
            <h3 className="pop-up-title">{product.nombre}</h3>
            
            <p className="precio-destacado">${product.precio}</p>
            
            <div className="meta-datos">
              <p><strong>Marca:</strong> {product.marca}</p>
              <p><strong>Disponibilidad:</strong> <span className={product.disponibilidad === 'Agotado' ? 'text-red' : 'text-green'}>{product.disponibilidad}</span></p>
            </div>

            <div className="divider"></div>

            <div className="descripcion-container">
              <h4>Descripción:</h4>
              <p className="descripcion-texto">{product.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const portalRoot = document.getElementById('portal-root') || document.body;
  return ReactDOM.createPortal(modalContent, portalRoot);
}

export default ProductModal;