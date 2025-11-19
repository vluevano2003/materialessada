import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onProductClick }) {
  return (
    <div id="productos-container" className="productos">
      {products.length === 0 ? (
        <p>No se encontraron productos con esos filtros.</p>
      ) : (
        products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => onProductClick(product)} 
          />
        ))
      )}
    </div>
  );
}

export default ProductList;