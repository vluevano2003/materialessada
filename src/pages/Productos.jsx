import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

import Filtros from "../components/Filtros";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";

import "../styles/productos.css";

const initialFilters = {
  nombre: "",
  categoria: "",
  marca: "",
  precio: "",
};

function Productos() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filters, setFilters] = useState(initialFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const productosRef = collection(db, "productos");

    // Listener en tiempo real: carga productos y genera filtros dinámicos (sets)
    const unsubscribe = onSnapshot(productosRef, (snapshot) => {
      const fetchedProducts = [];
      const catSet = new Set();
      const brandSet = new Set();

      snapshot.forEach((doc) => {
        const product = doc.data();
        fetchedProducts.push({
          id: doc.id,
          ...product,
          imagen: product.foto || "/images/default.jpeg",
        });
        if (product.categoria) catSet.add(product.categoria);
        if (product.marca) brandSet.add(product.marca);
      });

      setAllProducts(fetchedProducts);
      setDisplayedProducts(fetchedProducts); // Inicialmente mostramos todo
      setCategories(Array.from(catSet));
      setBrands(Array.from(brandSet));
    });

    return () => unsubscribe();
  }, []);

  // Manejador para cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    // Extrae la clave del filtro eliminando el prefijo usado en el HTML (ej: 'filtro-nombre')
    const filterKey = id.replace("filtro-", "");
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleFilterSubmit = () => {
    const nombre = filters.nombre.toLowerCase();
    const categoria = filters.categoria;
    const marca = filters.marca;
    const precioMax = parseFloat(filters.precio) || Infinity;

    const filtered = allProducts.filter((product) => {
      const coincideNombre = product.nombre.toLowerCase().includes(nombre);
      const coincideCategoria =
        categoria === "" || product.categoria === categoria;
      const coincideMarca = marca === "" || product.marca === marca;
      const coincidePrecio = product.precio <= precioMax;
      return (
        coincideNombre && coincideCategoria && coincideMarca && coincidePrecio
      );
    });

    setDisplayedProducts(filtered);
  };

  const handleFilterClear = () => {
    setFilters(initialFilters);
    setDisplayedProducts(allProducts);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container">
      <Filtros
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        brands={brands}
        onFilterSubmit={handleFilterSubmit}
        onFilterClear={handleFilterClear}
      />

      <div className="productos-section-wrapper">
        <h2>Productos</h2>
        <ProductList products={displayedProducts} onProductClick={openModal} />
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default Productos;
