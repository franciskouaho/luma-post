#!/usr/bin/env node

// Script pour ajouter des données de test dans Firestore
const admin = require('firebase-admin');

// Configuration Firebase Admin
const serviceAccount = {
  projectId: 'lumapost-38e61',
  // En production, utilisez une vraie clé de service
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: serviceAccount.projectId,
  });
}

const db = admin.firestore();

async function addTestData() {
  console.log('🚀 Ajout de données de test...\n');

  // ID utilisateur de test (remplacez par un vrai UID Firebase)
  const testUserId = 'test-user-123';

  try {
    // 1. Ajouter des vidéos de test
    console.log('📹 Ajout de vidéos de test...');
    const videos = [
      {
        userId: testUserId,
        title: 'Ma première vidéo TikTok',
        storageKey: 'uploads/test-user-123/video1.mp4',
        thumbnailKey: 'uploads/test-user-123/thumb1.jpg',
        duration: 30,
        size: 15728640, // 15MB
        status: 'uploaded',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: testUserId,
        title: 'Tutoriel Next.js',
        storageKey: 'uploads/test-user-123/video2.mp4',
        thumbnailKey: 'uploads/test-user-123/thumb2.jpg',
        duration: 45,
        size: 25165824, // 24MB
        status: 'uploaded',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: testUserId,
        title: 'Recette de cuisine rapide',
        storageKey: 'uploads/test-user-123/video3.mp4',
        thumbnailKey: 'uploads/test-user-123/thumb3.jpg',
        duration: 60,
        size: 31457280, // 30MB
        status: 'processing',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const video of videos) {
      await db.collection('videos').add(video);
      console.log(`   ✅ Vidéo ajoutée: ${video.title}`);
    }

    // 2. Ajouter des comptes TikTok de test
    console.log('\n👤 Ajout de comptes TikTok de test...');
    const accounts = [
      {
        userId: testUserId,
        tiktokUserId: 'tiktok_user_1',
        displayName: 'Mon Compte TikTok',
        avatarUrl: 'https://via.placeholder.com/100',
        accessTokenEnc: 'encrypted_access_token_1',
        refreshTokenEnc: 'encrypted_refresh_token_1',
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24h
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: testUserId,
        tiktokUserId: 'tiktok_user_2',
        displayName: 'Mon Autre Compte',
        avatarUrl: 'https://via.placeholder.com/100',
        accessTokenEnc: 'encrypted_access_token_2',
        refreshTokenEnc: 'encrypted_refresh_token_2',
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24h
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const account of accounts) {
      await db.collection('accounts').add(account);
      console.log(`   ✅ Compte ajouté: ${account.displayName}`);
    }

    // 3. Ajouter des planifications de test
    console.log('\n📅 Ajout de planifications de test...');
    
    // Récupérer les IDs des vidéos et comptes créés
    const videosSnapshot = await db.collection('videos').where('userId', '==', testUserId).get();
    const accountsSnapshot = await db.collection('accounts').where('userId', '==', testUserId).get();
    
    const videoIds = videosSnapshot.docs.map(doc => doc.id);
    const accountIds = accountsSnapshot.docs.map(doc => doc.id);

    const schedules = [
      {
        userId: testUserId,
        videoId: videoIds[0],
        accountId: accountIds[0],
        title: 'Ma première vidéo TikTok',
        description: 'Ma première vidéo publiée automatiquement ! #tiktok #premiere',
        hashtags: ['tiktok', 'premiere', 'automatique'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // Il y a 2h
        status: 'published',
        tiktokPostId: 'tiktok_post_123',
        tiktokVideoUrl: 'https://tiktok.com/@user/video/123',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: testUserId,
        videoId: videoIds[1],
        accountId: accountIds[0],
        title: 'Tutoriel Next.js',
        description: 'Apprenez Next.js en 45 secondes ! #nextjs #tutorial #dev',
        hashtags: ['nextjs', 'tutorial', 'dev', 'javascript'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // Demain
        status: 'scheduled',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
      {
        userId: testUserId,
        videoId: videoIds[2],
        accountId: accountIds[1],
        title: 'Recette de cuisine rapide',
        description: 'Une recette simple et rapide ! #cuisine #rapide #recette',
        hashtags: ['cuisine', 'rapide', 'recette', 'food'],
        scheduledAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)), // Hier
        status: 'failed',
        lastError: 'Token TikTok expiré',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const schedule of schedules) {
      await db.collection('schedules').add(schedule);
      console.log(`   ✅ Planification ajoutée: ${schedule.title} (${schedule.status})`);
    }

    console.log('\n🎉 Données de test ajoutées avec succès !');
    console.log(`\n📊 Résumé:`);
    console.log(`   - ${videos.length} vidéos`);
    console.log(`   - ${accounts.length} comptes TikTok`);
    console.log(`   - ${schedules.length} planifications`);
    console.log(`\n🔗 Testez maintenant votre dashboard avec l'utilisateur: ${testUserId}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error);
  } finally {
    process.exit(0);
  }
}

addTestData();
