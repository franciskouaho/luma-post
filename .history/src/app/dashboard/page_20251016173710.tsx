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

  // Calculer les statistiques
  const totalVideos = videos.length;
  const scheduledCount = schedules.filter(s => s.status === 'scheduled').length;
  const publishedCount = schedules.filter(s => s.status === 'published').length;
  const failedCount = schedules.filter(s => s.status === 'failed').length;
  const successRate = publishedCount > 0 ? Math.round((publishedCount / (publishedCount + failedCount)) * 100) : 100;

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
              <CardTitle className="text-sm font-medium">Publications réussies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {schedulesLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{publishedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {schedulesError ? 'Erreur de chargement' : 'Publiées avec succès'}
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
              <Link href="/dashboard/upload">
                <Button className="w-full justify-start" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Uploader une nouvelle vidéo
                </Button>
              </Link>
              <Link href="/dashboard/schedule">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier une publication
                </Button>
              </Link>
              <Link href="/dashboard/accounts">
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Vidéo publiée</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Succès</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">En attente</p>
                      <p className="text-xs text-gray-500">Demain à 14h30</p>
                    </div>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">Planifié</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Échec de publication</p>
                      <p className="text-xs text-gray-500">Il y a 1 jour</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Erreur</span>
                </div>
              </div>
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
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune vidéo uploadée pour le moment</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Uploader votre première vidéo
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
