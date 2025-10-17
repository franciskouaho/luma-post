import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/firebase-admin';

// Configuration Cloud Storage
const BUCKET_NAME = process.env.BUCKET_NAME || 'lumapost-38e61.appspot.com';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { contentType, size } = await request.json();

    // Validation des paramètres
    if (!contentType || !size) {
      return NextResponse.json(
        { error: 'contentType et size sont requis' },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!contentType.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Seuls les fichiers vidéo sont autorisés' },
        { status: 400 }
      );
    }

    // Validation de la taille (200MB max)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (size > maxSize) {
      return NextResponse.json(
        { error: 'La taille du fichier ne doit pas dépasser 200MB' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = contentType.split('/')[1];
    const fileName = `uploads/${session.user?.id}/${timestamp}-${randomId}.${fileExtension}`;

    // Configuration pour l'URL signée
    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    };

    // Ici, vous devriez utiliser l'Admin SDK de Firebase pour générer l'URL signée
    // Pour l'instant, on simule la réponse
    const signedUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=...`;
    
    return NextResponse.json({
      signedUrl,
      storageKey: fileName,
      expires: options.expires
    });

  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL signée:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
