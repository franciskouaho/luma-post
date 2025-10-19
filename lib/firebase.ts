// Firebase Admin SDK (pour le backend/API routes uniquement)
import { initializeApp as initializeAdminApp, getApps, cert } from 'firebase-admin/app';
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
    // Essayer d'utiliser les credentials Firebase si disponibles
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('🔑 Utilisation des credentials Firebase configurés');
      adminApp = initializeAdminApp({
        credential: cert({
          projectId: firebaseAdminConfig.projectId,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        storageBucket: firebaseAdminConfig.storageBucket,
      });
    } else {
      console.log('🔑 Utilisation des credentials par défaut (Railway/Google Cloud)');
      adminApp = initializeAdminApp(firebaseAdminConfig);
    }
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
  try {
    console.log('🔄 Tentative de réinitialisation avec projectId uniquement');
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
