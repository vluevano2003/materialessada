import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import "../../styles/inventario.css";

function Inventario() {
  // Estados de UI
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados del Formulario
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");

  // Estados de Datos
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const productosRef = collection(db, "productos");
    const unsubscribe = onSnapshot(productosRef, (snapshot) => {
      const marcasSet = new Set();
      const categoriasSet = new Set();
      const productosData = [];

      snapshot.forEach((doc) => {
        const producto = doc.data();
        productosData.push({ id: doc.id, ...producto });
        if (producto.marca) marcasSet.add(producto.marca);
        if (producto.categoria) categoriasSet.add(producto.categoria);
      });

      setProductos(productosData);
      setMarcas(Array.from(marcasSet));
      setCategorias(Array.from(categoriasSet));
    });

    return () => unsubscribe();
  }, []);

  // LÓGICA DE BÚSQUEDA
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setDisponibilidad("");
    setMarca("");
    setCategoria("");
    setNuevaMarca("");
    setNuevaCategoria("");
    setFoto(null);
    setFotoPreview("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const marcaFinal = nuevaMarca.trim() || marca;
    const categoriaFinal = nuevaCategoria.trim() || categoria;

    const producto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      disponibilidad: parseInt(disponibilidad),
      marca: marcaFinal,
      categoria: categoriaFinal,
      foto: fotoPreview,
    };

    try {
      if (foto) {
        const formData = new FormData();
        formData.append("image", foto);
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=e8b72545a514b6da09673f2dc63502e9",
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();
        producto.foto = data.data.url;
      }

      if (editId) {
        await updateDoc(doc(db, "productos", editId), producto);
      } else {
        await addDoc(collection(db, "productos"), producto);
      }
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod.id);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion);
    setPrecio(prod.precio);
    setDisponibilidad(prod.disponibilidad);
    setMarca(prod.marca);
    setCategoria(prod.categoria);
    setFotoPreview(prod.foto || "");
    setShowForm(true);
  };

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="header-info">
          <h1>Inventario de Productos</h1>
          <p className="subtitle">Visualización y control de existencias.</p>
        </div>
        {!showForm && (
          <button className="btn-add-main" onClick={() => setShowForm(true)}>
            Agregar Nuevo Producto
          </button>
        )}
      </header>

      <div className="inventory-content">
        {showForm ? (
          /* VISTA DEL FORMULARIO */
          <div className="form-container-overlay">
            <div className="form-card full-form">
              <div className="form-header">
                <button className="btn-back-list" onClick={resetForm}>
                  ← Regresar
                </button>
                <h3>
                  {editId ? "📝 Editar Producto" : "➕ Agregar Nuevo Producto"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-sections-grid">
                  <div className="form-section">
                    <div className="form-group">
                      <label>Nombre del Producto</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows="5"
                      ></textarea>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Precio ($)</label>
                        <input
                          type="number"
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock inicial</label>
                        <input
                          type="number"
                          value={disponibilidad}
                          onChange={(e) => setDisponibilidad(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="form-group">
                      <label>Marca</label>
                      <div className="select-input-group">
                        <select
                          value={marca}
                          onChange={(e) => setMarca(e.target.value)}
                        >
                          <option value="">Seleccionar existente...</option>
                          {marcas.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Nueva marca"
                          value={nuevaMarca}
                          onChange={(e) => setNuevaMarca(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Categoría</label>
                      <div className="select-input-group">
                        <select
                          value={categoria}
                          onChange={(e) => setCategoria(e.target.value)}
                        >
                          <option value="">Seleccionar existente...</option>
                          {categorias.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Nueva categoría"
                          value={nuevaCategoria}
                          onChange={(e) => setNuevaCategoria(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Imagen</label>
                      <div className="file-upload-zone">
                        <input
                          type="file"
                          id="foto"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setFoto(file);
                              setFotoPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                        {fotoPreview ? (
                          <img
                            src={fotoPreview}
                            alt="Preview"
                            className="img-preview"
                          />
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary-large">
                    {editId ? "Guardar Cambios" : "Crear Producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* VISTA DE TABLA */
          <section className="list-card full-list">
            <div className="list-header-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar por nombre, marca o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((prod) => (
                      <tr key={prod.id}>
                        <td data-label="Producto">
                          <div className="product-cell">
                            <img
                              src={prod.foto || "../images/logo.png"}
                              alt=""
                            />
                            <span className="p-name">{prod.nombre}</span>
                          </div>
                        </td>
                        <td data-label="Categoría">
                          <span className="badge category">
                            {prod.categoria}
                          </span>
                        </td>
                        <td data-label="Marca">
                          <span className="badge brand">{prod.marca}</span>
                        </td>
                        <td className="p-price" data-label="Precio">
                          ${prod.precio?.toLocaleString()}
                        </td>
                        <td className="p-stock" data-label="Stock">
                          {prod.disponibilidad}
                        </td>
                        <td data-label="Estado">
                          {prod.disponibilidad > 5 ? (
                            <span className="status-pill in-stock">
                              En Stock
                            </span>
                          ) : prod.disponibilidad > 0 ? (
                            <span className="status-pill low-stock">
                              Bajo Stock
                            </span>
                          ) : (
                            <span className="status-pill no-stock">
                              Agotado
                            </span>
                          )}
                        </td>
                        <td data-label="Acciones">
                          <div className="action-buttons">
                            <button
                              className="icon-btn edit"
                              title="Editar"
                              onClick={() => handleEdit(prod)}
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-btn delete"
                              title="Eliminar"
                              onClick={() => {
                                if (window.confirm("¿Eliminar producto?"))
                                  deleteDoc(doc(db, "productos", prod.id));
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        No se encontraron productos que coincidan con "
                        {searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Inventario;
