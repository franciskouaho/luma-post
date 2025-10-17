import { NextRequest, NextResponse } from 'next/server';
import { tiktokAccountService } from '@/lib/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId est requis' },
        { status: 400 }
      );
    }

    // Récupérer les comptes TikTok de l'utilisateur
    const accounts = await tiktokAccountService.getByUserId(userId);

    return NextResponse.json({
      accounts,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId est requis' },
        { status: 400 }
      );
    }

    // Supprimer le compte (désactiver)
    await tiktokAccountService.delete(accountId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
