'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info,
  Edit3,
  Camera,
  Globe,
  MoreHorizontal,
  Trash2,
  Send,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  Share2,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { PlatformIcon } from '@/components/ui/platform-icon';

interface Draft {
  id: string;
  caption: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
  status: 'draft';
  platforms: string[];
  userId: string;
  mediaType?: 'video' | 'image' | 'text';
  thumbnailUrl?: string;
  videoFile?: string;
  videoUrl?: string; // URL de la vidéo sur Firebase Storage
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/drafts');
        if (!response.ok) {
          throw new Error('Failed to fetch drafts');
        }
        const data = await response.json();
        setDrafts(data.drafts || []);
      } catch (error) {
        console.error('Error fetching drafts:', error);
        // Fallback to mock data if API fails
        setDrafts(mockDrafts);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/accounts');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts || []);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchDrafts();
    fetchAccounts();
  }, []);

  const filteredDrafts = drafts
    .filter(draft => {
      const matchesPlatform = filterPlatform === 'all' || draft.platforms.includes(filterPlatform);
      const matchesAccount = filterAccount === 'all' || draft.userId === filterAccount;
      return matchesPlatform && matchesAccount;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
      } else {
        return new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime();
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit3 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | { seconds: number; nanoseconds: number } | string) => {
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'object' && 'seconds' in date) {
      // Firestore timestamp
      dateObj = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = new Date();
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handlePublishDraft = (draftId: string) => {
    // Ici on pourrait rediriger vers la page de création avec les données du draft
    alert('Fonctionnalité de publication à venir !');
  };

         const handleEditDraft = (draft: Draft) => {
           // Stocker les données du draft dans le localStorage pour un accès rapide
           localStorage.setItem('editingDraft', JSON.stringify({
             id: draft.id,
             caption: draft.caption,
             platforms: draft.platforms,
             mediaType: draft.mediaType,
             thumbnailUrl: draft.thumbnailUrl,
             videoFile: draft.videoFile,
             videoUrl: (draft as any).videoUrl // URL de la vidéo sur Firebase Storage
           }));
           // Redirection simple
           window.location.href = '/dashboard/upload?edit=true';
         };

  const handleDeleteDraft = async (draftId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce brouillon ?')) {
      try {
        const response = await fetch(`/api/drafts?id=${draftId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setDrafts(prev => prev.filter(draft => draft.id !== draftId));
        } else {
          console.error('Erreur lors de la suppression du draft');
          alert('Erreur lors de la suppression du brouillon');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du draft:', error);
        alert('Erreur lors de la suppression du brouillon');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading drafts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header moderne avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-orange-900 to-orange-600 bg-clip-text text-transparent">
                  Brouillons
                </h1>
                <Info className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">Gérez et finalisez vos contenus en cours de création</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => window.location.href = '/dashboard/upload'}
                className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ background: 'var(--luma-gradient-primary)' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Brouillon
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Total Brouillons</p>
                    <p className="text-2xl font-bold text-orange-900">{filteredDrafts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Vidéos</p>
                    <p className="text-2xl font-bold text-blue-900">{filteredDrafts.filter(d => d.mediaType === 'video').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Images</p>
                    <p className="text-2xl font-bold text-green-900">{filteredDrafts.filter(d => d.mediaType === 'image').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Textes</p>
                    <p className="text-2xl font-bold text-purple-900">{filteredDrafts.filter(d => d.mediaType === 'text').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
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
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                  </select>
                  
                  <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                  >
                    <option value="all">Toutes les plateformes</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                  </select>
                  
                  <select
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
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
                          ? 'bg-white shadow-sm text-orange-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-sm text-orange-600' 
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

        {/* Grille des drafts modernisée */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredDrafts.map((draft) => (
            <Card key={draft.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white">
              <CardContent className="p-0">
                {/* Header avec gradient et date */}
                <div className="relative p-6 bg-gradient-to-r from-orange-50 to-white border-b border-orange-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {draft.mediaType === 'video' && <Camera className="h-4 w-4 text-orange-600" />}
                      {draft.mediaType === 'image' && <Globe className="h-4 w-4 text-orange-600" />}
                      {draft.mediaType === 'text' && <FileText className="h-4 w-4 text-orange-600" />}
                      <span className="text-sm font-medium text-orange-700 capitalize">{draft.mediaType || 'text'}</span>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      Brouillon
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(draft.createdAt).split(' ')[0]}
                      </div>
                      <div className="text-sm text-gray-500">
                        Créé le {formatDate(draft.createdAt)}
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
                        onClick={() => handleEditDraft(draft)}
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
                      {draft.caption || 'Aucune description disponible'}
                    </p>
                  </div>
                  
                  {/* Thumbnail avec overlay et effet hover */}
                  <div className="relative w-full h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-4 overflow-hidden group/thumbnail">
                    {draft.thumbnailUrl && 
                     (typeof draft.thumbnailUrl === 'string' ? 
                       draft.thumbnailUrl.trim() !== '' : 
                        (draft.thumbnailUrl as any).downloadUrl && (draft.thumbnailUrl as any).downloadUrl.trim() !== '') ? (
                      <>
                        <Image
                          src={typeof draft.thumbnailUrl === 'string' ? draft.thumbnailUrl : (draft.thumbnailUrl as any).downloadUrl}
                          alt="Draft thumbnail"
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
                          <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Camera className="h-8 w-8 text-orange-600" />
                          </div>
                          <p className="text-sm text-orange-600">Aperçu non disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Plateformes avec design amélioré */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plateformes ciblées</span>
                      <span className="text-xs text-gray-400">{draft.platforms.length} compte(s)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {draft.platforms.map((platformId, index) => {
                        const account = accounts.find(acc => acc.id === platformId);
                        const platformName = account?.platform || 'tiktok';
                        const username = account?.displayName || account?.username || 'Unknown';
                        
                        return (
                          <div key={index} className="relative group/platform">
                            <PlatformIcon
                              platform={platformName}
                              size="md"
                              className="w-10 h-10 border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200"
                              profileImageUrl={account?.avatarUrl}
                              username={username}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full opacity-0 group-hover/platform:opacity-100 transition-opacity duration-200"></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Actions en bas */}
                  <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        className="text-white shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ background: 'var(--luma-gradient-primary)' }}
                        onClick={() => handlePublishDraft(draft.id)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Publier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                        onClick={() => handleEditDraft(draft)}
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteDraft(draft.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* État vide amélioré */}
        {filteredDrafts.length === 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="text-center py-16 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Edit3 className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun brouillon trouvé</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Commencez par créer votre premier contenu et sauvegardez-le comme brouillon pour le finaliser plus tard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/dashboard/upload'}
                  className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{ background: 'var(--luma-gradient-primary)' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un brouillon
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard/all-posts'}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir tous les posts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const mockDrafts: Draft[] = [
  {
    id: '1',
    caption: 'This is a draft video post about new features!',
    createdAt: new Date('2025-01-18T10:00:00Z'),
    status: 'draft',
    platforms: ['tiktok'],
    userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
    mediaType: 'video',
    thumbnailUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Draft1',
  },
  {
    id: '2',
    caption: 'Exciting new update coming soon! This is a longer caption to test the line clamp functionality.',
    createdAt: new Date('2025-01-17T15:30:00Z'),
    status: 'draft',
    platforms: ['tiktok', 'facebook'],
    userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
    mediaType: 'video',
    thumbnailUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Draft2',
  },
  {
    id: '3',
    caption: 'Quick tip for better content creation!',
    createdAt: new Date('2025-01-16T09:15:00Z'),
    status: 'draft',
    platforms: ['tiktok'],
    userId: 'FGcdXcRXVoVfsSwJIciurCeuCXz1',
    mediaType: 'image',
    thumbnailUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Draft3',
  },
];
