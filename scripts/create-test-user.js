#!/usr/bin/env node

// Script pour simuler un utilisateur connecté avec des données
const admin = require('firebase-admin');

// Configuration Firebase Admin
const serviceAccount = {
  projectId: 'lumapost-38e61',
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: serviceAccount.projectId,
  });
}

const db = admin.firestore();

async function createTestUser() {
  console.log('👤 Création d\'un utilisateur de test...\n');

  try {
    // Créer un utilisateur de test dans Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: 'test@luma-poste.com',
      password: 'test123456',
      displayName: 'Utilisateur Test',
      photoURL: 'https://via.placeholder.com/100',
    });

    console.log(`✅ Utilisateur créé: ${userRecord.uid}`);
    console.log(`   Email: ${userRecord.email}`);
    console.log(`   Nom: ${userRecord.displayName}`);

    // Ajouter des données de test pour cet utilisateur
    const userId = userRecord.uid;

    // Vidéos
    console.log('\n📹 Ajout de vidéos...');
    const videos = [
      {
        userId: userId,
        title: 'Ma première vidéo TikTok',
        storageKey: `uploads/${userId}/video1.mp4`,
        thumbnailKey: `uploads/${userId}/thumb1.jpg`,
        duration: 30,
        size: 15728640,
        status: 'uploaded',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userId,
        title: 'Tutoriel Next.js et Firebase',
        storageKey: `uploads/${userId}/video2.mp4`,
        thumbnailKey: `uploads/${userId}/thumb2.jpg`,
        duration: 45,
        size: 25165824,
        status: 'uploaded',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userId,
        title: 'Recette de cuisine rapide',
        storageKey: `uploads/${userId}/video3.mp4`,
        thumbnailKey: `uploads/${userId}/thumb3.jpg`,
        duration: 60,
        size: 31457280,
        status: 'processing',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const video of videos) {
      await db.collection('videos').add(video);
      console.log(`   ✅ ${video.title}`);
    }

    // Comptes TikTok
    console.log('\n👤 Ajout de comptes TikTok...');
    const accounts = [
      {
        userId: userId,
        tiktokUserId: 'tiktok_user_main',
        displayName: 'Mon Compte Principal',
        avatarUrl: 'https://via.placeholder.com/100',
        accessTokenEnc: 'encrypted_access_token_main',
        refreshTokenEnc: 'encrypted_refresh_token_main',
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userId,
        tiktokUserId: 'tiktok_user_secondary',
        displayName: 'Mon Compte Secondaire',
        avatarUrl: 'https://via.placeholder.com/100',
        accessTokenEnc: 'encrypted_access_token_secondary',
        refreshTokenEnc: 'encrypted_refresh_token_secondary',
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const account of accounts) {
      await db.collection('accounts').add(account);
      console.log(`   ✅ ${account.displayName}`);
    }

    // Planifications
    console.log('\n📅 Ajout de planifications...');
    
    const videosSnapshot = await db.collection('videos').where('userId', '==', userId).get();
    const accountsSnapshot = await db.collection('accounts').where('userId', '==', userId).get();
    
    const videoIds = videosSnapshot.docs.map(doc => doc.id);
    const accountIds = accountsSnapshot.docs.map(doc => doc.id);

    const schedules = [
      {
        userId: userId,
        videoId: videoIds[0],
        accountId: accountIds[0],
        title: 'Ma première vidéo TikTok',
        description: 'Ma première vidéo publiée automatiquement ! #tiktok #premiere #automatique',
        hashtags: ['tiktok', 'premiere', 'automatique'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
        status: 'published',
        tiktokPostId: 'tiktok_post_123',
        tiktokVideoUrl: 'https://tiktok.com/@user/video/123',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userId,
        videoId: videoIds[1],
        accountId: accountIds[0],
        title: 'Tutoriel Next.js et Firebase',
        description: 'Apprenez Next.js et Firebase en 45 secondes ! #nextjs #firebase #tutorial #dev',
        hashtags: ['nextjs', 'firebase', 'tutorial', 'dev', 'javascript'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        status: 'scheduled',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userId,
        videoId: videoIds[2],
        accountId: accountIds[1],
        title: 'Recette de cuisine rapide',
        description: 'Une recette simple et rapide ! #cuisine #rapide #recette #food',
        hashtags: ['cuisine', 'rapide', 'recette', 'food'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)),
        status: 'failed',
        lastError: 'Token TikTok expiré - veuillez reconnecter le compte',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: userId,
        videoId: videoIds[0],
        accountId: accountIds[1],
        title: 'Ma première vidéo TikTok (Repost)',
        description: 'Repost sur mon compte secondaire ! #tiktok #repost #crosspost',
        hashtags: ['tiktok', 'repost', 'crosspost'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
        status: 'scheduled',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const schedule of schedules) {
      await db.collection('schedules').add(schedule);
      console.log(`   ✅ ${schedule.title} (${schedule.status})`);
    }

    console.log('\n🎉 Utilisateur de test créé avec succès !');
    console.log(`\n📊 Résumé:`);
    console.log(`   - Utilisateur: ${userRecord.email}`);
    console.log(`   - UID: ${userId}`);
    console.log(`   - ${videos.length} vidéos`);
    console.log(`   - ${accounts.length} comptes TikTok`);
    console.log(`   - ${schedules.length} planifications`);
    
    console.log(`\n🔐 Informations de connexion:`);
    console.log(`   Email: ${userRecord.email}`);
    console.log(`   Mot de passe: test123456`);
    
    console.log(`\n🚀 Vous pouvez maintenant:`);
    console.log(`   1. Aller sur http://localhost:3000/auth`);
    console.log(`   2. Vous connecter avec ces identifiants`);
    console.log(`   3. Voir le dashboard avec de vraies données !`);

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();
