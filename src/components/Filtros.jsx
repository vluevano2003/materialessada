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
        className="toggle-filtros-btn" 
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
      >
        {isMobileFiltersOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>
      
      <div className={`filtros-wrapper ${isMobileFiltersOpen ? 'abierto' : ''}`}>
        <section className="filtros-modernos">
          <div className="filtro-grupo">
              <label htmlFor="filtro-nombre">Buscar</label>
              <input 
                type="text" 
                id="filtro-nombre" 
                placeholder="Nombre del producto..."
                value={filters.nombre}
                onChange={onFilterChange}
                onKeyDown={handleKeyDown}
              />
          </div>
          
          <div className="filtro-grupo">
              <label htmlFor="filtro-categoria">Categoría</label>
              <select 
                id="filtro-categoria"
                value={filters.categoria}
                onChange={onFilterChange}
              >
                <option value="">Todas</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
          </div>

          <div className="filtro-grupo">
              <label htmlFor="filtro-marca">Marca</label>
              <select 
                id="filtro-marca"
                value={filters.marca}
                onChange={onFilterChange}
              >
                <option value="">Todas</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
          </div>

          <div className="filtro-grupo">
              <label htmlFor="filtro-precio">Precio Máximo</label>
              <input 
                type="number" 
                id="filtro-precio" 
                placeholder="$"
                value={filters.precio}
                onChange={onFilterChange}
                min="0"
              />
          </div>

          <div className="filtro-acciones">
              <button className="btn-filtro btn-primario" onClick={onFilterSubmit}>Aplicar</button>
              <button className="btn-filtro btn-secundario" onClick={onFilterClear}>Limpiar</button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Filtros;