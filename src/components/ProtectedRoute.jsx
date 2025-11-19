import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
    return <div>Verificando autenticación...</div>;
  }

  return isAuthorized ? <Outlet /> : null;
}

export default ProtectedRoute;