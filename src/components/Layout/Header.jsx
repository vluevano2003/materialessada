import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Sidebar from "../Sidebar";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header>
        <nav className="navbar">
          {/* Botón Hamburger */}
          <button id="hamburger-btn" onClick={toggleSidebar}>
            &#9776;
          </button>

          {/* Logo y Título */}
          <div className="nav-group logo-section">
            <Link to="/">
              <img
                src="/images/logo-nb.PNG"
                alt="Logo Materiales SADA"
                className="nav-logo"
              />
            </Link>
            <h1 className="brand-title">Materiales SADA</h1>
          </div>

          {/* Menú Desktop */}
          <div className="nav-group right desktop-only">
            {/* Usamos NavLink para saber cuál está activo */}
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Menú
            </NavLink>
            <NavLink 
              to="/productos" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Productos
            </NavLink>
            <NavLink 
              to="/informacion" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Conócenos
            </NavLink>
          </div>
        </nav>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}

export default Header;