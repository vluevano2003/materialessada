import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkHeader = scrolled || location.pathname !== "/";

  return (
    <>
      <header className={`site-header ${isDarkHeader ? "scrolled" : ""}`}>
        <nav className="navbar">
          {/* Botón Hamburger */}
          <button id="hamburger-btn" onClick={toggleSidebar}>
            &#9776;
          </button>

          {/* Logo y Título */}
          <div className="nav-group logo-section">
            <Link to="/">
              <img
                src={isDarkHeader ? "/images/logo-nb.PNG" : "/images/logo-blanco.png"}
                alt="Logo Materiales SADA"
                className="nav-logo"
              />
            </Link>
            <h1 className="brand-title">MATERIALES SADA</h1>
          </div>

          {/* Menú Desktop */}
          <div className="nav-group right desktop-only">
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              Inicio
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
              Información
            </NavLink>
          </div>
        </nav>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}

export default Header;