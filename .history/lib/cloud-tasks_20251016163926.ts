import { CloudTasksClient } from '@google-cloud/tasks';
import { getFunctions } from 'firebase-admin/functions';

// Configuration Cloud Tasks
const projectId = process.env.GCP_PROJECT || 'lumapost-38e61';
const location = process.env.GCP_LOCATION || 'europe-west1';
const queueName = process.env.TASK_QUEUE || 'publish-queue';
const publishEndpoint = process.env.PUBLISH_ENDPOINT || 'https://publish-tiktok-xxxxxxxx-ew.a.run.app';

// Client Cloud Tasks
const client = new CloudTasksClient();

export interface PublishTaskData {
  scheduleId: string;
  videoId: string;
  accountId: string;
  userId: string;
}

export class CloudTasksService {
  private queuePath: string;

  constructor() {
    this.queuePath = client.queuePath(projectId, location, queueName);
  }

  // Créer une tâche planifiée pour la publication
  async schedulePublishTask(
    scheduleId: string,
    videoId: string,
    accountId: string,
    userId: string,
    scheduledAt: Date
  ): Promise<string> {
    try {
      const taskData: PublishTaskData = {
        scheduleId,
        videoId,
        accountId,
        userId,
      };

      // Calculer le délai en millisecondes
      const delayMs = scheduledAt.getTime() - Date.now();
      
      if (delayMs <= 0) {
        throw new Error('La date de planification doit être dans le futur');
      }

      // Créer la tâche
      const task = {
        httpRequest: {
          httpMethod: 'POST' as const,
          url: publishEndpoint,
          headers: {
            'Content-Type': 'application/json',
          },
          body: Buffer.from(JSON.stringify(taskData)).toString('base64'),
        },
        scheduleTime: {
          seconds: Math.floor(scheduledAt.getTime() / 1000),
        },
      };

      const [response] = await client.createTask({
        parent: this.queuePath,
        task,
      });

      console.log(`Tâche créée: ${response.name}`);
      return response.name || '';

    } catch (error) {
      console.error('Erreur lors de la création de la tâche Cloud Tasks:', error);
      throw error;
    }
  }

  // Annuler une tâche planifiée
  async cancelTask(taskName: string): Promise<void> {
    try {
      await client.deleteTask({ name: taskName });
      console.log(`Tâche annulée: ${taskName}`);
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la tâche:', error);
      throw error;
    }
  }

  // Lister les tâches en attente
  async listTasks(): Promise<any[]> {
    try {
      const [tasks] = await client.listTasks({
        parent: this.queuePath,
      });
      return tasks;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  }

  // Obtenir les informations d'une tâche
  async getTask(taskName: string): Promise<any> {
    try {
      const [task] = await client.getTask({ name: taskName });
      return task;
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      throw error;
    }
  }

  // Créer une tâche immédiate (pour les tests)
  async createImmediateTask(taskData: PublishTaskData): Promise<string> {
    try {
      const task = {
        httpRequest: {
          httpMethod: 'POST' as const,
          url: publishEndpoint,
          headers: {
            'Content-Type': 'application/json',
          },
          body: Buffer.from(JSON.stringify(taskData)).toString('base64'),
        },
      };

      const [response] = await client.createTask({
        parent: this.queuePath,
        task,
      });

      console.log(`Tâche immédiate créée: ${response.name}`);
      return response.name || '';

    } catch (error) {
      console.error('Erreur lors de la création de la tâche immédiate:', error);
      throw error;
    }
  }
}

// Instance du service
export const cloudTasksService = new CloudTasksService();
