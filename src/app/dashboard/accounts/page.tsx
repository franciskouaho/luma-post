"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTikTokAccounts } from '@/hooks/use-tiktok-accounts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  RefreshCw, 
  ChevronDown, 
  X, 
  HelpCircle, 
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Settings,
  Filter,
  Grid3X3,
  List,
  Info,
  Calendar,
  TrendingUp,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface TikTokAccount {
  id: string;
  userId: string;
  platform: 'tiktok';
  tiktokUserId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date | { seconds: number };
  updatedAt: Date | { seconds: number };
}

interface Platform {
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  accounts: Array<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }>;
}

function AccountsPageContent() {
  const { user, loading: authLoading } = useAuth();
  const { accounts, loading, error, deleteAccount } = useTikTokAccounts({ userId: user?.uid || '' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const searchParams = useSearchParams();
  
  // Vérifier les paramètres de redirection
  const connected = searchParams?.get('connected');
  const connectionError = searchParams?.get('error');

  useEffect(() => {
    if (connected === 'true') {
      // Afficher un message de succès
    } else if (connectionError === 'connection_failed') {
      // Afficher un message d'erreur
    }
  }, [connected, connectionError]);

  useEffect(() => {
    // Initialiser seulement TikTok pour l'instant
    const initialPlatforms: Platform[] = [
      {
        name: 'TikTok',
        icon: '♪',
        color: 'bg-black',
        connected: accounts.length > 0,
        accounts: accounts.map(account => ({
          id: account.id,
          username: account.username,
          displayName: account.displayName,
          avatarUrl: account.avatarUrl
        }))
      }
    ];
    
    setPlatforms(initialPlatforms);
  }, [accounts]);

  const handleConnectTikTok = async () => {
    if (!user?.uid) {
      console.error('Utilisateur non authentifié');
      return;
    }

    setIsConnecting(true);
    try {
      // Récupérer l'URL d'autorisation depuis l'API
      const response = await fetch(`/api/auth/tiktok/authorize?userId=${user.uid}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'URL d\'autorisation');
      }
      
      const data = await response.json();
      
      // Rediriger vers TikTok
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Erreur lors de la connexion TikTok:', error);
      setIsConnecting(false);
    }
  };

  const handleConnectPlatform = async (platformName: string) => {
    if (platformName === 'TikTok') {
      await handleConnectTikTok();
    }
  };

  const handleDisconnectAccount = async (platformName: string, accountId: string) => {
    if (platformName === 'TikTok') {
      if (confirm('Êtes-vous sûr de vouloir déconnecter ce compte TikTok ?')) {
        await deleteAccount(accountId);
      }
    }
  };

  const handleRefreshPlatform = async (platformName: string) => {
    if (platformName === 'TikTok') {
      // Recharger les comptes TikTok
      window.location.reload();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calculer les statistiques
  const connectedPlatforms = platforms.filter(p => p.connected).length;
  const totalAccounts = platforms.reduce((sum, p) => sum + p.accounts.length, 0);
  const activePlatforms = platforms.filter(p => p.connected && p.accounts.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header moderne avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-teal-900 to-teal-600 bg-clip-text text-transparent">
                  Connexions
                </h1>
                <Info className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">Gérez vos comptes connectés sur les réseaux sociaux</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => window.location.href = '/dashboard/upload'}
                className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ background: 'var(--luma-gradient-primary)' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Publication
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-600">Plateformes Connectées</p>
                    <p className="text-2xl font-bold text-teal-900">{connectedPlatforms}</p>
                  </div>
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Comptes</p>
                    <p className="text-2xl font-bold text-blue-900">{totalAccounts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Actifs</p>
                    <p className="text-2xl font-bold text-green-900">{activePlatforms}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Sécurisé</p>
                    <p className="text-2xl font-bold text-purple-900">{connectedPlatforms}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions et filtres combinés */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-white">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                {/* Section Actions */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => handleConnectPlatform('TikTok')}
                      className="flex items-center space-x-2 border-teal-200 text-teal-600 hover:bg-teal-50"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Connecter un compte TikTok</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRefreshPlatform('TikTok')}
                      className="flex items-center space-x-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Actualiser</span>
                    </Button>
                  </div>
                </div>
                
                {/* Section Filtres */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filtres:</span>
                  </div>
                  
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm">
                    <option value="all">Toutes les plateformes</option>
                    <option value="connected">Connectées</option>
                    <option value="available">Disponibles</option>
                  </select>
                </div>
                
                {/* Section Vue */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button className="p-2 rounded-md transition-colors bg-white shadow-sm text-teal-600">
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-md transition-colors text-gray-500 hover:text-gray-700">
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages de statut modernisés */}
        {connected === 'true' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Compte TikTok connecté avec succès !
                  </h3>
                  <p className="text-green-700">
                    Votre compte TikTok a été connecté et est maintenant disponible pour la publication.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {connectionError === 'connection_failed' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Échec de la connexion TikTok
                  </h3>
                  <p className="text-red-700">
                    Une erreur s'est produite lors de la connexion de votre compte TikTok. Veuillez réessayer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grille des plateformes modernisée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {platforms.map((platform) => {
            const isDisabled = platform.name !== 'TikTok';
            return (
              <Card key={platform.name} className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${isDisabled ? 'opacity-50' : 'hover:scale-[1.02]'} bg-white`}>
                <CardContent className="p-6">
                  {/* Header avec gradient */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white font-bold text-xl shadow-lg ${isDisabled ? 'grayscale' : ''}`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                          {platform.name}
                        </h3>
                        <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                          {platform.accounts.length} compte(s)
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>

                  {/* Bouton de connexion */}
                  <div className="mb-6">
                    <Button
                      onClick={() => handleConnectPlatform(platform.name)}
                      variant={platform.connected ? "outline" : "default"}
                      size="sm"
                      disabled={isConnecting && platform.name === 'TikTok' || isDisabled}
                      className={`w-full ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${platform.connected ? 'border-teal-200 text-teal-600 hover:bg-teal-50' : 'text-white shadow-md hover:shadow-lg'}`}
                      style={!platform.connected && !isDisabled ? { background: 'var(--luma-gradient-primary)' } : {}}
                    >
                      {isConnecting && platform.name === 'TikTok' ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Connexion...
                        </>
                      ) : platform.connected ? (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Connecter un autre compte
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Connecter TikTok
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Comptes connectés */}
                  {platform.connected && platform.accounts.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Comptes connectés</span>
                        <span className="text-xs text-gray-400">{platform.accounts.length}</span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {platform.accounts.map((account) => (
                          <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group/account">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={account.avatarUrl} alt={account.displayName} />
                                <AvatarFallback className="text-sm bg-white">
                                  {account.displayName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{account.displayName}</p>
                                <p className="text-xs text-gray-500">@{account.username}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDisconnectAccount(platform.name, account.id)}
                              className="opacity-0 group-hover/account:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 transition-opacity duration-200"
                              disabled={isDisabled}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {platform.connected && platform.accounts.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Aucun compte connecté</p>
                    </div>
                  )}

                  {!platform.connected && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Globe className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Plateforme non connectée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section d'aide */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600">Connexion et gestion des comptes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start border-teal-200 text-teal-600 hover:bg-teal-50">
                <Zap className="h-4 w-4 mr-2" />
                Guide de connexion TikTok
              </Button>
              <Button variant="outline" className="justify-start border-gray-200 text-gray-600 hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres de sécurité
              </Button>
              <Button variant="outline" className="justify-start border-gray-200 text-gray-600 hover:bg-gray-50">
                <Shield className="h-4 w-4 mr-2" />
                Confidentialité des données
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountsPageContent />
    </Suspense>
  );
}
