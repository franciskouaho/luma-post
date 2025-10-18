import { initializeApp, getApps, App as AdminApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

// Configuration Firebase Admin
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "lumapost-38e61",
  // Tu peux ajouter d'autres options ici si besoin (credential, etc.)
};

// Initialisation du SDK Admin (évite les doublons)
let adminApp: AdminApp;
if (getApps().length === 0) {
  adminApp = initializeApp(firebaseAdminConfig);
} else {
  adminApp = getApps()[0];
}

// Exporte les services Admin
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminAuth = getAdminAuth(adminApp);
