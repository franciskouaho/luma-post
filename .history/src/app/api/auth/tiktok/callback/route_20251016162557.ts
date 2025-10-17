import { NextRequest, NextResponse } from 'next/server';
import { tiktokAPIService } from '@/lib/tiktok-api';
import { tiktokAccountService } from '@/lib/firestore';
import { Timestamp } from 'firebase/firestore';

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

    if (userInfo.error) {
      return NextResponse.json(
        { error: `Erreur lors de la récupération des informations utilisateur: ${userInfo.error.message}` },
        { status: 400 }
      );
    }

    // Chiffrer les tokens (à implémenter avec votre logique de chiffrement)
    const encryptToken = (token: string) => {
      // Ici vous devriez implémenter votre logique de chiffrement AES-256-GCM
      // Pour l'instant, on retourne le token tel quel
      return token;
    };

    // Créer le compte TikTok
    const accountId = await tiktokAccountService.create({
      userId: state,
      platform: 'tiktok',
      tiktokUserId: userInfo.data.user.open_id,
      username: userInfo.data.user.display_name,
      displayName: userInfo.data.user.display_name,
      avatarUrl: userInfo.data.user.avatar_url,
      accessTokenEnc: encryptToken(tokenResponse.access_token),
      refreshTokenEnc: encryptToken(tokenResponse.refresh_token),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + tokenResponse.expires_in * 1000)),
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      accountId,
      userInfo: userInfo.data.user,
    });

  } catch (error) {
    console.error('Erreur lors de la connexion TikTok:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
