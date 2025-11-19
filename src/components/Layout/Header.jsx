import React, { useState } from 'react';
import Sidebar from '../Sidebar'; 
import { Link } from 'react-router-dom';

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <nav>
        <button id="hamburger" className="hamburger" onClick={openSidebar}>
          &#9776;
        </button>
        <div className="banner">
          <img src="/images/logo-nb.PNG" alt="Logo de Materiales SADA" className="logo" />
          <h1>Materiales SADA</h1>
        </div>

        <ul className="menu">
          <li><Link to="/">Menú</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/informacion">Conócenos</Link></li>
        </ul>
      </nav>
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
}

export default Header;