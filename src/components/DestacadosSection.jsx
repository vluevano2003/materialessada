import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import ProductModal from './ProductModal';
import '../styles/destacadosSection.css';

function DestacadosSection() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Formateador de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const productosRef = collection(db, "productos");
    const q = query(productosRef, orderBy("disponibilidad", "desc"), limit(3));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        imagen: doc.data().foto || '/images/default.jpeg'
      }));
      setProductos(productosData);
      setIsLoading(false); // Detener carga al recibir datos
    }, (error) => {
      console.error("Error al obtener productos:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Limpiar data después de la animación de cierre
  };

  return (
    <>
      <section className="section-destacados">
        <div className="container">
          <h2 className="section-title">Nuestros Destacados</h2>
          
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando mejores ofertas...</p>
            </div>
          ) : (
            <div className="products-grid">
              {productos.map((producto) => (
                <article 
                  className="product-card" 
                  key={producto.id} 
                  onClick={() => handleProductClick(producto)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-image-wrapper">
                    <img 
                      src={producto.imagen} 
                      alt={`Foto de ${producto.nombre}`} 
                      loading="lazy" 
                    />
                  </div>
                  <div className="card-content">
                    <h3>{producto.nombre}</h3>
                    <p className="card-price">{formatCurrency(producto.precio)}</p>
                    <span className="btn-link">Ver detalles</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}

export default DestacadosSection;