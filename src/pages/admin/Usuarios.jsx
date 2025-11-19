// src/pages/admin/Usuarios.jsx

import React, { useState, useEffect } from 'react';
import { auth, db, secondaryAuth } from '../../firebaseConfig'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

import '../../styles/usuarios.css'; 

const initialFormState = {
  username: '',
  email: '',
  password: '',
  phone: '',
  accountType: ''
};

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    document.body.classList.add('page-usuarios');
    return () => {
      document.body.classList.remove('page-usuarios');
    };
  }, []);

  useEffect(() => {
    setCurrentUser(auth.currentUser); 
    const usersCollection = collection(db, "Usuarios");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { username, email, password, phone, accountType } = formState;

    if (!username || !email || !password || !phone || !accountType) {
      showMessage("Por favor, completa todos los campos.", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
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
      setFormState(initialFormState);

    } catch (error) {
      console.error("Error al crear usuario:", error);
      showMessage("No se pudo crear el usuario. Intenta nuevamente.", "error");
    }
  };

  const handleToggleState = async (userId, userEmail, currentActiveState) => {
    try {
      if (userEmail === currentUser?.email) {
        showMessage("No puedes cambiar el estado de tu propia cuenta.", "error");
        return;
      }

      const userRef = doc(db, "Usuarios", userId);
      const newState = !currentActiveState;
      await updateDoc(userRef, { activo: newState });
      
      const actionMessage = newState ? "reactivada" : "desactivada";
      showMessage(`Cuenta ${actionMessage} exitosamente.`, "success");

    } catch (error) {
      console.error("Error:", error);
      showMessage("No se pudo cambiar el estado.", "error");
    }
  };

  return (
    <section className="user-management-wrapper">
      <div className="user-management-container">
        
        {/* --- Panel Izquierdo: Formulario --- */}
        <div className="user-form-panel">
          <h2>Agregar Nuevo Usuario</h2>
          <form id="add-user-form" onSubmit={handleCreateUser}>
            <label>Nombre de Usuario:</label>
            <input type="text" name="username" value={formState.username} onChange={handleFormChange} required />

            <label>Correo Electrónico:</label>
            <input type="email" name="email" value={formState.email} onChange={handleFormChange} required />

            <label>Contraseña:</label>
            <input type="password" name="password" value={formState.password} onChange={handleFormChange} required />

            <label>Teléfono:</label>
            <input type="tel" name="phone" value={formState.phone} onChange={handleFormChange} required />

            <label>Tipo de Cuenta:</label>
            <select name="accountType" value={formState.accountType} onChange={handleFormChange} required>
              <option value="" disabled>Selecciona un tipo</option>
              <option value="admin">Administrador</option>
              <option value="empleado">Empleado</option>
            </select>

            <button type="submit">Crear Usuario</button>

            {message.text && (
              <div className={`message-box ${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>

        {/* --- Panel Derecho: Lista --- */}
        <div className="user-list-panel">
          <h2>Usuarios Registrados</h2>
          
          <div className="table-scroll-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const buttonClass = user.activo ? "btn-deactivate" : "btn-activate";
                  const buttonText = user.activo ? "Desactivar" : "Reactivar";
                  
                  return (
                    <tr key={user.id}>
                      <td>{user.nombreUsuario}</td>
                      <td>{user.correo}</td>
                      <td>{user.telefono}</td>
                      <td>{user.tipoCuenta}</td>
                      <td>
                        <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                            {user.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`action-btn ${buttonClass}`} 
                          onClick={() => handleToggleState(user.id, user.correo, user.activo)}
                        >
                          {buttonText}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Usuarios;