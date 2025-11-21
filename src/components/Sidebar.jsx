import React from "react";
import { Link } from "react-router-dom";

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
          <Link to="/" className="nav-item block" onClick={onClose}>
            Menú Principal
          </Link>
          <Link to="/productos" className="nav-item block" onClick={onClose}>
            Productos
          </Link>
          <Link to="/informacion" className="nav-item block" onClick={onClose}>
            Conócenos
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
