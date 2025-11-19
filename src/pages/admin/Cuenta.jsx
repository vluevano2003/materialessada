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

  useEffect(() => {
    document.body.classList.add("page-cuenta");
    return () => {
      document.body.classList.remove("page-cuenta");
    };
  }, []);

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
    }, 3000);
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
      // Re-autenticación necesaria antes de cambiar contraseña por seguridad
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

  if (isLoading) return <h3>Cargando...</h3>;

  return (
    <section className="account-wrapper">
      <h1>Mi Cuenta</h1>

      {message.text && (
        <div className={`message-banner ${message.type}`}>{message.text}</div>
      )}

      <div className="account-container">
        <div className="account-panel">
          <h2>Datos Personales</h2>
          <form onSubmit={handleGeneralSubmit}>
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              required
              value={generalData.username}
              onChange={handleGeneralChange}
            />

            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              disabled
              className="input-disabled"
              value={generalData.email}
              onChange={handleGeneralChange}
            />

            <label htmlFor="phone">Teléfono:</label>
            <input
              type="text"
              id="phone"
              required
              value={generalData.phone}
              onChange={handleGeneralChange}
            />

            <label htmlFor="tipo">Tipo de Cuenta:</label>
            <input
              type="text"
              id="tipo"
              disabled
              className="input-disabled"
              value={generalData.tipo}
              onChange={handleGeneralChange}
            />

            <button type="submit">Guardar Cambios</button>
          </form>
        </div>

        <div className="account-panel">
          <h2>Actualizar Contraseña</h2>
          <form onSubmit={handlePasswordSubmit}>
            <label htmlFor="currentPassword">Contraseña Actual:</label>
            {/* Asegúrate de que el ID coincida con el estado: currentPassword */}
            <input
              type="password"
              id="currentPassword"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />

            <label htmlFor="newPassword">Nueva Contraseña:</label>
            <input
              type="password"
              id="newPassword"
              minLength="6"
              required
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              minLength="6"
              required
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />

            <button type="submit">Actualizar Contraseña</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Cuenta;
