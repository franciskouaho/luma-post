'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function VideoPostPage() {
  useEffect(() => {
    // Rediriger vers la page d'upload vidéo existante
    redirect('/dashboard/upload');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la page de création de vidéo...</p>
      </div>
    </div>
  );
}
