import React, { useState } from "react";
import { Link } from "react-router-dom";
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
            <img
              src="/images/logo-nb.PNG"
              alt="Logo Materiales SADA"
              className="nav-logo"
            />
            <h1 className="brand-title">Materiales SADA</h1>
          </div>

          {/* Menú Desktop */}
          <div className="nav-group right desktop-only">
            <Link to="/" className="nav-item">
              Menú
            </Link>
            <Link to="/productos" className="nav-item">
              Productos
            </Link>
            <Link to="/informacion" className="nav-item">
              Conócenos
            </Link>
          </div>
        </nav>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}

export default Header;