import { TikTokAccount } from './firestore';

// Types pour l'API TikTok Business
export interface TikTokVideoUpload {
  video_url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIEND' | 'SELF_ONLY';
  disable_duet?: boolean;
  disable_comment?: boolean;
  disable_stitch?: boolean;
  disable_share?: boolean;
}

export interface TikTokVideoResponse {
  data: {
    publish_id: string;
    upload_url: string;
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

export interface TikTokPublishResponse {
  data: {
    publish_id: string;
    status: 'PROCESSING' | 'PUBLISHED' | 'FAILED';
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

export interface TikTokUserInfo {
  data: {
    user: {
      open_id: string;
      union_id: string;
      avatar_url: string;
      display_name: string;
      follower_count: number;
      following_count: number;
      likes_count: number;
      video_count: number;
    };
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

// Service TikTok Business API
export class TikTokAPIService {
  private baseUrl = 'https://open-api.tiktok.com';
  private clientId = process.env.TIKTOK_CLIENT_ID;
  private clientSecret = process.env.TIKTOK_CLIENT_SECRET;

  // Déchiffrer les tokens (à implémenter avec votre logique de chiffrement)
  private decryptToken(encryptedToken: string): string {
    // Ici vous devriez implémenter votre logique de déchiffrement AES-256-GCM
    // Pour l'instant, on retourne le token tel quel
    return encryptedToken;
  }

  // Obtenir un nouvel access token avec refresh token
  async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await fetch(`${this.baseUrl}/oauth/refresh_token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_key: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.decryptToken(refreshToken),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du refresh token: ${response.statusText}`);
    }

    return await response.json();
  }

  // Obtenir les informations de l'utilisateur TikTok
  async getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    const response = await fetch(`${this.baseUrl}/user/info/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.decryptToken(accessToken)}`,
      },
    });

    return await response.json();
  }

  // Initialiser l'upload d'une vidéo
  async initializeVideoUpload(
    accessToken: string,
    uploadData: TikTokVideoUpload
  ): Promise<TikTokVideoResponse> {
    const response = await fetch(`${this.baseUrl}/share/video/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.decryptToken(accessToken)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    return await response.json();
  }

  // Publier une vidéo
  async publishVideo(
    accessToken: string,
    publishId: string
  ): Promise<TikTokPublishResponse> {
    const response = await fetch(`${this.baseUrl}/share/video/publish/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.decryptToken(accessToken)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publish_id: publishId,
      }),
    });

    return await response.json();
  }

  // Vérifier le statut d'une publication
  async checkPublishStatus(
    accessToken: string,
    publishId: string
  ): Promise<TikTokPublishResponse> {
    const response = await fetch(`${this.baseUrl}/share/video/status/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.decryptToken(accessToken)}`,
      },
    });

    return await response.json();
  }

  // Publier une vidéo complète (upload + publish)
  async publishVideoComplete(
    account: TikTokAccount,
    videoData: {
      videoUrl: string;
      title: string;
      description?: string;
      hashtags?: string[];
    }
  ): Promise<{ success: boolean; publishId?: string; error?: string }> {
    try {
      // 1. Initialiser l'upload
      const uploadResponse = await this.initializeVideoUpload(
        account.accessTokenEnc,
        {
          video_url: videoData.videoUrl,
          title: videoData.title,
          description: videoData.description,
          hashtags: videoData.hashtags,
          privacy_level: 'PUBLIC_TO_EVERYONE',
        }
      );

      if (uploadResponse.error) {
        return {
          success: false,
          error: uploadResponse.error.message,
        };
      }

      // 2. Publier la vidéo
      const publishResponse = await this.publishVideo(
        account.accessTokenEnc,
        uploadResponse.data.publish_id
      );

      if (publishResponse.error) {
        return {
          success: false,
          error: publishResponse.error.message,
        };
      }

      return {
        success: true,
        publishId: publishResponse.data.publish_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  // Valider un access token
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo(accessToken);
      return !userInfo.error;
    } catch {
      return false;
    }
  }

  // Obtenir l'URL d'autorisation OAuth
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.clientId!,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      state,
    });

    return `${this.baseUrl}/oauth/authorize/?${params.toString()}`;
  }

  // Échanger le code d'autorisation contre des tokens
  async exchangeCodeForTokens(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  }> {
    const response = await fetch(`${this.baseUrl}/oauth/access_token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_key: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'échange du code: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Instance du service
export const tiktokAPIService = new TikTokAPIService();
