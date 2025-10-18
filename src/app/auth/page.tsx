"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TikTok Crossposter
          </h1>
          <p className="text-gray-600">
            Planifiez et publiez vos vidéos TikTok automatiquement
          </p>
        </div>

        <GoogleSignInButton user={user} onUserChange={setUser} />

        {user && (
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Bienvenue ! Vous pouvez maintenant accéder au tableau de bord.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Accéder au tableau de bord
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
