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

class TikTokAPIService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.TIKTOK_CLIENT_ID || '';
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI || '';
  }

  // Fonction de déchiffrement (à implémenter avec votre logique de chiffrement)
  private decryptToken(encryptedToken: string): string {
    // Ici vous devriez implémenter votre logique de déchiffrement AES-256-GCM
    // Pour l'instant, on retourne le token tel quel (pas de chiffrement en place)
    return encryptedToken;
  }

  // Fonction pour vérifier si une URL peut être utilisée avec PULL_FROM_URL
  private canUsePullFromUrl(_videoUrl: string, _isBusinessAccount: boolean): boolean {
    // Google Cloud Storage n'est pas vérifié par TikTok, donc on utilise toujours FILE_UPLOAD
    // pour éviter l'erreur url_ownership_unverified
    console.log('⚠️ Utilisation de FILE_UPLOAD pour éviter l\'erreur url_ownership_unverified');
    return false; // Toujours utiliser FILE_UPLOAD
  }

  // Fonction pour refresh un token expiré
  async refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
    const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
    
    const params = `client_key=${this.clientId}&client_secret=${this.clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`;

    console.log('Rafraîchissement du token...');

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
    console.log('Token rafraîchi:', !!data.access_token);

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

  async publishVideoComplete(account: TikTokAccount, videoData: {
    videoUrl: string;
    title?: string;
    description?: string;
    hashtags?: string[];
  }, accountService?: { update: (id: string, updates: Record<string, unknown>) => Promise<void> }) {
    try {
      console.log('Publication de vidéo TikTok...');
      console.log('Account:', account.username);
      console.log('Video URL:', videoData.videoUrl);

      // Déchiffrer le token d'accès
      let accessToken = this.decryptToken(account.accessTokenEnc);

      // ÉTAPE 0: Query Creator Info (requis par la nouvelle API)
      console.log('Étape 0: Récupération des infos créateur...');
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
          console.log('Token invalide, tentative de rafraîchissement...');
          
          try {
            const refreshToken = this.decryptToken(account.refreshTokenEnc);
            const newTokens = await this.refreshAccessToken(refreshToken);
            
            // Mettre à jour le token dans la base de données
            await accountService.update(account.id, {
              accessTokenEnc: newTokens.access_token, // Chiffrer si nécessaire
              refreshTokenEnc: newTokens.refresh_token, // Chiffrer si nécessaire
              expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
            });
            
            accessToken = newTokens.access_token;
            console.log('Token rafraîchi avec succès');
            
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
            console.log('Infos créateur (après refresh):', creatorResult);
            
            if (creatorResult.error && creatorResult.error.code !== 'ok') {
              throw new Error(`Erreur TikTok Creator Info: ${creatorResult.error.message || creatorResult.error}`);
            }
            
            const { privacy_level_options } = creatorResult.data;
            console.log('Options de confidentialité disponibles:', privacy_level_options);
            
            // Continuer avec la publication...
            return this.continuePublishing(account, accessToken, privacy_level_options, videoData);
            
          } catch (refreshError) {
            console.error('Échec du rafraîchissement du token:', refreshError);
            throw new Error(`Token expiré et impossible de le rafraîchir: ${refreshError instanceof Error ? refreshError.message : 'Erreur inconnue'}`);
          }
        }
        
        console.error('Erreur lors de la récupération des infos créateur:', errorText);
        throw new Error(`Erreur HTTP ${creatorResponse.status}: ${errorText}`);
      }

      const creatorResult = await creatorResponse.json();
      console.log('Infos créateur:', creatorResult);

      if (creatorResult.error && creatorResult.error.code !== 'ok') {
        throw new Error(`Erreur TikTok Creator Info: ${creatorResult.error.message || creatorResult.error}`);
      }

      const { privacy_level_options } = creatorResult.data;
      console.log('Options de confidentialité disponibles:', privacy_level_options);

      // Continuer avec la publication
      return this.continuePublishing(account, accessToken, privacy_level_options, videoData);

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
  }) {
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

    // Détecter le type de compte basé sur le nom d'utilisateur
    const isBusinessAccount = account.username.toLowerCase().includes('app') || 
                             account.username.toLowerCase().includes('business') ||
                             account.username.toLowerCase().includes('awa');

    // ÉTAPE 1: Préparation de la vidéo avec FILE_UPLOAD
    console.log('Étape 1: Préparation de la vidéo...');
    
    // Toujours utiliser FILE_UPLOAD pour éviter l'erreur url_ownership_unverified
    const videoResponse = await fetch(videoData.videoUrl);
    if (!videoResponse.ok) {
      throw new Error('Impossible de récupérer la vidéo');
    }
    
    const videoBuffer = await videoResponse.arrayBuffer();
    const videoSize = videoBuffer.byteLength;
    
    // Pour l'instant, utilisons un seul chunk pour éviter les problèmes de chunking
    // TikTok devrait accepter les fichiers de 57MB en un seul chunk
    const chunkSize = videoSize; // Un seul chunk de la taille totale
    const totalChunkCount = 1;

    console.log('Taille vidéo:', videoSize, 'bytes');
    console.log('Chunk size choisi:', chunkSize, 'bytes');
    console.log('Nombre de chunks calculé:', totalChunkCount);
    console.log('Dernier chunk sera de taille:', videoSize - (totalChunkCount - 1) * chunkSize, 'bytes');
    
    const sourceInfo = {
      source: 'FILE_UPLOAD',
      video_size: videoSize,
      chunk_size: chunkSize,
      total_chunk_count: totalChunkCount,
    };

    // ÉTAPE 2: Initialisation avec fallback intelligent
    console.log('Étape 2: Initialisation de la publication...');
    
    console.log(`Type de compte détecté: ${isBusinessAccount ? 'Entreprise' : 'Personnel'}`);
    
    let initResult;
    let useInboxEndpoint = false;
    let needsReconnection = false;
    
    // Essayer d'abord l'endpoint Direct Post avec gestion intelligente des erreurs
    try {
      console.log('Tentative avec l\'endpoint Direct Post...');
      const directPostUrl = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
      
      // Utiliser les options de confidentialité disponibles du créateur
      const privacyLevel = privacyLevelOptions.includes('PUBLIC_TO_EVERYONE') 
        ? 'PUBLIC_TO_EVERYONE' 
        : privacyLevelOptions.includes('MUTUAL_FOLLOW_FRIENDS')
        ? 'MUTUAL_FOLLOW_FRIENDS'
        : privacyLevelOptions[0] || 'SELF_ONLY';
      
      const directPostData = {
        post_info: {
          title: description,
          privacy_level: privacyLevel,
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          brand_content_toggle: false,
          brand_organic_toggle: false,
          video_cover_timestamp_ms: 1000, // Utiliser la première seconde comme couverture
        },
        source_info: sourceInfo
      };

      console.log('Données Direct Post:', JSON.stringify(directPostData, null, 2));
      console.log(`Niveau de confidentialité choisi: ${privacyLevel}`);

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
        
        console.log('Réponse Direct Post:', errorData);
        
        // Gestion intelligente des erreurs
        switch (errorData.error?.code) {
          case 'unaudited_client_can_only_post_to_private_accounts':
            console.log('⚠️ Application non audité - tentative avec SELF_ONLY...');
            
            // Retry avec SELF_ONLY si ce n'était pas déjà le cas
            if (privacyLevel !== 'SELF_ONLY') {
              const retryData = {
                ...directPostData,
                post_info: {
                  ...directPostData.post_info,
                  privacy_level: 'SELF_ONLY'
                }
              };
              
              console.log('Retry avec SELF_ONLY:', JSON.stringify(retryData, null, 2));
              
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
                console.log('✅ Succès avec Direct Post (SELF_ONLY):', initResult);
                break;
              }
            }
            
            console.log('⚠️ Même avec SELF_ONLY, basculement vers inbox');
            useInboxEndpoint = true;
            break;
            
          case 'privacy_level_option_mismatch':
            console.log('⚠️ Niveau de confidentialité invalide, tentative avec SELF_ONLY...');
            
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
              console.log('✅ Succès avec Direct Post (fallback SELF_ONLY):', initResult);
            } else {
              console.log('⚠️ Fallback échoué, basculement vers inbox');
              useInboxEndpoint = true;
            }
            break;
            
          case 'spam_risk_too_many_posts':
            throw new Error('Limite quotidienne de posts atteinte pour cet utilisateur');
            
          case 'spam_risk_user_banned_from_posting':
            throw new Error('L\'utilisateur est banni de TikTok');
            
          case 'reached_active_user_cap':
            throw new Error('Quota quotidien d\'utilisateurs actifs atteint');
            
          case 'rate_limit_exceeded':
            console.log('⚠️ Limite de taux dépassée, attente de 10 secondes...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            throw new Error('Limite de taux dépassée - veuillez réessayer dans quelques minutes');
            
          default:
            console.error('Erreur Direct Post:', errorText);
            throw new Error(`Erreur HTTP ${directPostResponse.status}: ${errorText}`);
        }
      } else {
        initResult = await directPostResponse.json();
        console.log('✅ Succès avec Direct Post:', initResult);
      }
    } catch (error) {
      console.log('Erreur Direct Post, basculement vers inbox:', error);
      useInboxEndpoint = true;
    }
    
    // Si Direct Post a échoué, essayer l'endpoint inbox
    if (useInboxEndpoint) {
      console.log('Tentative avec l\'endpoint inbox...');
      const inboxUrl = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/';
      
      const inboxData = {
        source_info: sourceInfo
      };

      console.log('Données inbox:', JSON.stringify(inboxData, null, 2));

      const inboxResponse = await fetch(inboxUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(inboxData),
      });

      if (!inboxResponse.ok) {
        const errorText = await inboxResponse.text();
        const errorData = JSON.parse(errorText);
        
        // Si erreur scope_not_authorized, signaler qu'il faut reconnecter
        if (errorData.error?.code === 'scope_not_authorized') {
          console.log('⚠️ Scope manquant - reconnexion nécessaire');
          needsReconnection = true;
          throw new Error('SCOPE_NOT_AUTHORIZED: Veuillez reconnecter votre compte TikTok pour autoriser les permissions nécessaires.');
        } else {
          console.error('Erreur inbox:', errorText);
          throw new Error(`Erreur HTTP ${inboxResponse.status}: ${errorText}`);
        }
      }

      initResult = await inboxResponse.json();
      console.log('✅ Succès avec inbox:', initResult);
    }

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

    // ÉTAPE 3: Upload du fichier vers TikTok (si upload_url fourni)
    console.log('Étape 3: Upload du fichier vers TikTok via FILE_UPLOAD');
    console.log('Publish ID:', publish_id);
    console.log('Upload URL:', upload_url);

    if (upload_url) {
      console.log('Upload du fichier vers TikTok...');
      
      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/quicktime', // Format MOV
          'Content-Length': videoSize.toString(),
          'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
        },
        body: videoBuffer,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Erreur lors de l\'upload:', errorText);
        throw new Error(`Erreur upload ${uploadResponse.status}: ${errorText}`);
      }

      console.log('✅ Fichier uploadé avec succès');
    }

    // ÉTAPE 4: Vérifier le statut seulement pour Direct Post
    let finalStatus = 'UNKNOWN';
    if (!useInboxEndpoint) {
      console.log('Étape 4: Vérification du statut...');
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
        console.log(`Tentative ${attempts + 1}: Statut de publication:`, statusResult);

        if (statusResult.error && statusResult.error.code !== 'ok') {
          console.error('Erreur dans la réponse de statut:', statusResult.error);
          break;
        }

        const status = statusResult.data?.status;
        finalStatus = status;

        if (status === 'PROCESSING_DOWNLOAD') {
          console.log('Vidéo en cours de téléchargement...');
        } else if (status === 'PROCESSING_UPLOAD') {
          console.log('Vidéo en cours de traitement...');
        } else if (status === 'PROCESSING_POST') {
          console.log('Vidéo en cours de publication...');
        } else if (status === 'PUBLISHED') {
          console.log('✅ Vidéo publiée avec succès!');
          break;
        } else if (status === 'FAILED') {
          console.error('❌ Échec de la publication:', statusResult.data?.fail_reason);
          throw new Error(`Échec de la publication: ${statusResult.data?.fail_reason || 'Raison inconnue'}`);
        }

        attempts++;
        if (attempts < maxAttempts) {
          const waitTime = 10000; // 10s d'attente standard pour FILE_UPLOAD
          console.log(`Attente de ${waitTime/1000} secondes avant la prochaine vérification...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      if (finalStatus !== 'PUBLISHED') {
        console.warn(`⚠️ Publication non confirmée après ${maxAttempts} tentatives. Statut final: ${finalStatus}`);
      }
    }

    // Retour adapté selon l'endpoint utilisé
    if (useInboxEndpoint) {
      // Pour inbox, retour immédiat après upload
      return {
        success: true,
        publishId: publish_id,
        status: 'UPLOADED',
        message: 'Vidéo uploadée avec succès dans la boîte de réception TikTok. L\'utilisateur doit finaliser la publication dans l\'application TikTok.',
        inboxMode: true,
        privacyLevel: 'SELF_ONLY', // Forcé pour les applications non auditées
        requiresManualPublish: true
      };
    } else {
      // Pour Direct Post, vérifier le statut final
      const isPublished = finalStatus === 'PUBLISHED';
      return {
        success: isPublished,
        publishId: publish_id,
        status: finalStatus,
        message: isPublished 
          ? 'Vidéo publiée avec succès sur TikTok !' 
          : `Publication en cours - Statut: ${finalStatus}`,
        inboxMode: false,
        privacyLevel: 'PUBLIC_TO_EVERYONE', // Direct Post réussi
        requiresManualPublish: false,
        directPostSuccess: true
      };
    }
  }
}

export const tiktokAPIService = new TikTokAPIService();