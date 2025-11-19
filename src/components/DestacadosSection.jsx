import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import ProductModal from './ProductModal';

function DestacadosSection() {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const productosRef = collection(db, "productos");
    
    // Consulta: Top 3 productos ordenados por disponibilidad
    const q = query(productosRef, orderBy("disponibilidad", "desc"), limit(3));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Fallback a imagen por defecto si el campo 'foto' no existe
        imagen: doc.data().foto || '/images/default.jpeg' 
      }));
      setProductos(productosData);
    });

    return () => unsubscribe();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="destacados">
        <h2>Destacados</h2>
        <div id="destacados-container" className="productos">
          {productos.map((producto) => (
            <div 
              className="producto" 
              key={producto.id} 
              onClick={() => handleProductClick(producto)}
            >
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <span className="precio">${producto.precio}</span>
            </div>
          ))}
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