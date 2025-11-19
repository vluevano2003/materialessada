import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import "../../styles/admin.css";

function AdminLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("page-admin");
    return () => document.body.classList.remove("page-admin");
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "Usuarios", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.tipoCuenta);

            // Prioriza 'nombreUsuario' de la BD, si no, deriva del email
            const nameFromDb = data.nombreUsuario;
            setUserName(
              nameFromDb || (user.email ? user.email.split("@")[0] : "Usuario")
            );
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header>
        <nav className="navbar">
          <button id="hamburger-btn" onClick={toggleMenu}>
            &#9776;
          </button>

          {/* Menú Izquierdo / Móvil */}
          <div
            className={`nav-group left ${isMenuOpen ? "open" : ""}`}
            id="mobile-menu"
          >
            <NavLink to="/admin" end className="nav-item" onClick={closeMenu}>
              Gestión de Inventario
            </NavLink>

            {userRole === "admin" && (
              <NavLink
                to="/admin/usuarios"
                className="nav-item"
                onClick={closeMenu}
              >
                Gestión de Usuarios
              </NavLink>
            )}

            <NavLink
              to="/admin/gestion"
              className="nav-item"
              onClick={closeMenu}
            >
              Gestión de Página
            </NavLink>

            <div className="mobile-only-options">
              <span className="welcome-text">Hola, {userName}</span>
              <NavLink
                to="/admin/cuenta"
                className="nav-item"
                onClick={closeMenu}
              >
                Datos de la Cuenta
              </NavLink>
              <button
                className="logout-btn"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Menú Derecho / Desktop */}
          <div className="nav-group right desktop-only">
            <span className="welcome-text">
              Bienvenido, <strong>{userName}</strong>
            </span>

            <NavLink to="/admin/cuenta" className="nav-item">
              Datos de la Cuenta
            </NavLink>

            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;
