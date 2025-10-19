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
  Trash2,
  Clock,
  CheckCircle,
  TrendingUp,
  Filter
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
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    
    try {
      
      const response = await fetch(`/api/schedules?id=${scheduleToDelete}`, {
        method: 'DELETE',
      });


      if (response.ok) {
        const result = await response.json();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header moderne avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-blue-600 bg-clip-text text-transparent">
                  Posts Planifiés
                </h1>
                <Info className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">Gérez et planifiez vos publications à venir</p>
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
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Planifiés</p>
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
                    <p className="text-sm font-medium text-green-600">Cette Semaine</p>
                    <p className="text-2xl font-bold text-green-900">
                      {filteredSchedules.filter(s => {
                        const scheduleDate = new Date(s.scheduledAt);
                        const now = new Date();
                        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return scheduleDate >= now && scheduleDate <= weekFromNow;
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {filteredSchedules.filter(s => {
                        const scheduleDate = new Date(s.scheduledAt);
                        const today = new Date();
                        return scheduleDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Ce Mois</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {filteredSchedules.filter(s => {
                        const scheduleDate = new Date(s.scheduledAt);
                        const now = new Date();
                        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                        return scheduleDate >= now && scheduleDate <= monthFromNow;
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
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
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                  </select>
                  
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Toutes les plateformes</option>
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
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                  >
                    <option value="all">Toute la période</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {/* Posts Grid modernisé */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.length === 0 ? (
              <div className="col-span-full">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="text-center py-16 px-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Aucune publication planifiée
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Créez votre première planification pour automatiser vos publications sur les réseaux sociaux.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={handleCreateSchedule} 
                        className="text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
                        style={{ background: 'var(--luma-gradient-primary)' }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Planifier un post
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/dashboard/upload'}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Créer un post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredSchedules.map((schedule) => {
                const dateInfo = formatDate(schedule.scheduledAt);
                return (
                  <Card key={schedule.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white">
                    <CardContent className="p-0">
                      {/* Header avec gradient et date */}
                      <div className="relative p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Camera className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700 capitalize">video</span>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            Planifié
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {dateInfo.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dateInfo.time}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                              onClick={() => handleEditSchedule(schedule.id)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteSchedule(schedule.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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
                        <div className="relative w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4 overflow-hidden group/thumbnail">
                          {schedule.thumbnailUrl ? (
                            <>
                              <Image
                                src={schedule.thumbnailUrl}
                                alt="Video thumbnail"
                                width={400}
                                height={200}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-105"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/thumbnail:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300">
                                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <Play className="h-6 w-6 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : schedule.videoUrl ? (
                            <div className="relative w-full h-full">
                              <video
                                src={schedule.videoUrl}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-105"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/thumbnail:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300">
                                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                    <Play className="h-6 w-6 text-gray-700" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Play className="h-8 w-8 text-blue-600" />
                                </div>
                                <p className="text-sm text-blue-600">Aperçu non disponible</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Plateformes avec design amélioré */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plateformes ciblées</span>
                            <span className="text-xs text-gray-400">{schedule.platforms?.length || 0} compte(s)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {schedule.platforms?.map((platformId, index) => {
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
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full opacity-0 group-hover/platform:opacity-100 transition-opacity duration-200"></div>
                                </div>
                              );
                            }) || (
                              <div className="relative group/platform">
                                <PlatformIcon
                                  platform="tiktok"
                                  size="md"
                                  className="w-10 h-10 border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions en bas */}
                        <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEditSchedule(schedule.id)}
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
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteSchedule(schedule.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
