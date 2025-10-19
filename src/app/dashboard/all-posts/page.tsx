'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info,
  CheckCircle,
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  Clock,
  Send
} from 'lucide-react';
import { PlatformIcon } from '@/components/ui/platform-icon';

export default function AllPostsPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">All Posts</h1>
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
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
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

        {/* Grille des posts */}
        <div className="grid grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-0">
                {/* Header avec date et heure */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(schedule.scheduledAt)} {formatTime(schedule.scheduledAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getContentTypeIcon(schedule.mediaType)}
                      {getStatusIcon(schedule.status)}
                    </div>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="p-4">
                  {/* Caption */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {schedule.caption || 'Sans titre'}
                  </p>
                  
                  {/* Thumbnail */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {schedule.thumbnailUrl ? (
                      <img 
                        src={schedule.thumbnailUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Plateformes connectées */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {schedule.platforms.map((platformId: string) => {
                        const account = accounts.find(acc => acc.id === platformId);
                        return account ? (
                          <PlatformIcon
                            key={platformId}
                            platform={account.platform}
                            size="sm"
                            profileImageUrl={account.avatarUrl}
                            username={account.username}
                            className="w-6 h-6"
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  {/* Badge status en bas à droite */}
                  <div className="flex justify-end">
                    {getStatusBadge(schedule.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun post */}
        {filteredSchedules.length === 0 && !loading && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun post trouvé</h3>
            <p className="text-gray-500">
              Vos posts apparaîtront ici une fois qu&apos;ils seront créés.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
