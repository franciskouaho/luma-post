import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔔 Webhook TikTok reçu:', {
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: new Date().toISOString()
    });

    // Vérifier la signature TikTok (optionnel pour le développement)
    const signature = request.headers.get('x-tiktok-signature');
    if (!signature) {
      console.log('⚠️ Signature TikTok manquante, mais on continue pour le développement');
    }

    // Extraire les données du webhook
    const { 
      publish_id, 
      status, 
      error_message, 
      video_id,
      share_url,
      user_id 
    } = body;

    if (!publish_id) {
      console.error('❌ publish_id manquant dans le webhook');
      return NextResponse.json(
        { error: 'publish_id manquant' },
        { status: 400 }
      );
    }

    console.log('📊 Données webhook extraites:', {
      publish_id,
      status,
      error_message,
      video_id,
      share_url,
      user_id
    });

    // Mettre à jour le statut du schedule dans Firestore
    try {
      // Chercher le schedule par publishId
      const schedules = await scheduleService.getByUserId('FGcdXcRXVoVfsSwJIciurCeuCXz1');
      const schedule = schedules.find(s => 
        s.publishId === publish_id ||
        s.tiktokUrl?.includes(publish_id) || 
        s.id === publish_id ||
        s.videoId === publish_id
      );

      if (schedule) {
        console.log('✅ Schedule trouvé:', schedule.id);
        
        // Déterminer le nouveau statut
        let newStatus: 'scheduled' | 'queued' | 'published' | 'failed';
        let tiktokUrl: string | undefined;
        let lastError: string | undefined;

        switch (status) {
          case 'PUBLISHED':
            newStatus = 'published';
            tiktokUrl = share_url || `https://tiktok.com/@user/video/${video_id}`;
            break;
          case 'FAILED':
            newStatus = 'failed';
            lastError = error_message || 'Erreur inconnue lors de la publication';
            break;
          case 'PROCESSING':
            newStatus = 'queued';
            break;
          default:
            newStatus = 'scheduled';
        }

        // Mettre à jour le schedule
        await scheduleService.update(schedule.id, {
          status: newStatus,
          lastError,
          tiktokUrl,
          updatedAt: new Date()
        });

        console.log('✅ Schedule mis à jour:', {
          id: schedule.id,
          newStatus,
          tiktokUrl,
          lastError
        });

      } else {
        console.log('⚠️ Aucun schedule trouvé pour publish_id:', publish_id);
      }

    } catch (updateError) {
      console.error('❌ Erreur lors de la mise à jour du schedule:', updateError);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook traité avec succès',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur lors du traitement de la webhook TikTok:', error);
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
    timestamp: new Date().toISOString(),
    testUrl: '/api/webhooks/tiktok/test'
  });
}

// Endpoint de test pour simuler un webhook TikTok
export async function PUT(request: NextRequest) {
  try {
    const { publish_id, status, error_message, video_id, share_url } = await request.json();
    
    console.log('🧪 Test webhook TikTok:', {
      publish_id,
      status,
      error_message,
      video_id,
      share_url
    });

    // Simuler l'appel du webhook
    const testBody = {
      publish_id: publish_id || 'test_publish_123',
      status: status || 'PUBLISHED',
      error_message: error_message || null,
      video_id: video_id || 'test_video_456',
      share_url: share_url || 'https://tiktok.com/@test/video/123',
      user_id: 'test_user_789'
    };

    // Appeler le webhook en interne
    const webhookUrl = new URL('/api/webhooks/tiktok', request.url);
    const response = await fetch(webhookUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tiktok-signature': 'test_signature'
      },
      body: JSON.stringify(testBody)
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Test webhook envoyé',
      testData: testBody,
      webhookResponse: result
    });

  } catch (error) {
    console.error('❌ Erreur lors du test webhook:', error);
    return NextResponse.json(
      { error: 'Erreur lors du test' },
      { status: 500 }
    );
  }
}
