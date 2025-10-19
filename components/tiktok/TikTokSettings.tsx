'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

export interface TikTokPostSettings {
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

interface TikTokSettingsProps {
  creatorInfo: CreatorInfo | null;
  onSettingsChange: (settings: TikTokPostSettings) => void;
  initialSettings?: Partial<TikTokPostSettings>;
}

export default function TikTokSettings({ 
  creatorInfo, 
  onSettingsChange, 
  initialSettings 
}: TikTokSettingsProps) {
  const [settings, setSettings] = useState<TikTokPostSettings>({
    privacyLevel: 'PUBLIC_TO_EVERYONE',
    allowComments: true,
    allowDuet: true,
    allowStitch: true,
    commercialContent: {
      enabled: false,
      yourBrand: false,
      brandedContent: false,
    },
    ...initialSettings
  });

  const [consentAccepted, setConsentAccepted] = useState(false);

  // Mettre à jour les paramètres quand ils changent
  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  // Vérifier les contraintes de confidentialité pour le contenu commercial
  // const canUsePrivateWithCommercial = !settings.commercialContent.enabled || 
  //   (!settings.commercialContent.brandedContent);

  const handlePrivacyChange = (value: string) => {
    const newPrivacyLevel = value as TikTokPostSettings['privacyLevel'];
    
    // Si l'utilisateur sélectionne "privé" avec du contenu de marque, désactiver le contenu de marque
    if (newPrivacyLevel === 'SELF_ONLY' && settings.commercialContent.brandedContent) {
      setSettings(prev => ({
        ...prev,
        privacyLevel: newPrivacyLevel,
        commercialContent: {
          ...prev.commercialContent,
          brandedContent: false
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        privacyLevel: newPrivacyLevel
      }));
    }
  };

  const handleCommercialToggle = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      commercialContent: {
        ...prev.commercialContent,
        enabled,
        // Réinitialiser les options si désactivé
        yourBrand: enabled ? prev.commercialContent.yourBrand : false,
        brandedContent: enabled ? prev.commercialContent.brandedContent : false
      }
    }));
  };

  const handleBrandedContentToggle = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      commercialContent: {
        ...prev.commercialContent,
        brandedContent: enabled,
        // Si contenu de marque activé, forcer la visibilité publique
        ...(enabled && prev.privacyLevel === 'SELF_ONLY' ? { 
          privacyLevel: 'PUBLIC_TO_EVERYONE' as const 
        } : {})
      }
    }));
  };

  // Générer le texte de consentement approprié
  const getConsentText = () => {
    if (!settings.commercialContent.enabled) {
      return "En publiant, vous acceptez la Confirmation d'utilisation musicale de TikTok";
    }
    
    if (settings.commercialContent.brandedContent) {
      return "En publiant, vous acceptez la Politique de Contenu de Marque de TikTok et la Confirmation d'utilisation musicale";
    }
    
    return "En publiant, vous acceptez la Confirmation d'utilisation musicale de TikTok";
  };

  // Vérifier si la publication est possible
  const canPublish = consentAccepted && 
    (!settings.commercialContent.enabled || 
     settings.commercialContent.yourBrand || 
     settings.commercialContent.brandedContent);

  if (!creatorInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-gray-500">
            <Info className="h-4 w-4" />
            <span>Chargement des informations du créateur...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creatorInfo.can_post || creatorInfo.max_posts_reached) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Ce créateur ne peut pas publier de contenu pour le moment. 
              {creatorInfo.max_posts_reached && " Limite de publication quotidienne atteinte."}
              Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informations du créateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Publication sur TikTok</span>
          </CardTitle>
          <CardDescription>
            Contenu sera publié sur le compte : <strong>@{creatorInfo.nickname}</strong>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Paramètres de confidentialité */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de confidentialité</CardTitle>
          <CardDescription>
            Choisissez qui peut voir votre contenu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privacy-level">Visibilité</Label>
            <Select 
              value={settings.privacyLevel} 
              onValueChange={handlePrivacyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la visibilité" />
              </SelectTrigger>
              <SelectContent>
                {creatorInfo.privacy_level_options.map((option) => {
                  const isDisabled = option === 'SELF_ONLY' && settings.commercialContent.brandedContent;
                  return (
                    <SelectItem 
                      key={option} 
                      value={option}
                      disabled={isDisabled}
                    >
                      {option === 'PUBLIC_TO_EVERYONE' && 'Public (Tout le monde)'}
                      {option === 'MUTUAL_FOLLOW_FRIENDS' && 'Amis mutuels'}
                      {option === 'SELF_ONLY' && 'Privé (Moi seulement)'}
                      {isDisabled && ' - Non disponible pour le contenu de marque'}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {settings.commercialContent.brandedContent && settings.privacyLevel === 'SELF_ONLY' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Le contenu de marque ne peut pas être privé. La visibilité sera automatiquement changée en public.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres d'interaction */}
      <Card>
        <CardHeader>
          <CardTitle>Interactions autorisées</CardTitle>
          <CardDescription>
            Contrôlez comment les utilisateurs peuvent interagir avec votre contenu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-comments">Autoriser les commentaires</Label>
              <p className="text-sm text-gray-500">
                Les utilisateurs peuvent commenter votre vidéo
              </p>
            </div>
            <Switch
              id="allow-comments"
              checked={settings.allowComments && !creatorInfo.comment_disabled}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                allowComments: checked 
              }))}
              disabled={creatorInfo.comment_disabled}
            />
          </div>
          {creatorInfo.comment_disabled && (
            <p className="text-sm text-gray-500">
              Les commentaires sont désactivés dans vos paramètres TikTok
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-duet">Autoriser les Duets</Label>
              <p className="text-sm text-gray-500">
                Les utilisateurs peuvent créer des duets avec votre vidéo
              </p>
            </div>
            <Switch
              id="allow-duet"
              checked={settings.allowDuet && !creatorInfo.duet_disabled}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                allowDuet: checked 
              }))}
              disabled={creatorInfo.duet_disabled}
            />
          </div>
          {creatorInfo.duet_disabled && (
            <p className="text-sm text-gray-500">
              Les duets sont désactivés dans vos paramètres TikTok
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-stitch">Autoriser les Stitch</Label>
              <p className="text-sm text-gray-500">
                Les utilisateurs peuvent créer des stitches avec votre vidéo
              </p>
            </div>
            <Switch
              id="allow-stitch"
              checked={settings.allowStitch && !creatorInfo.stitch_disabled}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                allowStitch: checked 
              }))}
              disabled={creatorInfo.stitch_disabled}
            />
          </div>
          {creatorInfo.stitch_disabled && (
            <p className="text-sm text-gray-500">
              Les stitches sont désactivés dans vos paramètres TikTok
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contenu commercial */}
      <Card>
        <CardHeader>
          <CardTitle>Contenu commercial</CardTitle>
          <CardDescription>
            Indiquez si ce contenu promeut une marque ou un service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="commercial-content">Ce contenu est commercial</Label>
              <p className="text-sm text-gray-500">
                Activez si vous promouvez une marque ou un service
              </p>
            </div>
            <Switch
              id="commercial-content"
              checked={settings.commercialContent.enabled}
              onCheckedChange={handleCommercialToggle}
            />
          </div>

          {settings.commercialContent.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
              <div className="space-y-2">
                <Label>Type de contenu commercial</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="your-brand"
                      checked={settings.commercialContent.yourBrand}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        commercialContent: {
                          ...prev.commercialContent,
                          yourBrand: !!checked
                        }
                      }))}
                    />
                    <Label htmlFor="your-brand" className="text-sm">
                      Votre marque - Vous promouvez vous-même ou votre propre entreprise
                    </Label>
                  </div>
                  {settings.commercialContent.yourBrand && (
                    <p className="text-sm text-blue-600 ml-6">
                      Votre photo/vidéo sera étiquetée comme &quot;Contenu promotionnel&quot;
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="branded-content"
                      checked={settings.commercialContent.brandedContent}
                      onCheckedChange={(checked) => handleBrandedContentToggle(!!checked)}
                    />
                    <Label htmlFor="branded-content" className="text-sm">
                      Contenu de marque - Vous promouvez une autre marque ou un tiers
                    </Label>
                  </div>
                  {settings.commercialContent.brandedContent && (
                    <p className="text-sm text-blue-600 ml-6">
                      Votre photo/vidéo sera étiquetée comme &quot;Partenariat payant&quot;
                    </p>
                  )}
                </div>
              </div>

              {settings.commercialContent.brandedContent && settings.privacyLevel === 'SELF_ONLY' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Le contenu de marque ne peut pas être privé. La visibilité sera automatiquement changée en public.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Déclaration de consentement */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation de publication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Déclaration de consentement :
            </p>
            <p className="text-sm text-gray-600">
              {getConsentText()}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consentAccepted}
              onCheckedChange={(checked) => setConsentAccepted(!!checked)}
            />
            <Label htmlFor="consent" className="text-sm">
              Je confirme avoir lu et accepté les conditions ci-dessus
            </Label>
          </div>

          {!canPublish && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {!consentAccepted && "Vous devez accepter la déclaration de consentement pour publier."}
                {settings.commercialContent.enabled && !settings.commercialContent.yourBrand && !settings.commercialContent.brandedContent && 
                  "Vous devez sélectionner au moins une option de contenu commercial."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
