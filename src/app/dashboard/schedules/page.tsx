'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown,
  Info,
  Filter,
  RefreshCw,
  CheckSquare,
  Camera,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import Image from 'next/image';
import TikTokLogo from '@/assets/logo/tiktok.png';

interface ScheduledPost {
  id: string;
  caption: string;
  scheduledAt: Date;
  status: 'scheduled' | 'posted' | 'draft';
  platforms: string[];
  userId: string;
  createdAt: Date;
  mediaType?: 'video' | 'image' | 'text';
  thumbnailUrl?: string;
}

export default function ScheduledPostsPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Charger les posts planifiés
  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        setLoading(true);
        
        // Récupérer les posts planifiés
        const schedulesResponse = await fetch('/api/schedules?userId=FGcdXcRXVoVfsSwJIciurCeuCXz1');
        const schedulesData = schedulesResponse.ok ? await schedulesResponse.json() : { schedules: [] };
        
        // Convertir en ScheduledPost
        const scheduledPosts: ScheduledPost[] = schedulesData.schedules.map((schedule: any) => ({
          id: schedule.id,
          caption: schedule.caption,
          scheduledAt: new Date(schedule.scheduledAt),
          status: schedule.status || 'scheduled',
          platforms: schedule.platforms || ['tiktok'],
          userId: schedule.userId,
          createdAt: new Date(schedule.createdAt),
          mediaType: 'video',
          thumbnailUrl: schedule.thumbnailUrl
        }));
        
        setPosts(scheduledPosts);
      } catch (error) {
        console.error('Erreur lors du chargement des posts planifiés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledPosts();
  }, []);

  // Filtrer et trier les posts
  const filteredPosts = posts
    .filter(post => {
      const matchesPlatform = filterPlatform === 'all' || post.platforms.includes(filterPlatform);
      const matchesAccount = filterAccount === 'all' || post.userId === filterAccount;
      return matchesPlatform && matchesAccount;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime();
      } else {
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      }
    });

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
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des posts planifiés...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-gray-900">Scheduled Posts</h1>
              <Info className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                Select
              </Button>
            </div>
          </div>
          
          {/* Filtres comme dans le screenshot */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Platforms</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Accounts</option>
                <option value="FGcdXcRXVoVfsSwJIciurCeuCXz1">My Account</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grille des posts planifiés */}
        <div className="grid grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                {/* Header avec date et heure */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(post.scheduledAt)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(post.scheduledAt)}
                    </div>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="p-4">
                  {/* Type de média */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Camera className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">video</span>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {post.caption}
                  </p>
                  
                  {/* Thumbnail */}
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {post.thumbnailUrl ? (
                      <Image
                        src={post.thumbnailUrl}
                        alt="Post thumbnail"
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Plateformes connectées avec logo TikTok au-dessus */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Scheduled to:</span>
                    <div className="flex items-center space-x-1">
                      {post.platforms.map((platform, index) => (
                        <div key={platform} className="relative">
                          {platform === 'tiktok' ? (
                            <div className="relative">
                              {/* Logo TikTok au-dessus de l'avatar */}
                              <div className="absolute -top-2 -left-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-lg z-10">
                                <Image
                                  src={TikTokLogo}
                                  alt="TikTok"
                                  width={12}
                                  height={12}
                                  className="w-3 h-3"
                                />
                              </div>
                              {/* Avatar TikTok */}
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">T</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {platform.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Badge scheduled en bas à droite */}
                  <div className="flex justify-end mt-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      scheduled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun post */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun post planifié</h3>
            <p className="text-gray-500">
              Commencez par planifier votre premier post.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
