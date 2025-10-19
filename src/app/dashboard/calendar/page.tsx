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
  FileText,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Filter,
  Grid3X3,
  List
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
        return <Image className="h-3 w-3" style={{ color: 'var(--luma-purple)' }} />;
      case 'text':
        return <FileText className="h-3 w-3 text-gray-600" />;
      default:
        return <FileText className="h-3 w-3 text-gray-600" />;
    }
  };

  const getPostIcon = (platforms: string[]) => {
    // Trouver le premier compte correspondant
    const account = accounts.find(acc => platforms.includes(acc.id));
    
    
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

  // Calculer les statistiques
  const totalScheduled = scheduledPosts.length;
  const thisWeekPosts = scheduledPosts.filter(post => {
    const postDate = new Date(post.scheduledAt);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return postDate >= now && postDate <= weekFromNow;
  }).length;
  const todayPosts = scheduledPosts.filter(post => {
    const postDate = new Date(post.scheduledAt);
    const today = new Date();
    return postDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="h-full flex flex-col">
        {/* Header moderne avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-indigo-600 bg-clip-text text-transparent">
                  Calendrier
                </h1>
                <Info className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">Visualisez et gérez vos publications planifiées</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => window.location.href = '/dashboard/upload'}
                className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{ background: 'var(--luma-gradient-primary)' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Planifier un Post
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Total Planifiés</p>
                    <p className="text-2xl font-bold text-indigo-900">{totalScheduled}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Cette Semaine</p>
                    <p className="text-2xl font-bold text-green-900">{thisWeekPosts}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-purple-900">{todayPosts}</p>
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
                    <p className="text-sm font-medium text-orange-600">Plateformes</p>
                    <p className="text-2xl font-bold text-orange-900">{accounts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contrôles de navigation modernisés */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  {/* Navigation mois */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold text-gray-900 min-w-40 text-center">
                      {formatDate(currentDate)}
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Boutons de navigation rapide */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={goToToday}
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Aujourd'hui
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={goToOctober2025}
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      Oct 2025
                    </Button>
                  </div>

                  {/* Boutons vue */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'month' 
                          ? 'bg-white shadow-sm text-indigo-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Mois
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'week' 
                          ? 'bg-white shadow-sm text-indigo-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Semaine
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendrier modernisé */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 border-0 shadow-lg bg-white">
            <CardContent className="p-0 h-full flex flex-col">
            {/* En-têtes des jours modernisés */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
              {weekDays.map(day => (
                <div key={day} className="p-4 text-center font-semibold text-indigo-700 bg-transparent">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier modernisée */}
            <div className="grid grid-cols-7 flex-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-40 border-r border-b border-gray-100 p-3 transition-all duration-200 hover:bg-gray-50 ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${day.isToday ? 'bg-gradient-to-br from-indigo-50 to-indigo-100' : ''}`}
                >
                  {/* Date avec style amélioré */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-semibold ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${day.isToday ? 'text-indigo-700 bg-white px-2 py-1 rounded-full' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    {day.isCurrentMonth && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-indigo-100"
                      >
                        <Plus className="h-3 w-3 text-indigo-600" />
                      </Button>
                    )}
                  </div>

                  {/* Posts planifiés avec design amélioré */}
                  <div className="space-y-2">
                    {day.posts.slice(0, 3).map((post, postIndex) => (
                      <div
                        key={postIndex}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-105 relative group"
                      >
                        {/* Icône du type de contenu en haut à droite */}
                        <div className="absolute top-2 right-2">
                          {getContentTypeIcon((post as any).mediaType)}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-3 w-3 text-indigo-500" />
                          <span className="text-xs font-medium text-gray-700">
                            {formatTime(post.scheduledAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex justify-start">
                            {getPostIcon(post.platforms)}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit3 className="h-3 w-3 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Plus de posts */}
                    {day.posts.length > 3 && (
                      <div className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium bg-indigo-50 px-2 py-1 rounded-md text-center">
                        +{day.posts.length - 3} autres
                      </div>
                    )}
                    
                    {/* Aucun post */}
                    {day.posts.length === 0 && day.isCurrentMonth && (
                      <div className="text-xs text-gray-400 italic text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                        Aucun post
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Légende modernisée */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-white">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span className="font-medium text-gray-700">Planifié</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-gray-700">Publié</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Edit3 className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-gray-700">Brouillon</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Video className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-gray-700">Vidéo</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Image className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-gray-700">Image</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Texte</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
