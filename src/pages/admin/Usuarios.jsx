import React, { useState, useEffect } from "react";
import { auth, db, secondaryAuth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import "../../styles/usuarios.css";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  phone: "",
  accountType: "",
};

function Usuarios() {
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Data States
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
    const usersCollection = collection(db, "Usuarios");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setShowForm(false);
    setMessage({ text: "", type: "" });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { username, email, password, phone, accountType } = formState;

    if (!username || !email || !password || !phone || !accountType) {
      showMessage("Por favor, completa todos los campos.", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password,
      );
      const newUser = userCredential.user;

      await setDoc(doc(db, "Usuarios", newUser.uid), {
        nombreUsuario: username,
        correo: email,
        telefono: phone,
        tipoCuenta: accountType,
        uid: newUser.uid,
        activo: true,
      });

      showMessage("Usuario creado exitosamente.", "success");
      setTimeout(() => resetForm(), 1000);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      showMessage("No se pudo crear el usuario. Revisa los datos.", "error");
    }
  };

  const handleToggleState = async (userId, userEmail, currentActiveState) => {
    try {
      if (userEmail === currentUser?.email) {
        showMessage("⚠️ No puedes desactivar tu propia cuenta de administrador.", "error");
        return;
      }
      
      const userRef = doc(db, "Usuarios", userId);
      await updateDoc(userRef, { activo: !currentActiveState });
      showMessage(`Usuario ${!currentActiveState ? 'activado' : 'desactivado'} correctamente.`, "success");
      
    } catch (error) {
      console.error("Error:", error);
      showMessage("Hubo un error al cambiar el estado.", "error");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="header-info">
          <h1>Gestión de Usuarios</h1>
          <p className="subtitle">
            Administración de cuentas y permisos de acceso.
          </p>
        </div>
        {!showForm && (
          <button className="btn-add-main" onClick={() => setShowForm(true)}>
            👤 Nuevo Usuario
          </button>
        )}
      </header>

      <div className="inventory-content">
        {message.text && (
          <div 
            className={`message-banner ${message.type}`} 
            style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}
          >
            {message.text}
          </div>
        )}

        {showForm ? (
          <div className="form-container-overlay">
            <div className="form-card full-form">
              <div className="form-header">
                <button className="btn-back-list" onClick={resetForm}>
                  ← Regresar
                </button>
                <h3>👤 Agregar Nuevo Usuario</h3>
              </div>

              <form onSubmit={handleCreateUser} className="modern-form">

                <div className="form-sections-grid">
                  <div className="form-section">
                    <h4 className="form-section-title">Datos de Cuenta</h4>
                    <div className="form-group">
                      <label>Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        value={formState.password}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo de Cuenta</label>
                      <select
                        name="accountType"
                        value={formState.accountType}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="" disabled>
                          Seleccionar rol...
                        </option>
                        <option value="admin">Administrador</option>
                        <option value="empleado">Empleado</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-section">
                    <h4 className="form-section-title">Información Personal</h4>
                    <div className="form-group">
                      <label>Nombre Completo</label>
                      <input
                        type="text"
                        name="username"
                        value={formState.username}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary-large">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <section className="list-card full-list">
            <div className="list-header-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Contacto</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={!user.activo ? "row-inactive" : ""}
                      >
                        <td data-label="Usuario">
                          <div className="user-cell">
                            <div className="avatar-placeholder">
                              {user.nombreUsuario.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                              <span className="p-name">
                                {user.nombreUsuario}
                              </span>
                              <small className="text-muted">
                                ID: {user.tipoCuenta}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td data-label="Contacto">
                          <div className="contact-info">
                            <div>📧 {user.correo}</div>
                            <div>📞 {user.telefono}</div>
                          </div>
                        </td>
                        <td data-label="Rol">
                          <span className={`badge role-${user.tipoCuenta}`}>
                            {user.tipoCuenta.toUpperCase()}
                          </span>
                        </td>
                        <td data-label="Estado">
                          <span
                            className={`status-pill ${user.activo ? "in-stock" : "no-stock"}`}
                          >
                            {user.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td data-label="Acción">
                          <button
                            className={`action-btn-text ${user.activo ? "btn-danger" : "btn-success"}`}
                            onClick={() =>
                              handleToggleState(
                                user.id,
                                user.correo,
                                user.activo,
                              )
                            }
                          >
                            {user.activo ? "Desactivar" : "Reactivar"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-results">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Usuarios;