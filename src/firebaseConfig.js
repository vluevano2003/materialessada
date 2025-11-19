import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Usamos las variables de entorno para ocultar los datos reales
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Inicializar app principal
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Instancia secundaria para crear usuarios
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);

// Configurar persistencia local
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence for auth:", error);
  });

setPersistence(secondaryAuth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence for secondaryAuth:", error);
  });