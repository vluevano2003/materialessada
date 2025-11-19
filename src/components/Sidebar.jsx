import React from "react";
import { Link } from "react-router-dom";

// Recibe props para saber si está abierto y la función para cerrarse
function Sidebar({ isOpen, onClose }) {
  const sidebarStyle = {
    left: isOpen ? "0" : "-250px",
  };

  return (
    <div className="sidebar" style={sidebarStyle}>
      <span className="close-btn" onClick={onClose}>
        &times;
      </span>
      <ul>
        <li>
          <Link to="/">Menú</Link>
        </li>
        <li>
          <Link to="/productos">Productos</Link>
        </li>
        <li>
          <Link to="/informacion">Conócenos</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
