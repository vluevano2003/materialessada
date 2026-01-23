import React from 'react';

function ProductCard({ product, onClick }) {
  const isOutOfStock = !product.disponibilidad || Number(product.disponibilidad) === 0;

  return (
    <div 
      className={`producto ${isOutOfStock ? 'sin-stock' : ''}`} 
      onClick={onClick}
    >
      <img src={product.imagen} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      
      <span className="precio">${product.precio}</span>
      
      {isOutOfStock && (
        <span className="etiqueta-agotado">Agotado</span>
      )}
    </div>
  );
}

export default ProductCard;