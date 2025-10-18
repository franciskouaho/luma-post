import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Vérifier que c'est bien TikTok qui envoie la webhook
    const signature = request.headers.get('x-tiktok-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 401 }
      );
    }

    // TODO: Valider la signature TikTok
    // Pour l'instant, on fait confiance

    const { publish_id, status, error_message } = body;

    if (!publish_id) {
      return NextResponse.json(
        { error: 'publish_id manquant' },
        { status: 400 }
      );
    }

    // Trouver le schedule correspondant au publish_id
    // Note: Vous devrez stocker le publish_id dans vos schedules
    // Pour l'instant, on log juste l'événement
    console.log('Webhook TikTok reçu:', {
      publish_id,
      status,
      error_message,
      timestamp: new Date().toISOString()
    });

    // TODO: Mettre à jour le statut du schedule dans Firestore
    // await scheduleService.updateByPublishId(publish_id, {
    //   status: status === 'PUBLISHED' ? 'published' : 'failed',
    //   lastError: error_message || null,
    //   tiktokUrl: status === 'PUBLISHED' ? `https://tiktok.com/@username/video/${publish_id}` : null
    // });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors du traitement de la webhook TikTok:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Endpoint pour tester la webhook
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook TikTok endpoint actif',
    timestamp: new Date().toISOString()
  });
}
