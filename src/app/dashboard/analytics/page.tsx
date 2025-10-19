'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  FileText,
  X,
  Download,
  Filter,
  Loader2,
  Send,
  FileEdit
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAnalytics } from '@/hooks/use-analytics';
import { useVideos } from '@/hooks/use-videos';
import { useTikTokAccounts } from '@/hooks/use-tiktok-accounts';
import { useWorkspaceStats } from '@/hooks/use-workspace-stats';
import { useWorkspaceContext } from '@/contexts/workspace-context';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const { selectedWorkspace } = useWorkspaceContext();
  
  // Hooks pour récupérer les données
  const { data, loading, error } = useAnalytics('FGcdXcRXVoVfsSwJIciurCeuCXz1', timeRange);
  const { videos, loading: videosLoading } = useVideos(selectedWorkspace?.id || '');
  const { accounts, loading: accountsLoading } = useTikTokAccounts({ userId: selectedWorkspace?.id || null });
  const { stats: workspaceStats } = useWorkspaceStats(selectedWorkspace?.id || null);

  // Statistiques de statut des posts
  const postStatusStats = [
    {
      title: 'Publiés',
      value: '0',
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Programmés',
      value: '0',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Brouillons',
      value: '0',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    {
      title: 'En file',
      value: '0',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Échecs',
      value: '0',
      icon: X,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    }
  ];

  // Métriques d'engagement
  const engagementStats = [
    {
      title: 'Total Posts',
      value: '0',
      change: '+0%',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Views',
      value: '0',
      change: '+0%',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Likes',
      value: '0',
      change: '+0%',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Comments',
      value: '0',
      change: '+0%',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Shares',
      value: '0',
      change: '+0%',
      icon: Share,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Engagement Rate',
      value: '0%',
      change: '+0%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (analyticsLoading || videosLoading || accountsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">Chargement des analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-purple-600">
                Analytics
              </h1>
              <p className="text-gray-600 text-lg">
                Analysez les performances de vos posts sur les réseaux sociaux
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Filtres */}
              <div className="flex items-center space-x-2">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">90 derniers jours</option>
                </select>
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Toutes les plateformes</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques de statut des posts */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {postStatusStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Métriques d'engagement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {engagementStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique d'engagement par jour */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Engagement par jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Graphique d'engagement à venir</p>
                  <p className="text-gray-400 text-sm mt-2">Les données d'engagement seront affichées ici</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphique de performance par plateforme */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Performance par plateforme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Graphique de performance à venir</p>
                  <p className="text-gray-400 text-sm mt-2">Les données de performance seront affichées ici</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section des posts récents avec analytics */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Posts Récents - Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {videos && videos.length > 0 ? (
                <div className="space-y-4">
                  {videos.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.title || 'Post sans titre'}</h4>
                          <p className="text-sm text-gray-600">Post vidéo</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="h-4 w-4" />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun post à analyser</h4>
                  <p className="text-gray-600">Créez des posts pour voir leurs performances ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}