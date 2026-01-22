import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import '../styles/general.css';

function ProtectedRoute() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verificación de rol en Firestore tras autenticación exitosa
          const userDocRef = doc(db, "Usuarios", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const rolesPermitidos = ["admin", "empleado"];
            
            if (rolesPermitidos.includes(userData.tipoCuenta)) {
              setIsAuthorized(true);
            } else {
              console.error("Acceso denegado: Rol no autorizado.");
              navigate('/login');
            }
          } else {
            console.error("Usuario no encontrado en la base de datos.");
            navigate('/login');
          }
        } catch (error) {
          console.error("Error al verificar permisos:", error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="loader"></div>
        <h3 style={styles.loadingText}>Verificando autenticación...</h3>
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : null;
}

// Estilos en línea para el contenedor de carga
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  loadingText: {
    marginTop: '20px',
    color: '#555',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 'normal',
  }
};

export default ProtectedRoute;