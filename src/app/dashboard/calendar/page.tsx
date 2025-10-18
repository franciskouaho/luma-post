'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle, 
  Edit3,
  Globe,
  Camera,
  Info,
  Video,
  Image,
  FileText
} from 'lucide-react';
import { PlatformIcon } from '@/components/ui/platform-icon';

interface ScheduledPost {
  id: string;
  caption: string;
  scheduledAt: Date;
  status: 'scheduled' | 'published' | 'draft';
  platforms: string[];
  userId: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [accounts, setAccounts] = useState<Array<{
    id: string;
    platform: string;
    username: string;
    avatarUrl?: string;
  }>>([]);

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Ajouter les jours du mois précédent pour remplir la première semaine
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
        posts: []
      });
    }

    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      
      // Trouver les posts pour ce jour
      const dayPosts = scheduledPosts.filter(post => {
        if (!post.scheduledAt) return false;
        const postDate = new Date(post.scheduledAt);
        return postDate.toDateString() === date.toDateString();
      });
      
      if (dayPosts.length > 0) {
        console.log('📅 Posts trouvés pour le', date.toDateString(), ':', dayPosts);
      }

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        posts: dayPosts
      });
    }

    // Ajouter les jours du mois suivant pour remplir la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        posts: []
      });
    }

    return days;
  };

  // Charger les posts planifiés
  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const response = await fetch('/api/schedules?userId=FGcdXcRXVoVfsSwJIciurCeuCXz1');
        if (response.ok) {
          const data = await response.json();
          console.log('Posts récupérés:', data.schedules);
          
          // Convertir les dates Firestore en objets Date
          const posts = (data.schedules || []).map((post: any) => {
            let scheduledAt;
            if (post.scheduledAt?._seconds) {
              // Format Firestore avec _seconds et _nanoseconds
              scheduledAt = new Date(post.scheduledAt._seconds * 1000);
            } else if (post.scheduledAt?.toDate) {
              // Format Firestore avec méthode toDate
              scheduledAt = post.scheduledAt.toDate();
            } else {
              // Format string ou Date
              scheduledAt = new Date(post.scheduledAt);
            }
            
            return {
              ...post,
              scheduledAt
            };
          });
          
          console.log('Posts avec dates converties:', posts);
          setScheduledPosts(posts);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des posts planifiés:', error);
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
        console.error('Erreur lors du chargement des comptes:', error);
      }
    };

    fetchScheduledPosts();
    fetchAccounts();
  }, []);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToOctober2025 = () => {
    setCurrentDate(new Date(2025, 9, 1)); // Octobre 2025
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getContentTypeIcon = (mediaType: string) => {
    switch (mediaType?.toLowerCase()) {
      case 'video':
        return <Video className="h-3 w-3 text-blue-600" />;
      case 'image':
        return <Image className="h-3 w-3 text-green-600" />;
      case 'text':
        return <FileText className="h-3 w-3 text-gray-600" />;
      default:
        return <FileText className="h-3 w-3 text-gray-600" />;
    }
  };

  const getPostIcon = (platforms: string[]) => {
    // Trouver le premier compte correspondant
    const account = accounts.find(acc => platforms.includes(acc.id));
    
    console.log('🔍 getPostIcon - platforms:', platforms);
    console.log('🔍 getPostIcon - accounts:', accounts);
    console.log('🔍 getPostIcon - found account:', account);
    
    if (account) {
      return (
        <PlatformIcon
          platform={account.platform}
          size="sm"
          profileImageUrl={account.avatarUrl}
          username={account.username}
          className="w-5 h-5"
        />
      );
    }
    
    // Par défaut, icône TikTok
    return <Camera className="h-5 w-5 text-gray-600" />;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Debug: afficher les posts récupérés
  console.log('Posts programmés:', scheduledPosts);
  console.log('Date actuelle du calendrier:', currentDate);

  return (
    <div className="h-full p-4">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <Info className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation mois */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 min-w-32 text-center">
                {formatDate(currentDate)}
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Boutons de navigation rapide */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToToday}
              >
                Aujourd&apos;hui
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToOctober2025}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                Oct 2025
              </Button>
            </div>

            {/* Boutons vue */}
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button 
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
        </div>

        {/* Calendrier */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 shadow-lg">
            <CardContent className="p-0 h-full flex flex-col">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map(day => (
                <div key={day} className="p-4 text-center font-semibold text-gray-600 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 flex-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-40 border-r border-b border-gray-200 p-2 ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${day.isToday ? 'bg-green-50' : ''}`}
                >
                  {/* Date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${day.isToday ? 'text-green-600 font-bold' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    {day.isCurrentMonth && (
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3 text-green-600" />
                      </Button>
                    )}
                  </div>

                  {/* Posts planifiés */}
                  <div className="space-y-1">
                    {day.posts.slice(0, 2).map((post, postIndex) => (
                      <div
                        key={postIndex}
                        className="bg-white border border-gray-200 rounded-md p-2 hover:shadow-sm cursor-pointer transition-all relative"
                      >
                        {/* Icône du type de contenu en haut à droite */}
                        <div className="absolute top-1 right-1">
                          {getContentTypeIcon(post.mediaType)}
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">
                            {formatTime(post.scheduledAt)}
                          </span>
                        </div>
                        
                        <div className="flex justify-start">
                          {getPostIcon(post.platforms)}
                        </div>
                      </div>
                    ))}
                    
                    {/* Plus de posts */}
                    {day.posts.length > 2 && (
                      <div className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                        +{day.posts.length - 2} more
                      </div>
                    )}
                    
                    {/* Aucun post */}
                    {day.posts.length === 0 && day.isCurrentMonth && (
                      <div className="text-xs text-gray-400 italic text-center py-2">
                        No posts
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Légende */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Posted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Edit3 className="h-4 w-4 text-blue-500" />
            <span>Draft</span>
          </div>
          <div className="flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span>Video</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Text/Image</span>
          </div>
        </div>
      </div>
    </div>
  );
}
