import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requis' },
        { status: 400 }
      );
    }

    console.log('Récupération des posts planifiés pour userId:', userId);
    
    // Récupérer les posts planifiés depuis Firestore
    const schedules = await scheduleService.getByUserId(userId);
    
    console.log('Posts planifiés trouvés:', schedules.length);

    return NextResponse.json({
      success: true,
      schedules: schedules.map(schedule => ({
        id: schedule.id,
        caption: schedule.caption,
        scheduledAt: schedule.scheduledAt,
        status: schedule.status,
        platforms: schedule.platforms || [],
        userId: schedule.userId,
        createdAt: schedule.createdAt
      }))
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des posts planifiés:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}