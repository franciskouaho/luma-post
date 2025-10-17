import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { contentType, size, userId } = await request.json();

    // Validation des paramètres
    if (!contentType || !size || !userId) {
      return NextResponse.json(
        { error: 'contentType, size et userId sont requis' },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!storageService.validateFileType(contentType)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Formats autorisés: MP4, MOV, AVI, WMV, WebM' },
        { status: 400 }
      );
    }

    // Validation de la taille
    if (!storageService.validateFileSize(size)) {
      return NextResponse.json(
        { error: 'La taille du fichier ne doit pas dépasser 200MB' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileName = storageService.generateFileName(userId, `video.${contentType.split('/')[1]}`);

    // Générer l'URL signée pour l'upload
    const { signedUrl, storageKey } = await storageService.generateSignedUploadUrl(
      fileName,
      contentType,
      15 * 60 * 1000 // 15 minutes
    );
    
    return NextResponse.json({
      signedUrl,
      storageKey,
      expires: Date.now() + 15 * 60 * 1000
    });

  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL signée:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
