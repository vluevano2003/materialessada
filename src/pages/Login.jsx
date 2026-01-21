import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import "../styles/login.css";

function getErrorMessage(errorCode) {
  const errorMessages = {
    "auth/invalid-login-credentials": "Las credenciales son incorrectas.",
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet.",
    "auth/missing-email": "Por favor, ingresa un correo electrónico.",
  };
  return (
    errorMessages[errorCode] || "Ocurrió un error inesperado. Intenta de nuevo."
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("page-login");
    return () => {
      document.body.classList.remove("page-login");
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlertMessage({ type: "", text: "" });
    setIsLoading(true);

    if (isResetting) {
      await handleSendResetEmail();
    } else {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const userRef = doc(db, "Usuarios", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.activo) {
          setAlertMessage({
            type: "error",
            text: "Cuenta desactivada. Contacta al administrador.",
          });
          setIsLoading(false);
          return;
        }

        setAlertMessage({
          type: "success",
          text: `¡Bienvenido, ${userData.nombre || "Usuario"}!`,
        });

        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setAlertMessage({
          type: "error",
          text: "Usuario no registrado en base de datos.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setAlertMessage({ type: "error", text: getErrorMessage(error.code) });
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!email) {
      setAlertMessage({
        type: "info",
        text: "Ingresa tu correo para continuar.",
      });
      setIsLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAlertMessage({
        type: "success",
        text: "Correo enviado. Revisa tu bandeja (y spam).",
      });
      setTimeout(() => {
        setIsResetting(false);
        setAlertMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setAlertMessage({ type: "error", text: getErrorMessage(error.code) });
    }
    setIsLoading(false);
  };

  const toggleResetMode = (e) => {
    e.preventDefault();
    setIsResetting(!isResetting);
    setAlertMessage({ type: "", text: "" });
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-section">
        <div className="image-overlay">
          <div className="overlay-content">
            <h2>Materiales SADA</h2>
            <p>Sistema de Gestión Empresarial</p>
          </div>
        </div>
        <img src="/images/anuncio1.jpg" alt="Fondo Login" />
      </div>

      <div className="login-form-section">
        <div className="login-container">
          <div className="login-header">
            <h1>{isResetting ? "Recuperar Acceso" : "Iniciar Sesión"}</h1>
            <p>
              {isResetting
                ? "Te enviaremos un enlace para restablecer tu contraseña."
                : "Ingresa tus credenciales para acceder al panel."}
            </p>
          </div>

          {alertMessage.text && (
            <div className={`login-alert ${alertMessage.type}`}>
              {alertMessage.type === "error" && "⚠️ "}
              {alertMessage.type === "success" && "✅ "}
              {alertMessage.type === "info" && "ℹ️ "}
              {alertMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-login-form">
            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {!isResetting && (
              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="form-actions-row">
              {isResetting ? (
                <button
                  type="button"
                  onClick={toggleResetMode}
                  className="btn-text-cancel"
                >
                  ← Volver a Iniciar Sesión
                </button>
              ) : (
                <a href="#" onClick={toggleResetMode} className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <span className="loader"></span>
              ) : isResetting ? (
                "Enviar Correo de Recuperación"
              ) : (
                "Acceder al Sistema"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
