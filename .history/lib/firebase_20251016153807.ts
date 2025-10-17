import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_W2Clr8riHWOhmhFuxhjRxKMdN9oB8cE",
  authDomain: "lumapost-38e61.firebaseapp.com",
  projectId: "lumapost-38e61",
  storageBucket: "lumapost-38e61.firebasestorage.app",
  messagingSenderId: "939156653935",
  appId: "1:939156653935:web:9ac1633fd2a8e5b7cb4a9a",
  measurementId: "G-42VQK97ZK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
