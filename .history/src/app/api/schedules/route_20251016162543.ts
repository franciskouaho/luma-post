import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId est requis' },
        { status: 400 }
      );
    }

    // Récupérer les planifications de l'utilisateur
    const schedules = await scheduleService.getByUserId(userId, status, limit);

    return NextResponse.json({
      schedules,
      total: schedules.length,
      hasMore: schedules.length === limit
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
    const { userId, videoId, accountId, scheduledAt, hashtags, description, title } = await request.json();

    // Validation des paramètres
    if (!userId || !videoId || !accountId || !scheduledAt) {
      return NextResponse.json(
        { error: 'userId, videoId, accountId et scheduledAt sont requis' },
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
    const scheduleId = await scheduleService.create({
      userId,
      videoId,
      accountId,
      title: title || `Vidéo ${videoId}`,
      description: description || '',
      hashtags: hashtags || [],
      scheduledAt: Timestamp.fromDate(scheduleDate),
      status: 'scheduled',
    });

    // Récupérer la planification créée
    const newSchedule = await scheduleService.getById(scheduleId);

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
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la planification requis' },
        { status: 400 }
      );
    }

    // Mettre à jour la planification
    await scheduleService.update(id, updateData);

    // Récupérer la planification mise à jour
    const updatedSchedule = await scheduleService.getById(id);

    if (!updatedSchedule) {
      return NextResponse.json(
        { error: 'Planification non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSchedule);

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la planification requis' },
        { status: 400 }
      );
    }

    // Supprimer la planification
    await scheduleService.delete(id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la suppression de la planification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
