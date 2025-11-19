// src/pages/Login.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import "../styles/login.css";

// Helper para traducir errores de Firebase a mensajes amigables
function getErrorMessage(errorCode) {
  const errorMessages = {
    "auth/invalid-login-credentials": "Correo o contraseña incorrectos.",
    "auth/too-many-requests":
      "Demasiados intentos fallidos. Inténtalo más tarde.",
    "auth/network-request-failed":
      "Error de red. Revisa tu conexión a Internet.",
  };
  return (
    errorMessages[errorCode] ||
    "Ocurrió un error inesperado. Por favor, intenta de nuevo."
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  // Manejo de estilos específicos para el body en Login
  useEffect(() => {
    document.body.classList.add("page-login");
    return () => {
      document.body.classList.remove("page-login");
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAlertMessage({ type: "", text: "" });

    try {
      // 1. Autenticación básica con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Verificación adicional en Firestore (Rol y Estado)
      const userRef = doc(db, "Usuarios", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Bloquear acceso si el admin desactivó la cuenta
        if (!userData.activo) {
          setAlertMessage({
            type: "error",
            text: "Tu cuenta está desactivada. Contacta con el administrador.",
          });
          return;
        }

        setAlertMessage({
          type: "success",
          text: "Inicio de sesión exitoso. Redireccionando...",
        });

        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        setAlertMessage({
          type: "error",
          text: "No se encontró el usuario en la base de datos.",
        });
      }
    } catch (error) {
      console.log(error.code);
      const errorMessage = getErrorMessage(error.code);
      setAlertMessage({ type: "error", text: errorMessage });
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    const resetEmail =
      email ||
      prompt("Ingresa tu correo electrónico para recuperar la contraseña:");

    if (!resetEmail) {
      alert("No ingresaste ningún correo.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      alert(`Error al enviar el correo: ${error.message}`);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="image-section">
        <img src="/images/anuncio1.jpg" alt="Imagen de bienvenida" />
      </div>

      <div className="form-section">
        <h2>Iniciar Sesión</h2>

        <form id="login-form" onSubmit={handleLogin}>
          <label htmlFor="username">Correo Electrónico:</label>
          <input
            type="email"
            id="username"
            name="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>
        </form>

        {alertMessage.text && (
          <div id="alert-message" className={`alert ${alertMessage.type}`}>
            {alertMessage.text}
          </div>
        )}

        <div className="forgot-password">
          <a href="#" id="forgot-password-link" onClick={handlePasswordReset}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
