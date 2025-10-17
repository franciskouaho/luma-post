'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

// Mock data pour les analytics
const mockAnalytics = {
  overview: {
    totalViews: 125000,
    totalLikes: 8500,
    totalComments: 1200,
    totalShares: 450,
    engagementRate: 7.8,
    avgViewsPerVideo: 5200,
    bestPerformingVideo: 'Tutoriel React Native',
    worstPerformingVideo: 'Review iPhone 15'
  },
  weeklyData: [
    { day: 'Lun', views: 1200, likes: 85, comments: 12 },
    { day: 'Mar', views: 1800, likes: 120, comments: 18 },
    { day: 'Mer', views: 2200, likes: 150, comments: 25 },
    { day: 'Jeu', views: 1900, likes: 130, comments: 20 },
    { day: 'Ven', views: 2500, likes: 180, comments: 30 },
    { day: 'Sam', views: 2100, likes: 140, comments: 22 },
    { day: 'Dim', views: 1600, likes: 95, comments: 15 }
  ],
  topVideos: [
    {
      id: '1',
      title: 'Tutoriel React Native',
      views: 15000,
      likes: 1200,
      comments: 180,
      shares: 45,
      engagement: 9.5,
      publishedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Tips de développement',
      views: 12000,
      likes: 950,
      comments: 120,
      shares: 35,
      engagement: 8.2,
      publishedAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '3',
      title: 'Review iPhone 15',
      views: 8500,
      likes: 600,
      comments: 80,
      shares: 25,
      engagement: 6.8,
      publishedAt: '2024-01-10T16:45:00Z'
    }
  ],
  accountStats: [
    {
      account: '@francis_creations',
      followers: 12500,
      videos: 45,
      totalViews: 85000,
      avgEngagement: 8.2
    },
    {
      account: '@luma_poste',
      followers: 8900,
      videos: 32,
      totalViews: 40000,
      avgEngagement: 7.1
    }
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedAccount, setSelectedAccount] = useState('all');

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 8) return 'text-green-600';
    if (rate >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Analysez les performances de vos vidéos TikTok et optimisez votre stratégie.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
              <option value="1y">1 an</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les comptes</option>
              <option value="@francis_creations">@francis_creations</option>
              <option value="@luma_poste">@luma_poste</option>
            </select>
          </div>
        </div>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter les données
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalViews)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">J'aime</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalLikes)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalComments)}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partages</CardTitle>
            <Share className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockAnalytics.overview.totalShares)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs mois dernier
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance hebdomadaire</CardTitle>
            <CardDescription>
              Vues, likes et commentaires sur 7 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.weeklyData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-500">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 text-blue-500 mr-1" />
                          <span>{formatNumber(day.views)}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-red-500 mr-1" />
                          <span>{day.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span>{day.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Taux d'engagement</CardTitle>
            <CardDescription>
              Performance globale de vos vidéos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {mockAnalytics.overview.engagementRate}%
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Moyenne sur {timeRange === '7d' ? '7 jours' : '30 jours'}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vues moyennes par vidéo:</span>
                  <span className="font-medium">{formatNumber(mockAnalytics.overview.avgViewsPerVideo)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Meilleure vidéo:</span>
                  <span className="font-medium text-green-600">{mockAnalytics.overview.bestPerformingVideo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Moins performante:</span>
                  <span className="font-medium text-red-600">{mockAnalytics.overview.worstPerformingVideo}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Videos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vidéos les plus performantes</CardTitle>
          <CardDescription>
            Classement par nombre de vues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.topVideos.map((video, index) => (
              <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <p className="text-sm text-gray-500">Publié le {formatDate(video.publishedAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{formatNumber(video.views)}</div>
                    <div className="text-gray-500">Vues</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatNumber(video.likes)}</div>
                    <div className="text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{video.comments}</div>
                    <div className="text-gray-500">Commentaires</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{video.shares}</div>
                    <div className="text-gray-500">Partages</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${getEngagementColor(video.engagement)}`}>
                      {video.engagement}%
                    </div>
                    <div className="text-gray-500">Engagement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des comptes</CardTitle>
          <CardDescription>
            Performance par compte TikTok
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAnalytics.accountStats.map((account, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{account.account}</h4>
                  <Badge variant="outline">{account.followers.toLocaleString()} abonnés</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vidéos:</span>
                    <span className="font-medium">{account.videos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Vues totales:</span>
                    <span className="font-medium">{formatNumber(account.totalViews)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Engagement moyen:</span>
                    <span className={`font-medium ${getEngagementColor(account.avgEngagement)}`}>
                      {account.avgEngagement}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
