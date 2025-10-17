import { onRequest } from 'firebase-functions/v2/https';
import { publishTikTokVideo } from './publishTikTok';

// Export de la fonction de publication
export const publishTikTok = onRequest(
  {
    region: 'europe-west1',
    timeoutSeconds: 300,
    memory: '512MiB',
  },
  publishTikTokVideo
);
