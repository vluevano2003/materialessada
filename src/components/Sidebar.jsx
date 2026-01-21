import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const sidebarClass = isOpen ? "sidebar-drawer open" : "sidebar-drawer";

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <div className={sidebarClass}>
        <div className="sidebar-header">
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-item block active" : "nav-item block"}
            onClick={onClose}
          >
            Menú Principal
          </NavLink>
          <NavLink 
            to="/productos" 
            className={({ isActive }) => isActive ? "nav-item block active" : "nav-item block"}
            onClick={onClose}
          >
            Productos
          </NavLink>
          <NavLink 
            to="/informacion" 
            className={({ isActive }) => isActive ? "nav-item block active" : "nav-item block"}
            onClick={onClose}
          >
            Conócenos
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;