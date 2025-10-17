import { onRequest } from 'firebase-functions/v2/https';
import { publishTikTokVideo } from './publishTikTok';
import { 
  createTaskQueue, 
  schedulePublishTask, 
  listTasks, 
  cancelTask 
} from './cloudTasks';

// Export de la fonction de publication
export const publishTikTok = onRequest(
  {
    region: 'europe-west1',
    timeoutSeconds: 300,
    memory: '512MiB',
  },
  publishTikTokVideo
);

// Export des fonctions Cloud Tasks
export { createTaskQueue, schedulePublishTask, listTasks, cancelTask };
