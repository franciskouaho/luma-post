'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info,
  CheckCircle,
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  Clock,
  Send,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  Filter,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Share2
} from 'lucide-react';
import { PlatformIcon } from '@/components/ui/platform-icon';
import Image from 'next/image';

export default function AllPostsPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les schedules
        const schedulesResponse = await fetch('/api/schedules?userId=FGcdXcRXVoVfsSwJIciurCeuCXz1');
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          
          // Convertir les dates Firestore
          const schedulesWithDates = (schedulesData.schedules || []).map((schedule: any) => {
            let scheduledAt;
            if (schedule.scheduledAt?._seconds) {
              scheduledAt = new Date(schedule.scheduledAt._seconds * 1000);
            } else if (schedule.scheduledAt?.toDate) {
              scheduledAt = schedule.scheduledAt.toDate();
            } else {
              scheduledAt = new Date(schedule.scheduledAt);
            }
            
            return {
              ...schedule,
              scheduledAt
            };
          });
          
          setSchedules(schedulesWithDates);
        }

        // Récupérer les comptes
        const accountsResponse = await fetch('/api/accounts');
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          setAccounts(accountsData.accounts || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer et trier les schedules
  const filteredSchedules = schedules
    .filter(schedule => {
      const matchesPlatform = filterPlatform === 'all' || 
        schedule.platforms.some((platformId: string) => {
          const account = accounts.find(acc => acc.id === platformId);
          return account?.platform === filterPlatform;
        });
      const matchesAccount = filterAccount === 'all' || schedule.userId === filterAccount;
      return matchesPlatform && matchesAccount;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime();
      } else {
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      }
    });

  const getContentTypeIcon = (mediaType: string) => {
    switch (mediaType?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" style={{ color: 'var(--luma-purple)' }} />;
      case 'text':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <Video className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'published':
        return <Send className="h-4 w-4" style={{ color: 'var(--luma-purple)' }} />;
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">scheduled</Badge>;
      case 'published':
        return <Badge variant="secondary" className="text-xs" style={{ background: 'var(--luma-purple-light)', color: 'var(--luma-purple-dark)' }}>posted</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">draft</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">scheduled</Badge>;
    }
  };


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--luma-purple)' }}></div>
              <p className="text-gray-500">Chargement des posts publiés...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header moderne avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-purple-600 bg-clip-text text-transparent">
                  Tous les Posts
                </h1>
                <Info className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">Gérez et visualisez tous vos contenus publiés</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => window.location.href = '/dashboard/upload'}
                className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ background: 'var(--luma-gradient-primary)' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Post
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Posts</p>
                    <p className="text-2xl font-bold text-blue-900">{filteredSchedules.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Publiés</p>
                    <p className="text-2xl font-bold text-green-900">{filteredSchedules.filter(s => s.status === 'published').length}</p>
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
                    <p className="text-sm font-medium text-purple-600">Planifiés</p>
                    <p className="text-2xl font-bold text-purple-900">{filteredSchedules.filter(s => s.status === 'scheduled').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Brouillons</p>
                    <p className="text-2xl font-bold text-orange-900">{filteredSchedules.filter(s => s.status === 'draft').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et contrôles modernisés */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filtres:</span>
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                  </select>
                  
                  <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
                  >
                    <option value="all">Toutes les plateformes</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                  </select>
                  
                  <select
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
                  >
                    <option value="all">Toute la période</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-sm text-purple-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-sm text-purple-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grille des posts modernisée */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white">
              <CardContent className="p-0">
                {/* Header avec gradient et date */}
                <div className="relative p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getContentTypeIcon(schedule.mediaType)}
                      <span className="text-sm font-medium text-gray-600 capitalize">{schedule.mediaType || 'video'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(schedule.status)}
                      {getStatusBadge(schedule.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(schedule.scheduledAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(schedule.scheduledAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Contenu principal */}
                <div className="p-6">
                  {/* Caption avec style amélioré */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {schedule.caption || 'Aucune description disponible'}
                    </p>
                  </div>
                  
                  {/* Thumbnail avec overlay et effet hover */}
                  <div className="relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden group/thumbnail">
                    {schedule.thumbnailUrl ? (
                      <>
                        <Image 
                          src={schedule.thumbnailUrl} 
                          alt="Thumbnail" 
                          width={400}
                          height={200}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/thumbnail:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                              <Camera className="h-6 w-6 text-gray-700" />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Camera className="h-8 w-8 text-gray-500" />
                          </div>
                          <p className="text-sm text-gray-500">Aperçu non disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Plateformes avec design amélioré */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plateformes</span>
                      <span className="text-xs text-gray-400">{schedule.platforms.length} compte(s)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {schedule.platforms.map((platformId: string) => {
                        const account = accounts.find(acc => acc.id === platformId);
                        return account ? (
                          <div key={platformId} className="relative group/platform">
                            <PlatformIcon
                              platform={account.platform}
                              size="md"
                              profileImageUrl={account.avatarUrl}
                              username={account.username}
                              className="w-10 h-10 border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full opacity-0 group-hover/platform:opacity-100 transition-opacity duration-200"></div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  {/* Actions en bas */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Partager
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* État vide amélioré */}
        {filteredSchedules.length === 0 && !loading && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="text-center py-16 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun post trouvé</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Créez votre premier post pour commencer à gérer votre contenu sur les réseaux sociaux.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/dashboard/upload'}
                  className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{ background: 'var(--luma-gradient-primary)' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un nouveau post
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard/schedule'}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Planifier un post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
