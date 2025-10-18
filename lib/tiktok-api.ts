interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface TikTokUserInfo {
  data: {
    user: {
      open_id: string;
      display_name: string;
      avatar_url: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

class TikTokAPIService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.TIKTOK_CLIENT_ID || '';
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI || '';
  }

  getAuthorizationUrl(userId: string): string {
    const baseUrl = 'https://www.tiktok.com/v2/auth/authorize/';
    
    // Nettoyer l'URI de redirection pour éviter la duplication du paramètre state
    const cleanRedirectUri = this.redirectUri.split('?')[0];
    
    const params = new URLSearchParams({
      client_key: this.clientId,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: cleanRedirectUri,
      state: userId, // Utiliser userId comme state pour CSRF
    });

    return `${baseUrl}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<TikTokTokenResponse> {
    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    
    // Construire les paramètres manuellement pour éviter l'encodage automatique
    const params = `client_key=${this.clientId}&client_secret=${this.clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${this.redirectUri}`;

    console.log('Échange du code contre des tokens...');
    console.log('Token URL:', tokenUrl);
    console.log('Params:', params);
    console.log('Redirect URI:', this.redirectUri);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur lors de l\'échange de tokens:', errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse tokens:', data);

    if (data.error) {
      throw new Error(`Erreur TikTok: ${data.error.message || data.error}`);
    }

    return data;
  }

  async getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    const userInfoUrl = 'https://open.tiktokapis.com/v2/user/info/';
    
    const params = new URLSearchParams({
      fields: 'open_id,display_name,avatar_url',
    });

    console.log('Récupération des infos utilisateur...');
    console.log('User Info URL:', userInfoUrl);

    const response = await fetch(`${userInfoUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur lors de la récupération des infos utilisateur:', errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse user info:', data);

    return data;
  }
}

export const tiktokAPIService = new TikTokAPIService();