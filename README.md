# Catálogo e Inventario - Materiales SADA

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)

**Materiales SADA** es un sistema web moderno compuesto por un **Catálogo Digital** interactivo para clientes y un **Panel de Administración** seguro para la gestión del inventario. Construido con **React** para el frontend, **Firebase** como base de datos en tiempo real, y una arquitectura *serverless* utilizando **Cloudflare R2** para el almacenamiento profesional de imágenes.

---

## 📦 Características Principales

El sistema está dividido en dos grandes módulos para satisfacer tanto a los clientes como a los administradores de la tienda:

* **Catálogo Público Dinámico:** Visualización atractiva de productos con un sistema de filtrado múltiple (búsqueda por nombre, marca, categoría y precio máximo) y paginación integrada para un rendimiento óptimo.
* **Gestión de Inventario (CRUD):** Panel de administración para agregar, editar y eliminar productos del catálogo. Los cambios se reflejan al instante en la vista del cliente sin necesidad de recargar la página.
* **Control de Disponibilidad Inteligente:** Sistema optimizado de stock mediante estados booleanos (Disponible / Agotado) diseñado específicamente para catálogos comerciales, reduciendo la fricción operativa del administrador.
* **Almacenamiento de Medios en la Nube:** Subida directa y segura de fotografías de productos a **Cloudflare R2** (cero costos de salida de datos), garantizando carga rápida a través de URLs públicas persistentes.
* **Sección de Destacados:** Módulo dinámico en la página principal para resaltar productos u ofertas clave, consultados directamente desde la base de datos de configuración general.
* **Ventanas Modales (UI/UX):** Visualización de detalles detallados del producto (descripción completa, precio, marca, categoría y estado de stock) mediante componentes emergentes que bloquean el scroll trasero para mejor experiencia de usuario.
* **Contacto Directo:** Integración fluida con un Widget de WhatsApp para facilitar la comunicación y cierre de ventas con los clientes.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend / UI:** React (Hooks: `useState`, `useEffect`).
* **Estilos:** CSS3 Custom Properties, CSS Grid avanzado (con `auto-fit` y `auto-fill` para responsive design nativo), Flexbox y animaciones.
* **Base de Datos / Backend:** Firebase Firestore (Base de datos NoSQL, suscripciones en tiempo real con `onSnapshot`).
* **Almacenamiento de Objetos (Storage):** Cloudflare R2 (Alternativa moderna a AWS S3).
* **API / Intermediario Serverless:** Cloudflare Workers (Script en JavaScript para recepción segura de `FormData`, validación y escritura en el bucket R2 mediante Bindings).
* **Manejo de Peticiones HTTP:** Fetch API (comunicación directa entre React y el Worker).