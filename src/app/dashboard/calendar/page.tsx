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
  Info
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  caption: string;
  scheduledAt: Date;
  status: 'scheduled' | 'posted' | 'draft';
  platforms: string[];
  userId: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

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
        const postDate = new Date(post.scheduledAt);
        return postDate.toDateString() === date.toDateString();
      });

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
        setLoading(true);
        const response = await fetch('/api/schedules?userId=FGcdXcRXVoVfsSwJIciurCeuCXz1');
        if (response.ok) {
          const data = await response.json();
          setScheduledPosts(data.schedules || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des posts planifiés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledPosts();
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

  const getPostIcon = (platforms: string[]) => {
    if (platforms.includes('tiktok')) {
      return <Camera className="h-3 w-3 text-gray-600" />;
    }
    return <Globe className="h-3 w-3 text-gray-600" />;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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
                  className={`min-h-32 border-r border-b border-gray-200 p-2 ${
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
                    {day.posts.slice(0, 3).map((post, postIndex) => (
                      <div
                        key={postIndex}
                        className="flex items-center space-x-1 text-xs bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 cursor-pointer"
                      >
                        <Clock className="h-2 w-2 text-gray-500" />
                        <span className="text-gray-600">{formatTime(new Date(post.scheduledAt))}</span>
                        {getPostIcon(post.platforms)}
                        <span className="text-gray-700 truncate">
                          {post.caption.substring(0, 20)}...
                        </span>
                        {post.status === 'draft' && (
                          <Edit3 className="h-2 w-2 text-blue-500" />
                        )}
                      </div>
                    ))}
                    
                    {/* Plus de posts */}
                    {day.posts.length > 3 && (
                      <div className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                        +{day.posts.length - 3} more
                      </div>
                    )}

                    {/* Aucun post */}
                    {day.posts.length === 0 && day.isCurrentMonth && (
                      <div className="text-xs text-gray-400 italic">
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
