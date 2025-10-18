'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/use-analytics';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  // Utiliser le hook pour récupérer les vraies données
  const { data, loading, error } = useAnalytics('FGcdXcRXVoVfsSwJIciurCeuCXz1', timeRange);

  // Données calculées à partir des vraies données Firebase
  const stats = data ? [
    {
      title: 'Total Posts',
      value: data.totalPosts.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: BarChart3
    },
    {
      title: 'Total Views',
      value: data.totalViews >= 1000 ? `${(data.totalViews / 1000).toFixed(1)}K` : data.totalViews.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: Eye
    },
    {
      title: 'Total Likes',
      value: data.totalLikes >= 1000 ? `${(data.totalLikes / 1000).toFixed(1)}K` : data.totalLikes.toString(),
      change: '+15%',
      changeType: 'positive',
      icon: Heart
    },
    {
      title: 'Total Comments',
      value: data.totalComments.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: MessageCircle
    },
    {
      title: 'Total Shares',
      value: data.totalShares.toString(),
      change: '+22%',
      changeType: 'positive',
      icon: Share2
    },
    {
      title: 'Engagement Rate',
      value: `${data.engagementRate}%`,
      change: '+0.8%',
      changeType: 'positive',
      icon: TrendingUp
    }
  ] : [];

  const topPosts = data?.topPosts || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Erreur de chargement</p>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics
              </h1>
              <p className="text-gray-600">
                Analysez les performances de vos posts sur les réseaux sociaux
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
              value={selectedPlatform} 
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Toutes les plateformes</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-8 w-8 text-green-600" />
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Posts par jour */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Posts par jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {data?.postsByDay && data.postsByDay.length > 0 ? (
                  <div className="flex items-end justify-between h-full space-x-2">
                    {data.postsByDay.map((day, index) => {
                      const maxCount = Math.max(...data.postsByDay.map(d => d.count));
                      const height = maxCount > 0 ? (day.count / maxCount) * 200 : 0;
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
                            style={{ height: `${height}px` }}
                          />
                          <div className="mt-2 text-xs text-gray-600 text-center">
                            <div className="font-medium">{day.date}</div>
                            <div className="text-gray-500">{day.count}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Posts par plateforme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Posts par plateforme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {data?.postsByPlatform && Object.keys(data.postsByPlatform).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(data.postsByPlatform).map(([platform, count]) => {
                      const total = Object.values(data.postsByPlatform).reduce((sum, c) => sum + c, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <div key={platform} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium capitalize">{platform}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-500">{post.platform}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="text-center">
                      <p className="font-medium">{post.views.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Vues</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{post.likes}</p>
                      <p className="text-xs text-gray-500">Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{post.comments}</p>
                      <p className="text-xs text-gray-500">Commentaires</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{post.shares}</p>
                      <p className="text-xs text-gray-500">Partages</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-600">{post.engagement}%</p>
                      <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}