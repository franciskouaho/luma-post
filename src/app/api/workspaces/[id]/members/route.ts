import { NextRequest, NextResponse } from 'next/server';
import { workspaceMemberService, workspaceService, userService } from '@/lib/firestore';
import { adminAuth } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 API members GET appelée pour workspace:', params.id);
    
    const authHeader = request.headers.get('authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        console.log('🔑 Vérification du token...');
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
        console.log('✅ Token vérifié, userId:', userId);
      } catch (error) {
        console.error('❌ Erreur de vérification du token:', error);
      }
    } else {
      console.log('❌ Pas de token d\'authentification');
    }

    if (!userId) {
      console.log('❌ Utilisateur non autorisé');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const workspaceId = params.id;
    console.log('📊 Vérification de l\'accès au workspace:', workspaceId);

    // Vérifier que l'utilisateur a accès au workspace
    const member = await workspaceMemberService.getByWorkspaceAndUser(workspaceId, userId);
    console.log('👤 Membre trouvé:', member ? 'Oui' : 'Non');
    
    if (!member) {
      console.log('❌ Accès non autorisé au workspace');
      return NextResponse.json(
        { error: 'Accès non autorisé à ce workspace' },
        { status: 403 }
      );
    }

    // Récupérer tous les membres du workspace
    const members = await workspaceMemberService.getByWorkspaceId(workspaceId);

    return NextResponse.json({
      success: true,
      members
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
        console.error('Erreur de vérification du token:', error);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const workspaceId = params.id;
    const body = await request.json();
    const { email, role = 'editor' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'L\'email est requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire ou admin du workspace
    const member = await workspaceMemberService.getByWorkspaceAndUser(workspaceId, userId);
    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour inviter des membres' },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur existe dans l'application
    const userToInvite = await userService.getUserByEmail(email);
    if (!userToInvite) {
      return NextResponse.json(
        { error: 'Cet utilisateur n\'est pas inscrit dans l\'application. Veuillez demander à cette personne de s\'inscrire d\'abord.' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    const existingMember = await workspaceMemberService.getByWorkspaceAndUser(workspaceId, userToInvite.uid);
    if (existingMember) {
      return NextResponse.json(
        { error: 'Cet utilisateur est déjà membre du workspace' },
        { status: 400 }
      );
    }

    // Créer le membre directement
    const memberId = await workspaceMemberService.create({
      workspaceId,
      userId: userToInvite.uid,
      email: userToInvite.email,
      displayName: userToInvite.displayName,
      photoURL: userToInvite.photoURL,
      role: role as 'admin' | 'editor' | 'viewer',
      status: 'active',
      invitedBy: userId,
      joinedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      memberId,
      message: 'Membre ajouté avec succès au workspace'
    });

  } catch (error) {
    console.error('Erreur lors de l\'invitation du membre:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
