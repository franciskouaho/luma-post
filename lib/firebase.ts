// Firebase Admin SDK (pour le backend/API routes uniquement)
import { initializeApp as initializeAdminApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Configuration Firebase Admin
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'lumapost-38e61',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'lumapost-38e61.firebasestorage.app',
};

// Configuration Firebase Admin pour la production
console.log('🔥 Utilisation de Firebase en production');

let adminApp;
try {
  if (getApps().length === 0) {
    adminApp = initializeAdminApp(firebaseAdminConfig);
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
  try {
    adminApp = initializeAdminApp({
      projectId: firebaseAdminConfig.projectId,
    });
  } catch (retryError) {
    console.error('Erreur lors de la réinitialisation de Firebase Admin:', retryError);
    throw retryError;
  }
}

// Services Firebase Admin
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminAuth = getAdminAuth(adminApp);
