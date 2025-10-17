'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Calendar, 
  Users, 
  BarChart3, 
  Plus,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useVideos } from '@/hooks/use-videos';
import { useSchedules } from '@/hooks/use-schedules';
import { useTikTokAccounts } from '@/hooks/use-tiktok-accounts';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { videos, loading: videosLoading, error: videosError } = useVideos({ 
    userId: user?.uid || null,
    limit: 5
  });
  const { schedules, loading: schedulesLoading, error: schedulesError } = useSchedules({ 
    userId: user?.uid || null,
    limit: 10
  });
  const { accounts, loading: accountsLoading, error: accountsError } = useTikTokAccounts({ 
    userId: user?.uid || null
  });

  // Calculer les statistiques
  const totalVideos = videos.length;
  const scheduledCount = schedules.filter(s => s.status === 'scheduled').length;
  const publishedCount = schedules.filter(s => s.status === 'published').length;
  const failedCount = schedules.filter(s => s.status === 'failed').length;
  const successRate = publishedCount > 0 ? Math.round((publishedCount / (publishedCount + failedCount)) * 100) : 100;
  const connectedAccounts = accounts.length;

  // Publications récentes (dernières 5)
  const recentSchedules = schedules.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-50 text-green-600';
      case 'scheduled':
        return 'bg-blue-50 text-blue-600';
      case 'failed':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'scheduled':
        return 'Planifié';
      case 'failed':
        return 'Échec';
      default:
        return 'En attente';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };

  return (
    <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur votre tableau de bord !
          </h2>
          <p className="text-gray-600">
            Gérez vos vidéos TikTok et planifiez vos publications automatiquement.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vidéos totales</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {videosLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{totalVideos}</div>
                  <p className="text-xs text-muted-foreground">
                    {videosError ? 'Erreur de chargement' : 'Vidéos uploadées'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publications planifiées</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {schedulesLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{scheduledCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {schedulesError ? 'Erreur de chargement' : 'En attente de publication'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comptes connectés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{connectedAccounts}</div>
                  <p className="text-xs text-muted-foreground">
                    {accountsError ? 'Erreur de chargement' : 'Comptes TikTok Business'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de succès</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {schedulesLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{successRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {schedulesError ? 'Erreur de chargement' : `${failedCount} échec${failedCount > 1 ? 's' : ''}`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Actions rapides
              </CardTitle>
              <CardDescription>
                Gérez vos vidéos et planifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/upload" className="block">
                <Button className="w-full justify-start" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Uploader une nouvelle vidéo
                </Button>
              </Link>
              <Link href="/dashboard/schedule" className="block">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier une publication
                </Button>
              </Link>
              <Link href="/dashboard/accounts" className="block">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Users className="h-4 w-4 mr-2" />
                  Connecter un compte TikTok
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Publications récentes
              </CardTitle>
              <CardDescription>
                Dernières activités de publication
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedulesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm text-gray-500">Chargement des publications...</span>
                </div>
              ) : schedulesError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Erreur de chargement des publications</p>
                </div>
              ) : recentSchedules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Aucune publication récente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSchedules.map((schedule, index) => (
                    <div key={schedule.id || index} className={`flex items-center justify-between p-3 rounded-lg ${getStatusColor(schedule.status)}`}>
                      <div className="flex items-center">
                        {getStatusIcon(schedule.status)}
                        <div className="ml-3">
                          <p className="font-medium text-sm">{schedule.title || 'Publication'}</p>
                          <p className="text-xs text-gray-500">{formatDate(schedule.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {getStatusText(schedule.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Vidéos récentes
              </span>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </CardTitle>
            <CardDescription>
              Vos dernières vidéos uploadées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videosLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Chargement des vidéos...</span>
              </div>
            ) : videosError ? (
              <div className="text-center py-8 text-red-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Erreur de chargement des vidéos</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune vidéo uploadée pour le moment</p>
                <Link href="/dashboard/upload" className="block">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Uploader votre première vidéo
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div key={video.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-gray-500">
                          {video.duration ? `${Math.round(video.duration)}s` : 'Durée inconnue'} • 
                          {video.size ? `${Math.round(video.size / 1024 / 1024)}MB` : 'Taille inconnue'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        video.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                        video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        video.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {video.status === 'uploaded' ? 'Uploadé' :
                         video.status === 'processing' ? 'En cours' :
                         video.status === 'failed' ? 'Échec' :
                         'Inconnu'}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/dashboard/upload">
                    <Button variant="outline" size="sm">
                      Voir toutes les vidéos
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
