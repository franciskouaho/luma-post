import { Request, Response } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { tiktokAPIService } from '../../lib/tiktok-api';
import { PublishTaskData } from '../../lib/cloud-tasks';

// Initialiser Firebase Admin
const app = initializeApp();
const db = getFirestore(app);
const storage = getStorage(app);

export async function publishTikTokVideo(req: Request, res: Response) {
  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Méthode non autorisée' });
      return;
    }

    // Récupérer les données de la tâche
    const taskData: PublishTaskData = req.body;
    const { scheduleId, videoId, accountId, userId } = taskData;

    console.log(`Traitement de la publication pour scheduleId: ${scheduleId}`);

    // 1. Récupérer la planification
    const scheduleDoc = await db.collection('schedules').doc(scheduleId).get();
    if (!scheduleDoc.exists) {
      throw new Error(`Planification non trouvée: ${scheduleId}`);
    }

    const schedule = scheduleDoc.data();
    if (!schedule) {
      throw new Error('Données de planification invalides');
    }

    // Vérifier si déjà publié
    if (schedule.status === 'published') {
      console.log(`Planification ${scheduleId} déjà publiée`);
      res.status(200).json({ message: 'Déjà publié' });
      return;
    }

    // 2. Récupérer la vidéo
    const videoDoc = await db.collection('videos').doc(videoId).get();
    if (!videoDoc.exists) {
      throw new Error(`Vidéo non trouvée: ${videoId}`);
    }

    const video = videoDoc.data();
    if (!video) {
      throw new Error('Données de vidéo invalides');
    }

    // 3. Récupérer le compte TikTok
    const accountDoc = await db.collection('accounts').doc(accountId).get();
    if (!accountDoc.exists) {
      throw new Error(`Compte TikTok non trouvé: ${accountId}`);
    }

    const account = accountDoc.data();
    if (!account) {
      throw new Error('Données de compte invalides');
    }

    // 4. Mettre à jour le statut de la planification
    await db.collection('schedules').doc(scheduleId).update({
      status: 'queued',
      updatedAt: new Date(),
    });

    try {
      // 5. Générer une URL de téléchargement signée pour la vidéo
      const bucket = storage.bucket();
      const file = bucket.file(video.storageKey);
      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      // 6. Publier la vidéo sur TikTok
      const publishResult = await tiktokAPIService.publishVideoComplete(account, {
        videoUrl: signedUrl,
        title: schedule.title,
        description: schedule.description,
        hashtags: schedule.hashtags,
      });

      if (publishResult.success) {
        // 7. Mettre à jour le statut de succès
        await db.collection('schedules').doc(scheduleId).update({
          status: 'published',
          tiktokUrl: `https://www.tiktok.com/@${account.username}/video/${publishResult.publishId}`,
          updatedAt: new Date(),
        });

        console.log(`Vidéo publiée avec succès: ${publishResult.publishId}`);
        res.status(200).json({
          success: true,
          publishId: publishResult.publishId,
          tiktokUrl: `https://www.tiktok.com/@${account.username}/video/${publishResult.publishId}`,
        });
      } else {
        throw new Error(publishResult.error || 'Erreur inconnue lors de la publication');
      }

    } catch (publishError) {
      console.error('Erreur lors de la publication:', publishError);

      // 8. Mettre à jour le statut d'échec
      await db.collection('schedules').doc(scheduleId).update({
        status: 'failed',
        lastError: publishError instanceof Error ? publishError.message : 'Erreur inconnue',
        updatedAt: new Date(),
      });

      res.status(500).json({
        success: false,
        error: publishError instanceof Error ? publishError.message : 'Erreur inconnue',
      });
    }

  } catch (error) {
    console.error('Erreur dans publishTikTokVideo:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur interne du serveur',
    });
  }
}
