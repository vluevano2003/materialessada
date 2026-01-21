import React from 'react';

function ProductCard({ product, onClick }) {
  return (
    <div className="producto" onClick={onClick}>
      <img src={product.imagen} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      <span className="precio">${product.precio}</span>
    </div>
  );
}

export default ProductCard;