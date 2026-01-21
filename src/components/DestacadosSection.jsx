import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProductModal from "./ProductModal";
import "../styles/destacadosSection.css";

function DestacadosSection() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const configDoc = await getDoc(doc(db, "empresa", "destacados"));

        if (
          configDoc.exists() &&
          configDoc.data().ids &&
          configDoc.data().ids.length > 0
        ) {
          const idsToFetch = configDoc.data().ids.filter((id) => id !== "");

          const productsPromises = idsToFetch.map(async (productId) => {
            const productDoc = await getDoc(doc(db, "productos", productId));
            if (productDoc.exists()) {
              return {
                id: productDoc.id,
                ...productDoc.data(),
                imagen: productDoc.data().foto || "/images/default.jpeg",
              };
            }
            return null;
          });

          const productsResults = await Promise.all(productsPromises);
          setProductos(productsResults.filter((p) => p !== null));
        } else {
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al obtener destacados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  if (!isLoading && productos.length === 0) return null;

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
                    <p className="card-price">
                      {formatCurrency(producto.precio)}
                    </p>
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
