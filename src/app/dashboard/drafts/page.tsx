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
  Send
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Drafts</h1>
            <Info className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Filtres */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--luma-purple)' } as React.CSSProperties}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Platform:</span>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--luma-purple)' } as React.CSSProperties}
              >
                <option value="all">All Platforms</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--luma-purple)' } as React.CSSProperties}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Account:</span>
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2" style={{ '--tw-ring-color': 'var(--luma-purple)' } as React.CSSProperties}
              >
                <option value="all">All Accounts</option>
                <option value="FGcdXcRXVoVfsSwJIciurCeuCXz1">My Account</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grille des drafts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((draft) => (
            <Card key={draft.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <CardContent className="p-0">
                {/* Header avec date et statut */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(draft.createdAt)}
                  </div>
                  <Badge variant="secondary" className={getStatusBadgeVariant(draft.status)}>
                    {draft.status}
                  </Badge>
                </div>
                
                {/* Contenu */}
                <div className="p-4">
                  {/* Type de média */}
                  <div className="flex items-center space-x-2 mb-3">
                    {draft.mediaType === 'video' && <Camera className="h-4 w-4 text-gray-500" />}
                    {draft.mediaType === 'image' && <Globe className="h-4 w-4 text-gray-500" />}
                    {draft.mediaType === 'text' && <MoreHorizontal className="h-4 w-4 text-gray-500" />}
                    <span className="text-sm text-gray-600">{draft.mediaType || 'text'}</span>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {draft.caption}
                  </p>
                  
                  {/* Thumbnail */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    {draft.thumbnailUrl && 
                     (typeof draft.thumbnailUrl === 'string' ? 
                       draft.thumbnailUrl.trim() !== '' : 
                        (draft.thumbnailUrl as any).downloadUrl && (draft.thumbnailUrl as any).downloadUrl.trim() !== '') ? (
                      <Image
                        src={typeof draft.thumbnailUrl === 'string' ? draft.thumbnailUrl : (draft.thumbnailUrl as any).downloadUrl}
                        alt="Draft thumbnail"
                        width={300}
                        height={160}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Plateformes avec avatars */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500">Scheduled to:</span>
                    </div>
                    <div className="flex space-x-2">
                      {draft.platforms.map((platformId, index) => {
                        // Trouver le compte correspondant
                        const account = accounts.find(acc => acc.id === platformId);
                        const platformName = account?.platform || 'tiktok';
                        const username = account?.displayName || account?.username || 'Unknown';
                        
                        return (
                          <PlatformIcon
                            key={index}
                            platform={platformName}
                            size="md"
                            className="cursor-pointer"
                            profileImageUrl={account?.avatarUrl}
                            username={username}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 text-white transition-all duration-200 shadow-md hover:shadow-lg" style={{ background: 'var(--luma-gradient-primary)' }}
                      onClick={() => handlePublishDraft(draft.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditDraft(draft)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteDraft(draft.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun draft */}
        {filteredDrafts.length === 0 && (
          <div className="text-center py-12">
            <Edit3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun brouillon trouvé</h3>
            <p className="text-gray-500">
              Commencez par créer votre premier post et sauvegardez-le comme brouillon.
            </p>
          </div>
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
