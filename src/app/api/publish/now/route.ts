import { NextRequest, NextResponse } from 'next/server';
import { scheduleService, TikTokAccountService } from '@/lib/firestore';
import { tiktokAPIService } from '@/lib/tiktok-api';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      caption, 
      videoUrl,
      thumbnailUrl,
      platforms, 
      mediaType = 'video',
      tiktokSettings
    } = await request.json();


    // Validation des paramètres
    if (!userId || !videoUrl || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'userId, videoUrl et platforms sont requis' },
        { status: 400 }
      );
    }

    // Récupérer les comptes TikTok connectés
    const accountService = new TikTokAccountService();
    const accounts = await accountService.getByUserId(userId);
    
    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'Aucun compte TikTok connecté' },
        { status: 400 }
      );
    }

    // Trouver le compte TikTok correspondant à la plateforme sélectionnée
    const selectedAccountId = platforms[0];
    const tiktokAccount = accounts.find(account => account.id === selectedAccountId);
    
    if (!tiktokAccount) {
      return NextResponse.json(
        { error: 'Compte TikTok sélectionné non trouvé' },
        { status: 400 }
      );
    }
    

    // Publier sur TikTok
    const publishResult = await tiktokAPIService.publishVideoComplete(tiktokAccount, {
      videoUrl: videoUrl,
      title: caption,
      description: caption,
      hashtags: [], // Vous pouvez extraire les hashtags du caption si nécessaire
    }, tiktokSettings || {
      privacyLevel: 'PUBLIC_TO_EVERYONE',
      allowComments: true,
      allowDuet: true,
      allowStitch: true,
      commercialContent: {
        enabled: false,
        yourBrand: false,
        brandedContent: false,
      }
    }, accountService);

    if (!publishResult.success) {
      const errorMessage = 'error' in publishResult ? publishResult.error : 'Erreur inconnue';
      
      // Message spécial pour les applications non auditées
      if (errorMessage.includes('unaudited_client') || errorMessage.includes('non audité')) {
        return NextResponse.json(
          { 
            error: errorMessage,
            suggestion: "Votre application TikTok n'est pas encore audité. La vidéo sera envoyée à TikTok via MEDIA_UPLOAD - vous devrez la finaliser manuellement dans l'application TikTok.",
            unaudited: true
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: `Erreur de publication TikTok: ${errorMessage}` },
        { status: 500 }
      );
    }

    // Créer le post dans la base de données
    const scheduleId = await scheduleService.create({
      userId,
      caption,
      videoUrl,
      thumbnailUrl,
      platforms,
      scheduledAt: FieldValue.serverTimestamp(),
      status: 'published',
      mediaType,
      tiktokUrl: `https://www.tiktok.com/@${tiktokAccount.username}/video/${'publishId' in publishResult ? publishResult.publishId : 'unknown'}`,
      publishId: 'publishId' in publishResult ? publishResult.publishId : 'unknown',
    });


    // Récupérer le post créé
    const newPost = await scheduleService.getById(scheduleId);

    // Message adapté selon le mode de publication
    let successMessage = 'Vidéo publiée avec succès sur TikTok';
    let additionalInfo = null;
    
    if ('inboxMode' in publishResult && publishResult.inboxMode) {
      successMessage = 'Vidéo envoyée dans la boîte de réception TikTok';
      additionalInfo = {
        inboxMode: true,
        instructions: 'Ouvrez l\'application TikTok sur votre téléphone et allez dans la section "Drafts" ou "Boîte de réception" pour finaliser la publication.',
        nextSteps: [
          '1. Ouvrez TikTok sur votre téléphone',
          '2. Allez dans "Drafts" ou "Boîte de réception"',
          `3. Trouvez votre vidéo "${caption}"`,
          '4. Ajoutez votre caption finale et publiez'
        ],
        privacyLevel: publishResult.privacyLevel || 'SELF_ONLY',
        requiresManualPublish: true
      };
    } else if ('directPostSuccess' in publishResult && publishResult.directPostSuccess) {
      successMessage = 'Vidéo publiée directement sur TikTok !';
      additionalInfo = {
        inboxMode: false,
        directPostSuccess: true,
        privacyLevel: publishResult.privacyLevel,
        requiresManualPublish: false,
        instructions: `Publication directe réussie avec le niveau de confidentialité: ${publishResult.privacyLevel}`
      };
    }

    return NextResponse.json({
      success: true,
      post: newPost,
      publishId: 'publishId' in publishResult ? publishResult.publishId : 'unknown',
      tiktokUrl: `https://www.tiktok.com/@${tiktokAccount.username}/video/${'publishId' in publishResult ? publishResult.publishId : 'unknown'}`,
      message: successMessage,
      ...additionalInfo
    }, { status: 201 });

  } catch (error) {
    console.error('=== Erreur lors de la publication immédiate ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}