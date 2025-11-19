import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import "../../styles/inventario.css";

function Inventario() {
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

  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Carga de productos y cálculo dinámico de filtros (marcas/categorías)
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

  // Estilo específico para el body en esta página
  useEffect(() => {
    document.body.classList.add("page-inventario");
    return () => document.body.classList.remove("page-inventario");
  }, []);

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setDisponibilidad("");
    setMarca(marcas.length > 0 ? marcas[0] : "");
    setCategoria(categorias.length > 0 ? categorias[0] : "");
    setNuevaMarca("");
    setNuevaCategoria("");
    setFoto(null);
    setFotoPreview("");
    // Reset manual del input file
    const fileInput = document.getElementById("foto");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
      alert("Por favor, ingrese un precio válido.");
      return;
    }
    if (isNaN(parseInt(disponibilidad)) || parseInt(disponibilidad) < 0) {
      alert("Por favor, ingrese una disponibilidad válida.");
      return;
    }

    const marcaFinal = nuevaMarca.trim() || marca;
    const categoriaFinal = nuevaCategoria.trim() || categoria;

    if (!nombre || !descripcion || !marcaFinal || !categoriaFinal) {
      alert("Por favor, complete todos los campos.");
      return;
    }

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
      // Lógica de subida a ImgBB
      if (foto) {
        const formData = new FormData();
        formData.append("image", foto);
        const response = await fetch("https://api.imgbb.com/1/upload?key=e8b72545a514b6da09673f2dc63502e9", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        producto.foto = data.data.url;
      }

      if (editId) {
        await updateDoc(doc(db, "productos", editId), producto);
        alert("Producto actualizado exitosamente.");
      } else {
        await addDoc(collection(db, "productos"), producto);
        alert("Producto agregado exitosamente.");
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Hubo un error al guardar el producto.");
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
    
    const fileInput = document.getElementById("foto");
    if (fileInput) fileInput.value = "";
    
    const formElement = document.querySelector('.inventory-form-panel');
    if(formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, "productos", id));
        alert("Producto eliminado exitosamente.");
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <section className="inventory-wrapper">
      <div className="inventory-container">
        
        <div className="inventory-form-panel">
          <h2>{editId ? "Editar Producto" : "Agregar Producto"}</h2>
          <form id="producto-form" onSubmit={handleSubmit}>
            <input type="hidden" id="producto-id" value={editId || ""} />

            <label htmlFor="nombre">Nombre del producto:</label>
            <input
              type="text" id="nombre" required
              value={nombre} onChange={(e) => setNombre(e.target.value)}
            />

            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion" required
              value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>

            <label htmlFor="precio">Precio:</label>
            <input
              type="number" id="precio" required
              value={precio} onChange={(e) => setPrecio(e.target.value)}
            />

            <label htmlFor="marca">Marca:</label>
            <select id="marca" value={marca} onChange={(e) => setMarca(e.target.value)}>
              {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              type="text" id="nueva-marca" placeholder="Agregar nueva marca"
              value={nuevaMarca} onChange={(e) => setNuevaMarca(e.target.value)}
            />

            <label htmlFor="categoria">Categoría:</label>
            <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="text" id="nueva-categoria" placeholder="Agregar nueva categoría"
              value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)}
            />

            <label htmlFor="disponibilidad">Disponibilidad:</label>
            <input
              type="number" id="disponibilidad" required
              value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)}
            />

            <label htmlFor="foto">Foto:</label>
            <input type="file" id="foto" accept="image/*" onChange={handleFotoChange} />
            
            {fotoPreview && (
              <img
                src={fotoPreview} alt="Vista previa"
                style={{ maxWidth: "100px", borderRadius: "5px", display: "block", margin: "10px auto" }}
              />
            )}

            <button type="submit">Guardar</button>
            {editId && (
                <button type="button" id="cancelar-edicion" onClick={resetForm}>Cancelar</button>
            )}
          </form>
        </div>

        <div className="inventory-list-panel">
          <h2>Lista de Productos</h2>
          
          <div className="table-scroll-container">
            <table id="productos-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Marca</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Foto</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {productos.map((prod) => (
                    <tr key={prod.id}>
                    <td>{prod.nombre}</td>
                    <td>{prod.descripcion}</td>
                    <td>${prod.precio}</td>
                    <td>{prod.marca}</td>
                    <td>{prod.categoria}</td>
                    <td>{prod.disponibilidad}</td>
                    <td>
                        {prod.foto ? (
                        <img src={prod.foto} alt={prod.nombre} style={{ maxWidth: "80px", borderRadius: "4px" }} />
                        ) : "Sin imagen"}
                    </td>
                    <td>
                        <div className="acciones-btns">
                        <button className="editar" onClick={() => handleEdit(prod)}>Editar</button>
                        <button className="eliminar" onClick={() => handleDelete(prod.id)}>Eliminar</button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Inventario;