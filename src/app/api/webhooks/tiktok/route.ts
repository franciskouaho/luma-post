import { NextRequest, NextResponse } from 'next/server';
import { scheduleService } from '@/lib/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log du webhook reçu
    console.log('Webhook TikTok reçu:', {
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: new Date().toISOString()
    });

    // Vérifier la signature TikTok (optionnel pour le développement)
    const signature = request.headers.get('x-tiktok-signature');
    if (!signature) {
    }

    // Extraire les données du webhook
    let publish_id, status, error_message, video_id, share_url, user_id;
    
    // TikTok envoie les données dans différents formats selon le type d'événement
    if (body.content && typeof body.content === 'string') {
      // Format inbox: content contient le JSON stringifié
      try {
        const contentData = JSON.parse(body.content);
        publish_id = contentData.publish_id;
        status = contentData.status || 'PROCESSING'; // Par défaut pour inbox_delivered
        error_message = contentData.error_message;
        video_id = contentData.video_id;
        share_url = contentData.share_url;
        user_id = body.user_openid;
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing du content:', parseError);
        return NextResponse.json(
          { error: 'Format de contenu invalide' },
          { status: 400 }
        );
      }
    } else {
      // Format direct (pour les autres types d'événements)
      publish_id = body.publish_id;
      status = body.status;
      error_message = body.error_message;
      video_id = body.video_id;
      share_url = body.share_url;
      user_id = body.user_id || body.user_openid;
    }

    if (!publish_id) {
      console.error('❌ publish_id manquant dans le webhook');
      return NextResponse.json(
        { error: 'publish_id manquant' },
        { status: 400 }
      );
    }

    // Log des données du webhook
    console.log('Données du webhook TikTok:', {
      publish_id,
      status,
      error_message,
      video_id,
      share_url,
      user_id,
      event: body.event,
      event_type: body.event
    });

    // Gérer les différents types d'événements TikTok
    const eventType = body.event;
    let finalStatus = status;
    
    switch (eventType) {
      case 'post.publish.inbox_delivered':
        // La vidéo a été livrée dans la boîte de réception TikTok
        finalStatus = 'PROCESSING';
        break;
      case 'post.publish.completed':
        // La publication est terminée avec succès
        finalStatus = 'PUBLISHED';
        break;
      case 'post.publish.failed':
        // La publication a échoué
        finalStatus = 'FAILED';
        break;
      default:
    }

    // Mettre à jour le statut du schedule dans Firestore
    try {
      // Chercher le schedule par publishId
      // D'abord essayer de trouver par publishId exact
      let schedule = null;
      
      // Recherche globale par publishId (plus efficace)
      try {
        const allSchedules = await scheduleService.getAll();
        schedule = allSchedules.find(s => s.publishId === publish_id);
        
        if (schedule) {
        }
      } catch (globalSearchError) {
        
        // Fallback: recherche par userId si disponible
        if (user_id) {
          const schedules = await scheduleService.getByUserId(user_id);
          schedule = schedules.find(s => s.publishId === publish_id);
        }
      }
      
      // Si toujours pas trouvé, essayer d'autres critères
      if (!schedule) {
        const allSchedules = await scheduleService.getAll();
        
        schedule = allSchedules.find(s => 
          s.tiktokUrl?.includes(publish_id) || 
          s.id === publish_id ||
          s.videoId === publish_id ||
          s.publishId?.includes(publish_id.split('~')[1]) // Partie après le ~
        );
        
        if (schedule) {
        }
      }

      if (schedule) {
        
        // Déterminer le nouveau statut
        let newStatus: 'scheduled' | 'queued' | 'published' | 'failed';
        let tiktokUrl: string | undefined;
        let lastError: string | undefined;

        switch (finalStatus) {
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
          updatedAt: FieldValue.serverTimestamp()
        });

        // Log de la mise à jour réussie
        console.log('Schedule mis à jour avec succès:', {
          id: schedule.id,
          newStatus,
          tiktokUrl,
          lastError
        });

      } else {
        console.log('Aucun schedule trouvé pour la mise à jour');
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
    
    // Log des paramètres de test
    console.log('Test webhook TikTok avec paramètres:', {
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
