// Firebase Admin SDK (pour le backend/API routes uniquement)
import { initializeApp as initializeAdminApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Configuration Firebase Admin
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

// Credentials Firebase Admin SDK (service account)
const firebaseCredentials: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!
};

// Configuration Firebase Admin pour la production
console.log('🔥 Utilisation de Firebase en production');
console.log('🔍 Project ID:', process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('🔍 Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('🔍 Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Présent' : '❌ Manquant');
console.log('🔍 Private Key:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Présent' : '❌ Manquant');

let adminApp;
try {
  if (getApps().length === 0) {
    // Utiliser les credentials Firebase service account
    console.log('🔑 Utilisation des credentials Firebase service account');
    adminApp = initializeAdminApp({
      credential: cert(firebaseCredentials),
      projectId: firebaseAdminConfig.projectId,
      storageBucket: firebaseAdminConfig.storageBucket,
    });
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
