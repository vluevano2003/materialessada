import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ products, onProductClick }) {
  return (
    <div className="productos-grid">
      {products.length === 0 ? (
        <p style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: "1.2rem", color: "var(--text-muted)", padding: "40px" }}>No se encontraron productos con esos filtros.</p>
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