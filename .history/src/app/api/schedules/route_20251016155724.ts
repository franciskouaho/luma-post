import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock data pour les planifications
let schedules = [
  {
    id: '1',
    userId: 'user123',
    videoId: '1',
    accountId: '1',
    title: 'Tutoriel React Native',
    scheduledAt: '2024-01-20T14:30:00Z',
    status: 'scheduled',
    hashtags: ['#ReactNative', '#Mobile', '#Tutorial'],
    description: 'Apprenez les bases de React Native en 10 minutes',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user123',
    videoId: '2',
    accountId: '2',
    title: 'Tips de développement',
    scheduledAt: '2024-01-19T16:00:00Z',
    status: 'published',
    hashtags: ['#DevTips', '#Coding', '#Tech'],
    description: '5 conseils pour améliorer votre code',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-19T16:00:00Z'
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

    // Filtrer les planifications de l'utilisateur
    let userSchedules = schedules.filter(schedule => schedule.userId === session.user?.id);

    // Filtrer par statut si spécifié
    if (status) {
      userSchedules = userSchedules.filter(schedule => schedule.status === status);
    }

    // Trier par date de planification
    userSchedules.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    // Pagination
    const paginatedSchedules = userSchedules.slice(offset, offset + limit);

    return NextResponse.json({
      schedules: paginatedSchedules,
      total: userSchedules.length,
      hasMore: offset + limit < userSchedules.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des planifications:', error);
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

    const { videoId, accountId, scheduledAt, hashtags, description } = await request.json();

    // Validation des paramètres
    if (!videoId || !accountId || !scheduledAt) {
      return NextResponse.json(
        { error: 'videoId, accountId et scheduledAt sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la date de planification est dans le futur
    const scheduleDate = new Date(scheduledAt);
    if (scheduleDate <= new Date()) {
      return NextResponse.json(
        { error: 'La date de planification doit être dans le futur' },
        { status: 400 }
      );
    }

    // Créer une nouvelle planification
    const newSchedule = {
      id: Date.now().toString(),
      userId: session.user?.id || 'unknown',
      videoId,
      accountId,
      title: `Vidéo ${videoId}`, // En réalité, récupérer depuis la vidéo
      scheduledAt,
      status: 'scheduled',
      hashtags: hashtags || [],
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    schedules.push(newSchedule);

    // Ici, vous devriez créer une Cloud Task pour la planification
    // await createCloudTask(newSchedule);

    return NextResponse.json(newSchedule, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la planification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la planification requis' },
        { status: 400 }
      );
    }

    // Trouver la planification
    const scheduleIndex = schedules.findIndex(
      schedule => schedule.id === id && schedule.userId === session.user?.id
    );

    if (scheduleIndex === -1) {
      return NextResponse.json(
        { error: 'Planification non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la planification
    schedules[scheduleIndex] = {
      ...schedules[scheduleIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(schedules[scheduleIndex]);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la planification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la planification requis' },
        { status: 400 }
      );
    }

    // Trouver et supprimer la planification
    const scheduleIndex = schedules.findIndex(
      schedule => schedule.id === id && schedule.userId === session.user?.id
    );

    if (scheduleIndex === -1) {
      return NextResponse.json(
        { error: 'Planification non trouvée' },
        { status: 404 }
      );
    }

    schedules.splice(scheduleIndex, 1);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la suppression de la planification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
