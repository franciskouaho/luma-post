const {onRequest, onCall} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");

// Fonction de test pour vérifier que les fonctions sont actives
exports.healthCheck = onRequest(
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
exports.publishVideoNow = onCall(
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
exports.checkScheduledPosts = onSchedule(
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

// Fonction pour traiter les nouvelles planifications (appelée manuellement)
exports.processSchedule = onCall(
  {
    region: 'europe-west1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  async (request) => {
    try {
      const { scheduleId } = request.data;
      
      if (!scheduleId) {
        throw new Error('ScheduleId requis');
      }
      
      logger.info(`Traitement de la planification: ${scheduleId}`, { structuredData: true });
      
      // Ici on peut ajouter la logique pour traiter la planification
      
      return {
        success: true,
        message: `Planification ${scheduleId} traitée avec succès`,
        scheduleId
      };
      
    } catch (error) {
      logger.error('Erreur lors du traitement de la planification:', error);
      throw new Error(`Erreur lors du traitement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
);