import React from 'react';

function ProductCard({ product, onClick }) {
  const isOutOfStock = !product.disponibilidad;

  return (
    <article 
      className={`producto-card ${isOutOfStock ? 'agotado' : ''}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="producto-img-container">
        <img src={product.imagen} alt={`Foto de ${product.nombre}`} loading="lazy" />
      </div>
      
      <div className="producto-info">
        <h3>{product.nombre}</h3>
        <span className="producto-precio">${product.precio}</span>
        
        {isOutOfStock && (
          <span className="badge-agotado">Agotado</span>
        )}
      </div>
    </article>
  );
}

export default ProductCard;