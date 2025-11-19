import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts y Páginas Públicas
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Informacion from './pages/Informacion';
import Login from './pages/Login';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Inventario from './pages/admin/Inventario'; 
import Usuarios from './pages/admin/Usuarios';
import Gestion from './pages/admin/Gestion';
import Cuenta from './pages/admin/Cuenta';

function App() {
  return (
    <Routes>
      {/* --- Rutas principales --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/informacion" element={<Informacion />} />
      </Route>

      {/* --- Ruta de Login --- */}
      <Route path="/login" element={<Login />} />

      {/* --- Rutas de Admin --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Inventario />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="gestion" element={<Gestion />} />
          <Route path="cuenta" element={<Cuenta />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;