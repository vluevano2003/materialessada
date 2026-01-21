import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import "../../styles/admin.css";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Usuarios", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.tipoCuenta);
            setUserName(data.nombreUsuario || user.email.split("@")[0]);
          } else {
            setUserName(user.email.split("@")[0]);
          }
        } catch (error) {
          console.error("Error obteniendo usuario:", error);
          setUserName("Usuario");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-container">
      {/* SIDEBAR IZQUIERDA */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">PANEL DE CONTROL</div>
          <button className="close-sidebar-btn" onClick={toggleSidebar}>&times;</button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className="nav-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="icon">📦</span> Gestión Inventario
          </NavLink>

          {userRole === "admin" && (
            <NavLink to="/admin/usuarios" className="nav-link" onClick={() => setIsSidebarOpen(false)}>
              <span className="icon">👥</span> Usuarios
            </NavLink>
          )}

          <NavLink to="/admin/gestion" className="nav-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="icon">🌐</span> Gestión Página
          </NavLink>
          
          <div className="nav-divider"></div>
          
          <NavLink to="/admin/cuenta" className="nav-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="icon">⚙️</span> Mi Cuenta
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-sidebar-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO DERECHO */}
      <div className="main-content">
        <header className="top-bar">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            &#9776;
          </button>
          
          <div className="top-bar-right">
            <span className="welcome-msg">
              Hola, <strong>{userName}</strong> <span className="role-badge">{userRole}</span>
            </span>
          </div>
        </header>

        <main className="outlet-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;