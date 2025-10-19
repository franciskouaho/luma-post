import { setGlobalOptions } from "firebase-functions";
import { onRequest, onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

// Configuration globale des fonctions
setGlobalOptions({ 
  maxInstances: 10,
  region: 'europe-west1'
});


// Fonction de test pour vérifier que les fonctions sont actives
export const healthCheck = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  (request, response) => {
    logger.info("Health check appelé", { structuredData: true });
    
    response.status(200).json({
      success: true,
      message: "LumaPost Functions are running!",
      timestamp: new Date().toISOString(),
      region: 'europe-west1'
    });
  }
);

// Fonction pour publier immédiatement une vidéo
export const publishVideoNow = onCall(
  {
    region: 'europe-west1',
    memory: '512MiB',
    timeoutSeconds: 300,
  },
  async (request) => {
    try {
      const { videoId, accountId, userId } = request.data;
      
      if (!videoId || !accountId || !userId) {
        throw new Error('Paramètres manquants');
      }

      logger.info(`Publication immédiate demandée pour videoId: ${videoId}`);
      
      // Pour l'instant, on retourne un succès simulé
      // La vraie logique de publication sera implémentée plus tard
      return {
        success: true,
        message: 'Publication simulée avec succès',
        videoId,
        accountId,
        userId
      };

    } catch (error) {
      logger.error('Erreur lors de la publication immédiate:', error);
      throw new Error(`Erreur lors de la publication: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
);

// Fonction planifiée qui vérifie les publications en attente toutes les minutes
export const checkScheduledPosts = onSchedule(
  {
    schedule: 'every 1 minutes',
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  async (event) => {
    try {
      logger.info('Vérification des publications planifiées', { structuredData: true });
      
      // Cette fonction sera implémentée pour vérifier les schedules
      // et déclencher les publications quand c'est le moment
      
      logger.info('Vérification terminée');
    } catch (error) {
      logger.error('Erreur lors de la vérification des publications:', error);
    }
  }
);

// Trigger Firestore pour les nouvelles planifications
export const onScheduleCreated = onDocumentCreated(
  {
    document: 'schedules/{scheduleId}',
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  async (event) => {
    try {
      const scheduleId = event.params.scheduleId;
      const scheduleData = event.data?.data();
      
      if (!scheduleData) return;
      
      logger.info(`Nouvelle planification créée: ${scheduleId}`, { structuredData: true });
      
      // Ici on peut ajouter la logique pour traiter la nouvelle planification
      // Par exemple, programmer une tâche ou vérifier si c'est pour maintenant
      
    } catch (error) {
      logger.error('Erreur lors du traitement de la nouvelle planification:', error);
    }
  }
);
