import { NextRequest, NextResponse } from 'next/server';
import { tiktokAccountService } from '@/lib/firestore';
import { auth } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decodedToken = await auth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
        console.error('Erreur de vérification du token:', error);
      }
    }

    // Pour le développement, utiliser un userId par défaut si pas d'auth
    if (!userId) {
      userId = 'FGcdXcRXVoVfsSwJIciurCeuCXz1'; // Votre userId de test
      console.log('Utilisation du userId par défaut:', userId);
    }

    console.log('Récupération des comptes TikTok pour userId:', userId);
    
    // Récupérer les comptes TikTok depuis Firestore
    const accounts = await tiktokAccountService.getByUserId(userId);
    
    console.log('Comptes trouvés:', accounts.length);

    return NextResponse.json({
      success: true,
      accounts: accounts.map(account => ({
        id: account.id,
        username: account.username,
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        isActive: account.isActive,
        platform: account.platform
      }))
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}