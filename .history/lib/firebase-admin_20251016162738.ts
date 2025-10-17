import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// Configuration Firebase Admin
const firebaseAdminConfig = {
  projectId: 'lumapost-38e61',
  // En production, utilisez une clé de service
  // Pour le développement, on utilise l'emulator ou les credentials par défaut
};

// Initialiser Firebase Admin (éviter les doublons)
const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

// Services Firebase Admin
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);
export const adminAuth = getAuth(app);

export default app;
