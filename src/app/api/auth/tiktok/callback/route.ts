import { NextRequest, NextResponse } from 'next/server';
import { tiktokAPIService } from '@/lib/tiktok-api';
import { tiktokAccountService } from '@/lib/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { EncryptionService } from '@/lib/encryption';

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // userId
    const error = searchParams.get('error');


    if (error) {
      return NextResponse.json(
        { error: `Erreur d'autorisation TikTok: ${error}` },
        { status: 400 }
      );
    }

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Code d\'autorisation et state requis' },
        { status: 400 }
      );
    }

    // Échanger le code contre des tokens
    const tokenResponse = await tiktokAPIService.exchangeCodeForTokens(code);

    // Obtenir les informations de l'utilisateur TikTok
    const userInfo = await tiktokAPIService.getUserInfo(tokenResponse.access_token);

    if (userInfo.error && userInfo.error.code !== 'ok') {
      return NextResponse.json(
        { error: `Erreur lors de la récupération des informations utilisateur: ${userInfo.error.message}` },
        { status: 400 }
      );
    }

    // Utiliser le service de chiffrement pour les tokens

    // Créer le compte TikTok avec le vrai userId
    const accountId = await tiktokAccountService.create({
      userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1', // Votre userId de test
      platform: 'tiktok',
      tiktokUserId: userInfo.data.user.open_id,
      username: userInfo.data.user.display_name,
      displayName: userInfo.data.user.display_name,
      avatarUrl: userInfo.data.user.avatar_url,
      accessTokenEnc: EncryptionService.encrypt(tokenResponse.access_token),
      refreshTokenEnc: EncryptionService.encrypt(tokenResponse.refresh_token),
      expiresAt: FieldValue.serverTimestamp(),
      isActive: true,
      scopes: tokenResponse.scope ? tokenResponse.scope.split(',') : [], // Sauvegarder les scopes
    });


    // Rediriger vers le dashboard avec un message de succès
    // Utiliser l'URL ngrok depuis les paramètres de redirection TikTok
    const redirectUrl = `https://dispraisingly-unleased-mila.ngrok-free.dev/dashboard/accounts?connected=true`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('=== Erreur dans TikTok Callback ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('=== Fin de l\'erreur ===');
    
    // Rediriger vers le dashboard avec un message d'erreur
    const redirectUrl = `https://dispraisingly-unleased-mila.ngrok-free.dev/dashboard/accounts?error=connection_failed`;
    
    return NextResponse.redirect(redirectUrl);
  }
}
