import { EncryptionService } from './encryption';

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

interface TikTokAccount {
  id: string;
  username: string;
  accessTokenEnc: string;
  refreshTokenEnc?: string;
  userId: string;
}

interface TikTokPostSettings {
  privacyLevel: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  commercialContent: {
    enabled: boolean;
    yourBrand: boolean;
    brandedContent: boolean;
  };
}

interface CreatorInfo {
  nickname: string;
  privacy_level_options: string[];
  max_video_post_duration_sec: number;
  can_post: boolean;
  max_posts_reached: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  comment_disabled: boolean;
}

class TikTokAPIService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.TIKTOK_CLIENT_ID || '';
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI || 'https://luma-post.emplica.fr/api/auth/tiktok/callback';
  }

  // Fonction de déchiffrement avec AES-256-GCM
  private decryptToken(encryptedToken: string): string {
    try {
      return EncryptionService.decrypt(encryptedToken);
    } catch (error) {
      console.error('Erreur déchiffrement token:', error);
      throw new Error('Impossible de déchiffrer le token d\'accès');
    }
  }

  // Fonction pour vérifier si une URL peut être utilisée avec PULL_FROM_URL
  private canUsePullFromUrl(_videoUrl: string, _isBusinessAccount: boolean): boolean {
    // Google Cloud Storage n'est pas vérifié par TikTok, donc on utilise toujours FILE_UPLOAD
    // pour éviter l'erreur url_ownership_unverified
    return false; // Toujours utiliser FILE_UPLOAD
  }

  // Fonction pour refresh un token expiré
  async refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    
    const params = `client_key=${this.clientId}&client_secret=${this.clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`;


    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur lors du rafraîchissement du token:', errorText);
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Erreur TikTok: ${data.error.message || data.error}`);
    }

    return data;
  }

  getAuthorizationUrl(userId: string): string {
    const baseUrl = 'https://www.tiktok.com/v2/auth/authorize/';
    
    // Nettoyer l'URI de redirection pour éviter la duplication du paramètre state
    const cleanRedirectUri = this.redirectUri.split('?')[0];
    
    const params = new URLSearchParams({
      client_key: this.clientId,
      scope: 'user.info.basic,video.publish,video.upload',
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

    return data;
  }

  // Nouvelle méthode pour récupérer les informations du créateur
  async getCreatorInfo(account: TikTokAccount): Promise<CreatorInfo | null> {
    try {
      const accessToken = this.decryptToken(account.accessTokenEnc);
      
      // Utiliser l'endpoint creator_info/query/ qui est plus approprié
      const creatorResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      if (!creatorResponse.ok) {
        const errorText = await creatorResponse.text();
        console.error('Erreur lors de la récupération des infos créateur:', errorText);
        
        // Si le token est invalide, essayer de le rafraîchir
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.code === 'access_token_invalid' && account.refreshTokenEnc) {
            
            const refreshToken = this.decryptToken(account.refreshTokenEnc);
            const newTokens = await this.refreshAccessToken(refreshToken);
            
            // Retry avec le nouveau token
            const retryResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${newTokens.access_token}`,
                'Content-Type': 'application/json; charset=UTF-8',
              },
            });
            
            if (retryResponse.ok) {
              const retryResult = await retryResponse.json();
              
              if (retryResult.error && retryResult.error.code !== 'ok') {
                console.error(`Erreur TikTok Creator Info: ${retryResult.error.message || retryResult.error}`);
                return null;
              }
              
              const { nickname, privacy_level_options, max_video_post_duration_sec, can_post, max_posts_reached, duet_disabled, stitch_disabled, comment_disabled } = retryResult.data;
              
              return {
                nickname,
                privacy_level_options,
                max_video_post_duration_sec,
                can_post,
                max_posts_reached,
                duet_disabled,
                stitch_disabled,
                comment_disabled
              };
            }
          }
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement:', refreshError);
        }
        
        return null;
      }

      const creatorResult = await creatorResponse.json();

      if (creatorResult.error && creatorResult.error.code !== 'ok') {
        console.error(`Erreur TikTok Creator Info: ${creatorResult.error.message || creatorResult.error}`);
        return null;
      }

      const { nickname, privacy_level_options, max_video_post_duration_sec, can_post, max_posts_reached, duet_disabled, stitch_disabled, comment_disabled } = creatorResult.data;
      
      return {
        nickname,
        privacy_level_options,
        max_video_post_duration_sec,
        can_post,
        max_posts_reached,
        duet_disabled,
        stitch_disabled,
        comment_disabled
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos créateur:', error);
      return null;
    }
  }

  async publishVideoComplete(account: TikTokAccount, videoData: {
    videoUrl: string;
    title?: string;
    description?: string;
    hashtags?: string[];
  }, settings: TikTokPostSettings, accountService?: { update: (id: string, updates: Record<string, unknown>) => Promise<void> }) {
    try {

      // Déchiffrer le token d'accès
      let accessToken = this.decryptToken(account.accessTokenEnc);

      // ÉTAPE 0: Query Creator Info (requis par la nouvelle API)
      const creatorInfoUrl = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';
      
      const creatorResponse = await fetch(creatorInfoUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      if (!creatorResponse.ok) {
        const errorText = await creatorResponse.text();
        const errorData = JSON.parse(errorText);
        
        // Si le token est invalide, essayer de le rafraîchir
        if (errorData.error?.code === 'access_token_invalid' && account.refreshTokenEnc && accountService) {
          
          try {
            const refreshToken = this.decryptToken(account.refreshTokenEnc);
            const newTokens = await this.refreshAccessToken(refreshToken);
            
            // Mettre à jour le token dans la base de données
            await accountService.update(account.id, {
              accessTokenEnc: EncryptionService.encrypt(newTokens.access_token),
              refreshTokenEnc: EncryptionService.encrypt(newTokens.refresh_token),
              expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
            });
            
            accessToken = newTokens.access_token;
            
            // Réessayer la requête avec le nouveau token
            const retryResponse = await fetch(creatorInfoUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=UTF-8',
              },
            });
            
            if (!retryResponse.ok) {
              const retryErrorText = await retryResponse.text();
              console.error('Erreur après rafraîchissement du token:', retryErrorText);
              throw new Error(`Erreur HTTP ${retryResponse.status}: ${retryErrorText}`);
            }
            
            const creatorResult = await retryResponse.json();
            
            if (creatorResult.error && creatorResult.error.code !== 'ok') {
              throw new Error(`Erreur TikTok Creator Info: ${creatorResult.error.message || creatorResult.error}`);
            }
            
            const { privacy_level_options } = creatorResult.data;
            
            // Continuer avec la publication...
            return this.continuePublishing(account, accessToken, privacy_level_options, videoData, settings);
            
          } catch (refreshError) {
            console.error('Échec du rafraîchissement du token:', refreshError);
            throw new Error(`Token expiré et impossible de le rafraîchir: ${refreshError instanceof Error ? refreshError.message : 'Erreur inconnue'}`);
          }
        }
        
        console.error('Erreur lors de la récupération des infos créateur:', errorText);
        throw new Error(`Erreur HTTP ${creatorResponse.status}: ${errorText}`);
      }

      const creatorResult = await creatorResponse.json();

      if (creatorResult.error && creatorResult.error.code !== 'ok') {
        throw new Error(`Erreur TikTok Creator Info: ${creatorResult.error.message || creatorResult.error}`);
      }

      const { privacy_level_options } = creatorResult.data;

      // Continuer avec la publication
      return this.continuePublishing(account, accessToken, privacy_level_options, videoData, settings);

    } catch (error) {
      console.error('Erreur lors de la publication TikTok:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  private async continuePublishing(account: TikTokAccount, accessToken: string, privacyLevelOptions: string[], videoData: {
    videoUrl: string;
    title?: string;
    description?: string;
    hashtags?: string[];
  }, settings: TikTokPostSettings) {
    
    // Validation des scopes requis
    console.log('🔍 Validation des scopes TikTok...');
    try {
      const scopeCheckUrl = 'https://open.tiktokapis.com/v2/user/info/';
      const scopeResponse = await fetch(scopeCheckUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!scopeResponse.ok) {
        throw new Error('Scopes TikTok insuffisants - vérifiez les permissions video.publish');
      }
      console.log('✅ Scopes TikTok validés');
    } catch (error) {
      console.error('❌ Erreur validation scopes:', error);
      throw new Error('Impossible de valider les scopes TikTok. Veuillez reconnecter votre compte.');
    }
    // Construire la description avec hashtags
    let description = videoData.description || videoData.title || '';
    if (videoData.hashtags && videoData.hashtags.length > 0) {
      const hashtagsString = videoData.hashtags.map(tag => `#${tag}`).join(' ');
      description = `${description}\n\n${hashtagsString}`;
    }
    
    // Si la description est vide, utiliser un texte par défaut
    if (!description.trim()) {
      description = 'Vidéo publiée via Luma Post';
    }
    
    // Récupérer la vidéo depuis l'URL et la convertir en Buffer (côté serveur)
    const videoResponse = await fetch(videoData.videoUrl);
    if (!videoResponse.ok) {
      throw new Error('Impossible de récupérer la vidéo depuis l\'URL fournie');
    }
    
    // Convertir en Buffer pour éviter les problèmes avec l'objet File côté serveur
    const videoArrayBuffer = await videoResponse.arrayBuffer();
    const videoBuffer = Buffer.from(videoArrayBuffer);
    const videoSize = videoBuffer.length;
    
    // Calculer le chunking selon les spécifications TikTok
    // chunk_size entre 5 MB et 64 MB, dernier chunk jusqu'à 128 MB
    const maxChunkSize = 64 * 1024 * 1024; // 64 MB
    const minChunkSize = 5 * 1024 * 1024;  // 5 MB
    
    let chunkSize = maxChunkSize;
    if (videoSize < minChunkSize) {
      // Fichier petit : un seul chunk
      chunkSize = videoSize;
    }
    
    // IMPORTANT: TikTok spécifie Math.floor pour total_chunk_count
    // Le dernier chunk peut dépasser (trailing bytes) jusqu'à 128MB
    const totalChunkCount = Math.floor(videoSize / chunkSize) + (videoSize % chunkSize > 0 ? 1 : 0);
    
    console.log(`📊 Chunking: ${videoSize} bytes en ${totalChunkCount} chunk(s) de ${chunkSize} bytes`);

    
    const sourceInfo = {
      source: 'FILE_UPLOAD',
      video_size: videoSize,
      chunk_size: chunkSize,
      total_chunk_count: totalChunkCount,
    };

    // ÉTAPE 2: Initialisation - FORCER Direct Post uniquement
    
    
    let initResult;
    const useInboxEndpoint = false; // Toujours false - on force Direct Post
    
    // Essayer UNIQUEMENT l'endpoint Direct Post (pas de fallback vers inbox)
    try {
      const directPostUrl = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
      
      // Utiliser les paramètres utilisateur pour la confidentialité
      const privacyLevel = privacyLevelOptions.includes(settings.privacyLevel) 
        ? settings.privacyLevel 
        : privacyLevelOptions.includes('PUBLIC_TO_EVERYONE')
        ? 'PUBLIC_TO_EVERYONE' 
        : privacyLevelOptions.includes('MUTUAL_FOLLOW_FRIENDS')
        ? 'MUTUAL_FOLLOW_FRIENDS'
        : privacyLevelOptions[0] || 'SELF_ONLY';
      
      const directPostData = {
        post_info: {
          title: description,
          privacy_level: privacyLevel,
          disable_duet: !settings.allowDuet,
          disable_comment: !settings.allowComments,
          disable_stitch: !settings.allowStitch,
          brand_content_toggle: settings.commercialContent.brandedContent,
          brand_organic_toggle: settings.commercialContent.yourBrand,
          video_cover_timestamp_ms: 1000, // Utiliser la première seconde comme couverture
        },
        source_info: sourceInfo,
        // Forcer le mode Direct Post (pas INBOX_SHARE)
        publish_type: 'DIRECT_POST'
      };


      const directPostResponse = await fetch(directPostUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(directPostData),
      });

      if (!directPostResponse.ok) {
        const errorText = await directPostResponse.text();
        const errorData = JSON.parse(errorText);
        
        
        // Gestion des erreurs - FORCER Direct Post (pas de fallback inbox)
        switch (errorData.error?.code) {
          case 'unaudited_client_can_only_post_to_private_accounts':
            
            // Retry avec SELF_ONLY si ce n'était pas déjà le cas
            if (privacyLevel !== 'SELF_ONLY') {
              const retryData = {
                ...directPostData,
                post_info: {
                  ...directPostData.post_info,
                  privacy_level: 'SELF_ONLY'
                }
              };
              
              
              const retryResponse = await fetch(directPostUrl, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(retryData),
              });
              
              if (retryResponse.ok) {
                initResult = await retryResponse.json();
                break;
              } else {
                // Si même SELF_ONLY échoue, on lance une erreur au lieu de basculer vers inbox
                throw new Error('Impossible de publier directement - même avec SELF_ONLY. Vérifiez les permissions du compte.');
              }
            } else {
              // Si déjà SELF_ONLY et ça échoue, on lance une erreur
              throw new Error('Impossible de publier directement avec SELF_ONLY. Vérifiez les permissions du compte.');
            }
            break;
            
          case 'privacy_level_option_mismatch':
            
            const fallbackData = {
              ...directPostData,
              post_info: {
                ...directPostData.post_info,
                privacy_level: 'SELF_ONLY'
              }
            };
            
            const fallbackResponse = await fetch(directPostUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=UTF-8',
              },
              body: JSON.stringify(fallbackData),
            });
            
            if (fallbackResponse.ok) {
              initResult = await fallbackResponse.json();
            } else {
              // Pas de fallback vers inbox - on lance une erreur
              throw new Error('Erreur de niveau de confidentialité - impossible de publier directement.');
            }
            break;
            
          case 'spam_risk_too_many_posts':
            throw new Error('Limite quotidienne de posts atteinte pour cet utilisateur');
            
          case 'spam_risk_user_banned_from_posting':
            throw new Error('L\'utilisateur est banni de TikTok');
            
          case 'reached_active_user_cap':
            throw new Error('Quota quotidien d\'utilisateurs actifs atteint');
            
          case 'rate_limit_exceeded':
            await new Promise(resolve => setTimeout(resolve, 10000));
            throw new Error('Limite de taux dépassée - veuillez réessayer dans quelques minutes');
            
          default:
            console.error('Erreur Direct Post:', errorText);
            throw new Error(`Erreur HTTP ${directPostResponse.status}: ${errorText}`);
        }
      } else {
        initResult = await directPostResponse.json();
      }
    } catch (error) {
      // Pas de fallback vers inbox - on relance l'erreur
      throw error;
    }
    
    // Si on arrive ici, c'est que Direct Post a réussi
    // Plus de fallback vers inbox - on utilise uniquement Direct Post

    if (initResult.error && initResult.error.code !== 'ok') {
      const errorCode = initResult.error.code;
      let errorMessage = initResult.error.message || 'Erreur inconnue';
      
      // Gestion spécifique des erreurs selon la documentation
      switch (errorCode) {
        case 'spam_risk_too_many_posts':
          errorMessage = 'Limite quotidienne de posts atteinte pour cet utilisateur';
          break;
        case 'spam_risk_user_banned_from_posting':
          errorMessage = 'L\'utilisateur est banni de TikTok';
          break;
        case 'reached_active_user_cap':
          errorMessage = 'Quota quotidien d\'utilisateurs actifs atteint';
          break;
        case 'unaudited_client_can_only_post_to_private_accounts':
          errorMessage = 'Application non audité par TikTok. Le contenu sera publié en mode privé uniquement.';
          break;
        case 'privacy_level_option_mismatch':
          errorMessage = 'Niveau de confidentialité non valide';
          break;
        case 'access_token_invalid':
          errorMessage = 'Token d\'accès invalide ou expiré';
          break;
        case 'scope_not_authorized':
          errorMessage = 'Scope requis non autorisé - veuillez reconnecter votre compte TikTok';
          break;
        case 'rate_limit_exceeded':
          errorMessage = 'Limite de taux dépassée (6 requêtes/minute)';
          break;
        case 'invalid_params':
          if (errorMessage.includes('total chunk count')) {
            errorMessage = 'Nombre de chunks invalide - problème de calcul de segmentation';
          }
          break;
      }
      
      throw new Error(`Erreur TikTok (${errorCode}): ${errorMessage}`);
    }

    const { publish_id, upload_url } = initResult.data;

    // ÉTAPE 3: Upload du fichier vers TikTok en chunks (si upload_url fourni)

    if (upload_url) {
      // Déterminer le Content-Type selon les formats TikTok supportés uniquement
      let contentType = 'video/mp4'; // Par défaut MP4 (format recommandé)
      const url = videoData.videoUrl.toLowerCase();
      
      // Formats TikTok officiellement supportés uniquement
      if (url.includes('.mov')) {
        contentType = 'video/quicktime';
      } else if (url.includes('.webm')) {
        contentType = 'video/webm';
      }
      // Note: AVI, WMV, MKV, FLV ne sont pas supportés par TikTok
      
      console.log(`📤 Upload vidéo avec Content-Type: ${contentType}`);
      
      // Upload en chunks selon les spécifications TikTok
      for (let i = 0; i < totalChunkCount; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, videoSize);
        const chunk = videoBuffer.slice(start, end);
        const chunkLength = chunk.length;
        
        console.log(`📤 Upload chunk ${i + 1}/${totalChunkCount}: bytes ${start}-${end - 1}/${videoSize}`);
        
        const uploadResponse = await fetch(upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': contentType,
            'Content-Length': chunkLength.toString(),
            'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
          },
          body: chunk,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error(`Erreur upload chunk ${i + 1}:`, errorText);
          throw new Error(`Erreur upload chunk ${i + 1} (${uploadResponse.status}): ${errorText}`);
        }
        
        console.log(`✅ Chunk ${i + 1}/${totalChunkCount} uploadé avec succès`);
      }
      
      console.log('✅ Upload complet terminé');
    }

    // ÉTAPE 4: Vérifier le statut seulement pour Direct Post
    let finalStatus = 'UNKNOWN';
    if (!useInboxEndpoint) {
      const statusUrl = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';
      
      let attempts = 0;
      const maxAttempts = 30; // Attente standard pour FILE_UPLOAD

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(statusUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            publish_id: publish_id
          }),
        });

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          console.error('Erreur lors de la vérification du statut:', errorText);
          break;
        }

        const statusResult = await statusResponse.json();

        if (statusResult.error && statusResult.error.code !== 'ok') {
          console.error('Erreur dans la réponse de statut:', statusResult.error);
          break;
        }

        const status = statusResult.data?.status;
        finalStatus = status;

        if (status === 'PROCESSING_DOWNLOAD') {
        } else if (status === 'PROCESSING_UPLOAD') {
        } else if (status === 'PROCESSING_POST') {
        } else if (status === 'PUBLISHED') {
          break;
        } else if (status === 'FAILED') {
          console.error('❌ Échec de la publication:', statusResult.data?.fail_reason);
          throw new Error(`Échec de la publication: ${statusResult.data?.fail_reason || 'Raison inconnue'}`);
        }

        attempts++;
        if (attempts < maxAttempts) {
          const waitTime = 10000; // 10s d'attente standard pour FILE_UPLOAD
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      if (finalStatus !== 'PUBLISHED') {
        console.warn(`⚠️ Publication non confirmée après ${maxAttempts} tentatives. Statut final: ${finalStatus}`);
      }
    }

    // Retour pour Direct Post uniquement
    const isPublished = finalStatus === 'PUBLISHED';
    return {
      success: true, // La demande a été envoyée avec succès
      publishId: publish_id,
      status: finalStatus,
      message: isPublished 
        ? 'Vidéo publiée avec succès sur TikTok !' 
        : `Direct Post initialisé - Statut: ${finalStatus}`,
      inboxMode: false, // Toujours false - on force Direct Post
      privacyLevel: settings.privacyLevel || 'PUBLIC_TO_EVERYONE',
      requiresManualPublish: false,
      directPostSuccess: true, // Indique que Direct Post a été utilisé
      publishType: 'DIRECT_POST' // Indication explicite du type
    };
  }
}

export const tiktokAPIService = new TikTokAPIService();