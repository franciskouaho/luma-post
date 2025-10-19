'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { 
  Calendar, 
  Play, 
  AlertCircle,
  Plus,
  Loader2,
  RefreshCw,
  Info,
  Camera,
  Edit3,
  Trash2
} from 'lucide-react';
import { useSchedules } from '@/hooks/use-schedules';
import { useAuth } from '@/hooks/use-auth';
import { PlatformIcon } from '@/components/ui/platform-icon';

export default function SchedulePage() {
  const { user } = useAuth();
  const { schedules, loading, error } = useSchedules(user?.uid, undefined);
  
  const [sortBy, setSortBy] = useState('newest');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  useEffect(() => {
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

    fetchAccounts();
  }, []);

  const formatDate = (dateInput: string | { _seconds: number; _nanoseconds: number }) => {
    try {
      let date: Date;
      
      // Gérer les timestamps Firestore
      if (typeof dateInput === 'object' && dateInput._seconds) {
        date = new Date(dateInput._seconds * 1000);
      } else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      } else {
        return { date: 'Date invalide', time: '' };
      }
      
      if (isNaN(date.getTime())) {
        return { date: 'Date invalide', time: '' };
      }
      
      return {
        date: date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      };
    } catch {
      return { date: 'Date invalide', time: '' };
    }
  };

  // Supprimé - maintenant géré par le composant PlatformIcon

  const filteredSchedules = schedules.filter(schedule => {
    if (platformFilter !== 'all' && !schedule.platforms?.includes(platformFilter)) return false;
    return true;
  });

  const handleCreateSchedule = () => {
    window.location.href = '/dashboard/upload';
  };

  const handleEditSchedule = async (id: string) => {
    try {
      // Récupérer les données de la planification
      const response = await fetch(`/api/schedules?id=${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la planification');
      }
      
      const data = await response.json();
      const schedule = data.schedule;
      
      if (schedule) {
        // Stocker les données dans le localStorage pour l'édition
        localStorage.setItem('editingSchedule', JSON.stringify({
          id: schedule.id,
          caption: schedule.caption,
          platforms: schedule.platforms,
          scheduledAt: schedule.scheduledAt,
          videoUrl: schedule.videoUrl,
          thumbnailUrl: schedule.thumbnailUrl,
          mediaType: schedule.mediaType
        }));
        
        // Rediriger vers la page d'upload en mode édition
        window.location.href = '/dashboard/upload?edit=true&type=schedule';
      } else {
        alert('Planification non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la planification:', error);
      alert('Erreur lors de la récupération de la planification');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    console.log('🔴 handleDeleteSchedule appelé avec ID:', id);
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    
    try {
      console.log('🔴 Début de la suppression de la planification:', scheduleToDelete);
      
      const response = await fetch(`/api/schedules?id=${scheduleToDelete}`, {
        method: 'DELETE',
      });

      console.log('🔴 Réponse reçue:', response.status, response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('🔴 Résultat:', result);
        console.log('Planification supprimée avec succès:', scheduleToDelete);
        // Recharger la page pour mettre à jour la liste
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('🔴 Erreur lors de la suppression:', errorData);
        alert(`Erreur lors de la suppression: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('🔴 Erreur lors de la suppression de la planification:', error);
      alert('Erreur lors de la suppression de la planification');
    } finally {
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Scheduled Posts</h1>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Accounts</option>
                <option value="account1">Account 1</option>
                <option value="account2">Account 2</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Select
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        </div>

        {/* Main Content */}
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Chargement des planifications...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Erreur lors du chargement: {error}</span>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune publication planifiée
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Créez votre première planification pour commencer
                    </p>
                    <Button onClick={handleCreateSchedule} className="text-white transition-all duration-200 shadow-md hover:shadow-lg" style={{ background: 'var(--luma-gradient-primary)' }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une planification
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredSchedules.map((schedule) => {
                const dateInfo = formatDate(schedule.scheduledAt);
                return (
                  <Card key={schedule.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    <CardContent className="p-0">
                      {/* Header avec date et statut */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {dateInfo.date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dateInfo.time}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            scheduled
                          </Badge>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditSchedule(schedule.id)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('🔴 Bouton supprimer cliqué pour:', schedule.id);
                                handleDeleteSchedule(schedule.id);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Supprimer cette planification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                          {schedule.caption || 'Caption here!'}
                        </p>
                        
                        {/* Thumbnail */}
                        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center relative border-2 border-dashed border-gray-300">
                          {schedule.thumbnailUrl ? (
                            <Image
                              src={schedule.thumbnailUrl}
                              alt="Video thumbnail"
                              width={300}
                              height={160}
                              className="object-cover w-full h-full rounded-lg"
                            />
                          ) : schedule.videoUrl ? (
                            <div className="relative w-full h-full">
                              <video
                                src={schedule.videoUrl}
                                className="w-full h-full object-cover rounded-lg"
                                muted
                                preload="metadata"
                              />
                            </div>
                          ) : (schedule as any).videoFile ? (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                <Play className="h-6 w-6 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium">Video File</span>
                              <span className="text-xs text-gray-400">{(schedule as any).videoFile}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                                <Play className="h-6 w-6 text-gray-600" />
                              </div>
                              <span className="text-sm font-medium">Video Preview</span>
                              <span className="text-xs text-gray-400">Coming soon</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Plateformes avec avatars */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-gray-500">Scheduled to:</span>
                          </div>
                          <div className="flex space-x-2">
                            {schedule.platforms?.map((platformId, index) => {
                              // Trouver le compte correspondant par ID
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
                            }) || (
                              <PlatformIcon
                                platform="tiktok"
                                size="md"
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la planification</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette planification ? Cette action est irréversible et ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSchedule}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
