// Firebase Client SDK (pour le frontend)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase Admin SDK (pour le backend/API routes)
import { initializeApp as initializeAdminApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Configuration Firebase Client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA_W2Clr8riHWOhmhFuxhjRxKMdN9oB8cE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lumapost-38e61.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lumapost-38e61",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lumapost-38e61.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "939156653935",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:939156653935:web:9ac1633fd2a8e5b7cb4a9a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-42VQK97ZK1"
};

// Initialize Firebase Client
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Configuration Firebase Admin
const firebaseAdminConfig = {
  projectId: 'lumapost-38e61',
};

// Initialize Firebase Admin (éviter les doublons)
let adminApp;
try {
  adminApp = getApps().length === 0 ? initializeAdminApp(firebaseAdminConfig) : getApps()[0];
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
  // Pour le développement local, utiliser les credentials par défaut
  adminApp = initializeAdminApp({
    projectId: 'lumapost-38e61',
    // En développement, Firebase Admin utilisera les credentials par défaut
    // ou l'émulateur si configuré
  });
}

// Configuration pour l'émulateur en développement
if (process.env.NODE_ENV === 'development') {
  // Définir les variables d'environnement pour l'émulateur
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

// Services Firebase Admin
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminAuth = getAdminAuth(adminApp);

export default app;
