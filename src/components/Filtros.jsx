import React, { useState } from 'react';

function Filtros({ filters, onFilterChange, categories, brands, onFilterSubmit, onFilterClear }) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onFilterSubmit();
    }
  };

  return (
    <>
      <button 
        id="toggle-filtros" 
        className="toggle-filtros" 
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
      >
        {isMobileFiltersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>
      
      <section className={`filtros ${isMobileFiltersOpen ? 'mostrar' : ''}`}>
        
        <div className="filtro-item">
            <label htmlFor="filtro-nombre">Nombre:</label>
            <input 
              type="text" 
              id="filtro-nombre" 
              placeholder="Buscar..."
              value={filters.nombre}
              onChange={onFilterChange}
              onKeyDown={handleKeyDown}
            />
        </div>
        
        <div className="filtro-item">
            <label htmlFor="filtro-categoria">Categoría:</label>
            <select 
              id="filtro-categoria"
              value={filters.categoria}
              onChange={onFilterChange}
            >
              <option value="">Todas</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        <div className="filtro-item">
            <label htmlFor="filtro-marca">Marca:</label>
            <select 
              id="filtro-marca"
              value={filters.marca}
              onChange={onFilterChange}
            >
              <option value="">Todas</option>
              {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
        </div>

        <div className="filtro-item">
            <label htmlFor="filtro-precio">Max Precio:</label>
            <input 
              type="number" 
              id="filtro-precio" 
              placeholder="$"
              value={filters.precio}
              onChange={onFilterChange}
              min="0"
            />
        </div>

        <div className="filtro-actions">
            <button id="boton-filtrar" onClick={onFilterSubmit}>Filtrar</button>
            <button id="quitar-filtros" onClick={onFilterClear}>Limpiar</button>
        </div>

      </section>
    </>
  );
}

export default Filtros;