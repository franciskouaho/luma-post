import { onCall } from 'firebase-functions/v2/https';
import { CloudTasksClient } from '@google-cloud/tasks';

const client = new CloudTasksClient();

// Fonction pour créer la queue Cloud Tasks
export const createTaskQueue = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    try {
      const projectId = 'lumapost-38e61';
      const location = 'europe-west1';
      const queueName = 'publish-queue';

      // Chemin de la queue
      const parent = client.locationPath(projectId, location);

      // Configuration de la queue
      const queue = {
        name: client.queuePath(projectId, location, queueName),
        rateLimits: {
          maxDispatchesPerSecond: 10,
          maxBurstSize: 100,
        },
        retryConfig: {
          maxAttempts: 10,
          maxBackoff: {
            seconds: 600, // 10 minutes
          },
          minBackoff: {
            seconds: 5,
          },
        },
      };

      // Créer la queue
      const [response] = await client.createQueue({
        parent,
        queue,
      });

      console.log(`Queue créée: ${response.name}`);

      return {
        success: true,
        queueName: response.name,
        message: 'Queue Cloud Tasks créée avec succès',
      };

    } catch (error) {
      console.error('Erreur lors de la création de la queue:', error);
      
      // Si la queue existe déjà, c'est OK
      if (error.code === 6) { // ALREADY_EXISTS
        return {
          success: true,
          message: 'Queue Cloud Tasks existe déjà',
        };
      }

      throw new Error(`Erreur lors de la création de la queue: ${error.message}`);
    }
  }
);

// Fonction pour créer une tâche de publication
export const schedulePublishTask = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    try {
      const { scheduleId, videoId, accountId, userId, scheduledAt } = request.data;

      if (!scheduleId || !videoId || !accountId || !userId || !scheduledAt) {
        throw new Error('Paramètres manquants');
      }

      const projectId = 'lumapost-38e61';
      const location = 'europe-west1';
      const queueName = 'publish-queue';
      const publishEndpoint = 'https://us-central1-lumapost-38e61.cloudfunctions.net/publishTikTokVideo';

      // Chemin de la queue
      const parent = client.queuePath(projectId, location, queueName);

      // Données de la tâche
      const taskData = {
        scheduleId,
        videoId,
        accountId,
        userId,
      };

      // Créer la tâche
      const task = {
        httpRequest: {
          httpMethod: 'POST',
          url: publishEndpoint,
          headers: {
            'Content-Type': 'application/json',
          },
          body: Buffer.from(JSON.stringify(taskData)).toString('base64'),
        },
        scheduleTime: {
          seconds: Math.floor(new Date(scheduledAt).getTime() / 1000),
        },
      };

      const [response] = await client.createTask({
        parent,
        task,
      });

      console.log(`Tâche créée: ${response.name}`);

      return {
        success: true,
        taskName: response.name,
        message: 'Tâche de publication planifiée avec succès',
      };

    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw new Error(`Erreur lors de la création de la tâche: ${error.message}`);
    }
  }
);

// Fonction pour lister les tâches
export const listTasks = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    try {
      const projectId = 'lumapost-38e61';
      const location = 'europe-west1';
      const queueName = 'publish-queue';

      // Chemin de la queue
      const parent = client.queuePath(projectId, location, queueName);

      // Lister les tâches
      const [tasks] = await client.listTasks({
        parent,
      });

      return {
        success: true,
        tasks: tasks.map(task => ({
          name: task.name,
          scheduleTime: task.scheduleTime,
          createTime: task.createTime,
          status: task.status,
        })),
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
    }
  }
);

// Fonction pour annuler une tâche
export const cancelTask = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    try {
      const { taskName } = request.data;

      if (!taskName) {
        throw new Error('Nom de la tâche requis');
      }

      // Supprimer la tâche
      await client.deleteTask({
        name: taskName,
      });

      console.log(`Tâche annulée: ${taskName}`);

      return {
        success: true,
        message: 'Tâche annulée avec succès',
      };

    } catch (error) {
      console.error('Erreur lors de l\'annulation de la tâche:', error);
      throw new Error(`Erreur lors de l'annulation de la tâche: ${error.message}`);
    }
  }
);
