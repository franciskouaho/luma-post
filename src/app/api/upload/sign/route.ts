import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!storageService.validateFileType(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Formats autorisés: MP4, MOV, AVI, WMV, WebM, JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Validation de la taille
    if (!storageService.validateFileSize(file.size)) {
      return NextResponse.json(
        { error: 'La taille du fichier ne doit pas dépasser 200MB' },
        { status: 400 }
      );
    }

    // Utiliser le nom fourni ou générer un nom unique
    const finalFileName = fileName || storageService.generateFileName('user', file.name);

    // Upload direct vers Firebase Storage
    const uploadResult = await storageService.uploadFile(file, finalFileName);
    
    return NextResponse.json({
      downloadURL: uploadResult.downloadUrl, // Utiliser downloadUrl de l'objet retourné
      fileName: finalFileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
