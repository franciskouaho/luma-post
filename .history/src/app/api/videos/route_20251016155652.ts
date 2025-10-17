import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock data pour les vidéos
let videos = [
  {
    id: '1',
    userId: 'user123',
    title: 'Tutoriel React Native',
    storageKey: 'uploads/user123/1640995200000-abc123.mp4',
    thumbnailKey: 'thumbs/user123/1640995200000-abc123.jpg',
    duration: 120,
    size: 15728640, // 15MB
    status: 'uploaded',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user123',
    title: 'Tips de développement',
    storageKey: 'uploads/user123/1641081600000-def456.mp4',
    thumbnailKey: 'thumbs/user123/1641081600000-def456.jpg',
    duration: 90,
    size: 12345678, // 12MB
    status: 'processing',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filtrer les vidéos de l'utilisateur
    let userVideos = videos.filter(video => video.userId === session.user?.id);

    // Filtrer par statut si spécifié
    if (status) {
      userVideos = userVideos.filter(video => video.status === status);
    }

    // Pagination
    const paginatedVideos = userVideos.slice(offset, offset + limit);

    return NextResponse.json({
      videos: paginatedVideos,
      total: userVideos.length,
      hasMore: offset + limit < userVideos.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { title, storageKey, duration, size } = await request.json();

    // Validation des paramètres
    if (!title || !storageKey || !duration || !size) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Créer une nouvelle vidéo
    const newVideo = {
      id: Date.now().toString(),
      userId: session.user?.id || 'unknown',
      title,
      storageKey,
      thumbnailKey: storageKey.replace('.mp4', '.jpg'),
      duration,
      size,
      status: 'uploaded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    videos.push(newVideo);

    return NextResponse.json(newVideo, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la vidéo:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
