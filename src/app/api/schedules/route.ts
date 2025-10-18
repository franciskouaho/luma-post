import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/lib/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    // Si un ID spécifique est demandé, récupérer cette planification
    if (id) {
      console.log('=== Récupération d\'une planification spécifique ===');
      console.log('Schedule ID:', id);

      const schedule = await scheduleService.getById(id);
      
      if (!schedule) {
        return NextResponse.json(
          { error: 'Planification non trouvée' },
          { status: 404 }
        );
      }

      console.log('Planification trouvée:', schedule.id);

      return NextResponse.json({
        success: true,
        schedule
      });
    }

    // Sinon, récupérer toutes les planifications de l'utilisateur
    if (!userId) {
      return NextResponse.json(
        { error: 'userId est requis' },
        { status: 400 }
      );
    }

    console.log('=== Récupération des planifications ===');
    console.log('UserId:', userId);
    console.log('Status:', status);

    // Récupérer les planifications
    const schedules = await scheduleService.getByUserId(userId, status);

    console.log('Planifications trouvées:', schedules.length);

    return NextResponse.json({
      success: true,
      schedules,
      count: schedules.length
    });

  } catch (error) {
    console.error('=== Erreur lors de la récupération des planifications ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      caption, 
      videoFile, 
      videoUrl,
      thumbnailUrl,
      platforms, 
      scheduledAt, 
      status = 'scheduled',
      mediaType = 'video'
    } = await request.json();

    console.log('=== Création de post planifié ===');
    console.log('UserId:', userId);
    console.log('Caption:', caption);
    console.log('VideoFile:', videoFile);
    console.log('VideoUrl:', videoUrl);
    console.log('ThumbnailUrl:', thumbnailUrl);
    console.log('Platforms:', platforms);
    console.log('ScheduledAt:', scheduledAt);
    console.log('Status:', status);

    // Validation des paramètres
    if (!userId || !caption || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'userId, caption et platforms sont requis' },
        { status: 400 }
      );
    }

    // Créer le post planifié
    const scheduleId = await scheduleService.create({
      userId,
      caption,
      videoUrl,
      thumbnailUrl,
      platforms,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : FieldValue.serverTimestamp(),
      status,
      mediaType,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log('Post planifié créé avec ID:', scheduleId);

    // Récupérer le post créé
    const newSchedule = await scheduleService.getById(scheduleId);

    return NextResponse.json({
      success: true,
      schedule: newSchedule,
      message: 'Post planifié avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('=== Erreur lors de la création du post planifié ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json(
        { error: 'ID de la planification requis' },
        { status: 400 }
      );
    }

    const { 
      userId, 
      caption, 
      videoFile, 
      videoUrl, 
      thumbnailUrl, 
      platforms, 
      scheduledAt, 
      status, 
      mediaType 
    } = await request.json();

    if (!userId || !caption || !platforms || !scheduledAt) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    console.log('=== Mise à jour de planification ===');
    console.log('Schedule ID:', scheduleId);
    console.log('Données reçues:', { userId, caption, platforms, scheduledAt, status });

    // Mettre à jour la planification
    await scheduleService.update(scheduleId, {
      userId,
      caption,
      videoFile,
      videoUrl,
      thumbnailUrl,
      platforms,
      scheduledAt: new Date(scheduledAt),
      status,
      mediaType,
      updatedAt: new Date()
    });

    // Récupérer la planification mise à jour
    const updatedSchedule = await scheduleService.getById(scheduleId);

    console.log('Planification mise à jour avec succès:', scheduleId);

    return NextResponse.json({
      success: true,
      schedule: updatedSchedule,
      message: 'Planification mise à jour avec succès'
    });

  } catch (error) {
    console.error('=== Erreur lors de la mise à jour de la planification ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get('id');

    if (!scheduleId) {
      return NextResponse.json(
        { error: 'ID de la planification requis' },
        { status: 400 }
      );
    }

    console.log('=== Suppression de planification ===');
    console.log('Schedule ID:', scheduleId);

    // Supprimer la planification
    await scheduleService.delete(scheduleId);

    console.log('Planification supprimée avec succès:', scheduleId);

    return NextResponse.json({
      success: true,
      message: 'Planification supprimée avec succès'
    });

  } catch (error) {
    console.error('=== Erreur lors de la suppression de la planification ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}