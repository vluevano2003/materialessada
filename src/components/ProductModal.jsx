import React from 'react';
import ReactDOM from 'react-dom';

function ProductModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    // Cierra el modal solo si se hace clic en el fondo (overlay), no en el contenido interno
    if (e.target.classList.contains("pop-up-overlay")) {
      onClose();
    }
  };

  const modalContent = (
    <div className="pop-up-overlay" onClick={handleOverlayClick}>
      <div className="pop-up-content">
        <span className="cerrar-pop-up" onClick={onClose}>&times;</span>
        
        <img src={product.imagen} alt={product.nombre} className="pop-up-image" />
        
        <h3>{product.nombre}</h3>
        <p className="precio">Precio: ${product.precio}</p>
        <p>Categoría: {product.categoria}</p>
        <p>Marca: {product.marca}</p>
        <p>Disponibilidad: {product.disponibilidad}</p>
        <p>{product.descripcion}</p>
      </div>
    </div>
  );

  // Renderiza en 'portal-root' si existe en index.html, si no, usa body
  const portalRoot = document.getElementById('portal-root') || document.body;
  
  return ReactDOM.createPortal(modalContent, portalRoot);
}

export default ProductModal;