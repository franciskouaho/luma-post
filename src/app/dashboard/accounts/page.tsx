"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTikTokAccounts } from '@/hooks/use-tiktok-accounts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RefreshCw, ChevronDown, X, HelpCircle } from 'lucide-react';
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
    // Initialiser toutes les plateformes avec TikTok actif et les autres grisées
    const initialPlatforms: Platform[] = [
      {
        name: 'Bluesky',
        icon: '🦋',
        color: 'bg-blue-500',
        connected: true,
        accounts: [
          { id: 'bs1', username: 'jack friks', displayName: 'jack friks', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
      {
        name: 'Facebook',
        icon: 'f',
        color: 'bg-blue-600',
        connected: true,
        accounts: [
          { id: 'fb1', username: 'jack friks', displayName: 'jack friks', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'fb2', username: 'Curiosity Quench', displayName: 'Curiosity Quench', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'fb3', username: 'Scroll less', displayName: 'Scroll less', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
      {
        name: 'Instagram',
        icon: '📷',
        color: 'bg-pink-500',
        connected: true,
        accounts: [
          { id: 'ig1', username: 'jackfriks', displayName: 'jackfriks', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'ig2', username: 'curiosity.quench', displayName: 'curiosity.quench', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'ig3', username: 'scroll_less_live_more', displayName: 'scroll_less_live_more', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
      {
        name: 'LinkedIn',
        icon: 'in',
        color: 'bg-blue-700',
        connected: true,
        accounts: [
          { id: 'li1', username: 'post bridge', displayName: 'post bridge', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
      {
        name: 'Pinterest',
        icon: 'P',
        color: 'bg-red-500',
        connected: true,
        accounts: [
          { id: 'pin1', username: 'jackfriks', displayName: 'jackfriks', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'pin2', username: 'postbridge', displayName: 'postbridge', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
      {
        name: 'Threads',
        icon: '@',
        color: 'bg-gray-800',
        connected: true,
        accounts: [
          { id: 'th1', username: 'curiosity.quench', displayName: 'curiosity.quench', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'th2', username: 'jackfriks', displayName: 'jackfriks', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
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
      },
      {
        name: 'Twitter',
        icon: '🐦',
        color: 'bg-blue-400',
        connected: true,
        accounts: [
          { id: 'tw1', username: 'doofapp', displayName: 'doofapp', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'tw2', username: 'jackfriks', displayName: 'jackfriks', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'tw3', username: 'curiousquench', displayName: 'curiousquench', avatarUrl: 'https://github.com/shadcn.png' }
        ]
      },
      {
        name: 'YouTube',
        icon: '▶',
        color: 'bg-red-600',
        connected: true,
        accounts: [
          { id: 'yt1', username: 'jack friks', displayName: 'jack friks', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'yt2', username: 'jack friks shorts', displayName: 'jack friks shorts', avatarUrl: 'https://github.com/shadcn.png' },
          { id: 'yt3', username: 'postbridge_', displayName: 'postbridge_', avatarUrl: 'https://github.com/shadcn.png' }
        ]
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
    } else {
      // Pour les autres plateformes, afficher un message temporaire
      alert(`Connexion ${platformName} - Fonctionnalité à venir !`);
    }
  };

  const handleDisconnectAccount = async (platformName: string, accountId: string) => {
    if (platformName === 'TikTok') {
      if (confirm('Êtes-vous sûr de vouloir déconnecter ce compte TikTok ?')) {
        await deleteAccount(accountId);
      }
    } else {
      // Pour les autres plateformes, afficher un message temporaire
      alert(`Déconnexion ${platformName} - Fonctionnalité à venir !`);
    }
  };

  const handleRefreshPlatform = async (platformName: string) => {
    if (platformName === 'TikTok') {
      // Recharger les comptes TikTok
      window.location.reload();
    } else {
      alert(`Actualisation ${platformName} - Fonctionnalité à venir !`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ 
          background: 'var(--luma-gradient-primary)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Connected Accounts</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">all accounts</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Messages de statut */}
      {connected === 'true' && (
        <div className='rounded-md p-4 mb-6' style={{ background: 'var(--luma-purple-light)', border: '1px solid var(--luma-purple)' }}>
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--luma-purple-dark)' }}>
                Compte TikTok connecté avec succès !
              </h3>
              <div className="mt-2 text-sm" style={{ color: 'var(--luma-purple-dark)' }}>
                <p>Votre compte TikTok a été connecté et est maintenant disponible pour la publication.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {connectionError === 'connection_failed' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Échec de la connexion TikTok
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Une erreur s&apos;est produite lors de la connexion de votre compte TikTok. Veuillez réessayer.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {platforms.map((platform) => {
          const isDisabled = platform.name !== 'TikTok';
          return (
            <Card key={platform.name} className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${isDisabled ? 'opacity-50' : 'hover:scale-105'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white font-bold text-lg ${isDisabled ? 'grayscale' : ''}`}>
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                        {platform.name}
                      </h3>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConnectPlatform(platform.name)}
                    variant={platform.connected ? "outline" : "default"}
                    size="sm"
                    disabled={isConnecting && platform.name === 'TikTok' || isDisabled}
                    className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isConnecting && platform.name === 'TikTok' ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      `Connect ${platform.name}`
                    )}
                  </Button>
                </div>

                {/* Connected Accounts */}
                {platform.connected && platform.accounts.length > 0 && (
                  <div className="space-y-2">
                    {platform.accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={account.avatarUrl} alt={account.displayName} />
                            <AvatarFallback className="text-xs">
                              {account.displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">{account.displayName}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnectAccount(platform.name, account.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                          disabled={isDisabled}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {platform.connected && platform.accounts.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    No accounts connected
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Refresh Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant="outline"
          onClick={() => handleRefreshPlatform('Instagram')}
          className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
          disabled
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Instagram</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleRefreshPlatform('Twitter')}
          className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
          disabled
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Twitter</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleRefreshPlatform('TikTok')}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh TikTok</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleRefreshPlatform('Facebook')}
          className="flex items-center space-x-2 opacity-50 cursor-not-allowed"
          disabled
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Facebook</span>
        </Button>
      </div>

      {/* Help Section */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <HelpCircle className="h-4 w-4" />
        <span>Get help connecting your accounts</span>
      </div>
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
