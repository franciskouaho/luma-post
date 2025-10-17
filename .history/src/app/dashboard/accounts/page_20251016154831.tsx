'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Settings,
  Trash2
} from 'lucide-react';

// Mock data pour les comptes TikTok
const mockAccounts = [
  {
    id: '1',
    username: '@francis_creations',
    displayName: 'Francis KOUAHO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    followers: 12500,
    posts: 89
  },
  {
    id: '2',
    username: '@luma_poste',
    displayName: 'Luma Poste',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-14T15:45:00Z',
    followers: 8900,
    posts: 156
  }
];

export default function AccountsPage() {
  const [accounts] = useState(mockAccounts);

  const handleConnectTikTok = () => {
    // Simuler la redirection vers TikTok OAuth
    window.open('https://www.tiktok.com/auth/authorize/', '_blank');
  };

  const handleDisconnect = (accountId: string) => {
    console.log('Déconnexion du compte:', accountId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connecté
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Erreur
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inconnu
          </Badge>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comptes TikTok</h1>
        <p className="text-gray-600">
          Gérez vos comptes TikTok Business connectés pour la publication automatique.
        </p>
      </div>

      {/* Connect New Account */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Connecter un nouveau compte
          </CardTitle>
          <CardDescription>
            Ajoutez un compte TikTok Business pour publier automatiquement vos vidéos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">TikTok Business</h3>
                <p className="text-sm text-gray-500">
                  Connectez votre compte TikTok Business
                </p>
              </div>
            </div>
            <Button onClick={handleConnectTikTok} className="min-w-[140px]">
              <ExternalLink className="h-4 w-4 mr-2" />
              Connecter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Comptes connectés ({accounts.length})
          </h2>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun compte connecté
              </h3>
              <p className="text-gray-500 mb-4">
                Connectez votre premier compte TikTok Business pour commencer
              </p>
              <Button onClick={handleConnectTikTok}>
                <Plus className="h-4 w-4 mr-2" />
                Connecter un compte
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={account.avatar}
                        alt={account.displayName}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {account.displayName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {account.username}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(account.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Abonnés:</span>
                      <span className="font-medium">
                        {account.followers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Publications:</span>
                      <span className="font-medium">{account.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dernière sync:</span>
                      <span className="font-medium">
                        {formatDate(account.lastSync)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Besoin d'aide ?</CardTitle>
          <CardDescription>
            Comment connecter votre compte TikTok Business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Créez un compte TikTok Business</h4>
                <p className="text-sm text-gray-500">
                  Assurez-vous d'avoir un compte TikTok Business actif
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Autorisez l'accès</h4>
                <p className="text-sm text-gray-500">
                  Autorisez notre application à publier en votre nom
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Commencez à publier</h4>
                <p className="text-sm text-gray-500">
                  Uploadez vos vidéos et planifiez vos publications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
