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

    // VALIDATION STRICTE DES SCOPES - FORCER LES 3 SCOPES REQUIS
    console.log('🔍 Validation des scopes TikTok reçus:', tokenResponse.scope);
    const scopes = new Set(tokenResponse.scope.split(',').map((s: string) => s.trim()));
    const requiredScopes = ['user.info.basic', 'video.upload', 'video.publish'];
    const missingScopes = requiredScopes.filter(s => !scopes.has(s));
    
    if (missingScopes.length > 0) {
      console.error('❌ Scopes manquants:', missingScopes);
      return NextResponse.json(
        { 
          error: `Scopes manquants: ${missingScopes.join(', ')}`,
          details: 'Veuillez révoquer l\'accès à cette application depuis TikTok et refaire le login pour autoriser tous les scopes requis.',
          missingScopes,
          requiredScopes,
          receivedScopes: Array.from(scopes)
        },
        { status: 403 }
      );
    }
    
    console.log('✅ Tous les scopes requis sont présents:', Array.from(scopes));

    // Obtenir les informations de l'utilisateur TikTok
    const userInfo = await tiktokAPIService.getUserInfo(tokenResponse.access_token);
    
    // VÉRIFICATION OPEN_ID DANS TARGET USERS
    const openId = userInfo.data.user.open_id;
    console.log('🔍 Open ID TikTok:', openId);
    console.log('⚠️  IMPORTANT: Vérifiez que cet open_id est dans vos Target Users en sandbox TikTok');
    console.log('⚠️  Si ce n\'est pas le cas, ajoutez ce compte dans Target Users pour permettre la publication');

    if (userInfo.error && userInfo.error.code !== 'ok') {
      return NextResponse.json(
        { error: `Erreur lors de la récupération des informations utilisateur: ${userInfo.error.message}` },
        { status: 400 }
      );
    }

    // Utiliser le service de chiffrement pour les tokens

    // Créer le compte TikTok avec le vrai userId (state contient le userId)
    await tiktokAccountService.create({
      userId: state, // Le state contient le userId de l'utilisateur connecté
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
    // Utiliser TIKTOK_REDIRECT_URI pour construire l'URL de base
    const baseUrl = process.env.TIKTOK_REDIRECT_URI?.replace('/api/auth/tiktok/callback', '') || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/dashboard/accounts?connected=true`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('=== Erreur dans TikTok Callback ===');
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Message:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('=== Fin de l\'erreur ===');
    
    // Rediriger vers le dashboard avec un message d'erreur
    const baseUrl = process.env.TIKTOK_REDIRECT_URI?.replace('/api/auth/tiktok/callback', '') || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/dashboard/accounts?error=connection_failed`;
    
    return NextResponse.redirect(redirectUrl);
  }
}
