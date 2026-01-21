import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import "../../styles/cuenta.css";

function Cuenta() {
  const [generalData, setGeneralData] = useState({
    username: "",
    email: "",
    phone: "",
    tipo: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para la clase del body (opcional, para estilos globales)
  useEffect(() => {
    document.body.classList.add("page-cuenta");
    return () => {
      document.body.classList.remove("page-cuenta");
    };
  }, []);

  // Cargar datos del usuario
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(db, "Usuarios", user.uid);
    getDoc(userDocRef)
      .then((userDoc) => {
        if (userDoc.exists()) {
          const { nombreUsuario, correo, telefono, tipoCuenta } =
            userDoc.data();
          setGeneralData({
            username: nombreUsuario || "",
            email: correo || "",
            phone: telefono || "",
            tipo: tipoCuenta || "",
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 4000);
  };

  const handleGeneralChange = (e) => {
    const { id, value } = e.target;
    setGeneralData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (!generalData.username || !generalData.phone) {
      showMessage("Por favor, completa nombre y teléfono.", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "Usuarios", user.uid), {
        nombreUsuario: generalData.username,
        telefono: generalData.phone,
      });
      showMessage("Datos actualizados exitosamente.", "success");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      showMessage("Error al guardar los datos.", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Completa todos los campos.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("Las nuevas contraseñas no coinciden.", "error");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      showMessage("Contraseña actualizada correctamente.", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error:", error);
      showMessage("Contraseña actual incorrecta o nueva muy débil.", "error");
    }
  };

  if (isLoading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="account-page">
      {/* Header Estilo Inventario */}
      <header className="account-header">
        <div className="header-info">
          <h1>Mi Cuenta</h1>
          <p className="subtitle">Administra tu información personal y seguridad.</p>
        </div>
      </header>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.type === "success" ? "✅ " : "⚠️ "}
          {message.text}
        </div>
      )}

      <div className="account-content-grid">
        {/* Tarjeta 1: Datos Personales */}
        <section className="form-card">
          <div className="card-header">
            <h3>👤 Datos Personales</h3>
          </div>
          <form onSubmit={handleGeneralSubmit} className="modern-form">
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                value={generalData.username}
                onChange={handleGeneralChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={generalData.email}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="text"
                  id="phone"
                  value={generalData.phone}
                  onChange={handleGeneralChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Cuenta</label>
                <input
                  type="text"
                  id="tipo"
                  value={generalData.tipo}
                  disabled
                  className="input-disabled"
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary-large">
                Guardar Cambios
              </button>
            </div>
          </form>
        </section>

        {/* Tarjeta 2: Seguridad */}
        <section className="form-card">
          <div className="card-header">
            <h3>🔒 Seguridad y Contraseña</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="modern-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña Actual</label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                  placeholder="Nueva contraseña"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                  placeholder="Repetir contraseña"
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-secondary-action">
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Cuenta;