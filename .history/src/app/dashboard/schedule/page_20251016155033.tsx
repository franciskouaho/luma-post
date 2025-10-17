'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';

// Mock data pour les publications planifiées
const mockSchedules = [
  {
    id: '1',
    videoTitle: 'Tutoriel React Native',
    videoThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cce?w=200&h=200&fit=crop',
    account: '@francis_creations',
    scheduledAt: '2024-01-20T14:30:00Z',
    status: 'scheduled',
    hashtags: ['#ReactNative', '#Mobile', '#Tutorial'],
    description: 'Apprenez les bases de React Native en 10 minutes'
  },
  {
    id: '2',
    videoTitle: 'Tips de développement',
    videoThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop',
    account: '@luma_poste',
    scheduledAt: '2024-01-19T16:00:00Z',
    status: 'published',
    hashtags: ['#DevTips', '#Coding', '#Tech'],
    description: '5 conseils pour améliorer votre code'
  },
  {
    id: '3',
    videoTitle: 'Review iPhone 15',
    videoThumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
    account: '@francis_creations',
    scheduledAt: '2024-01-18T10:15:00Z',
    status: 'failed',
    hashtags: ['#iPhone15', '#Review', '#Tech'],
    description: 'Mon avis sur le nouvel iPhone 15 Pro Max'
  }
];

export default function SchedulePage() {
  const [schedules] = useState(mockSchedules);
  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Planifié
          </Badge>
        );
      case 'published':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Publié
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Échec
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inconnu
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (filter === 'all') return true;
    return schedule.status === filter;
  });

  const handleCreateSchedule = () => {
    console.log('Créer une nouvelle planification');
  };

  const handleEditSchedule = (id: string) => {
    console.log('Modifier la planification:', id);
  };

  const handleDeleteSchedule = (id: string) => {
    console.log('Supprimer la planification:', id);
  };

  const handlePauseSchedule = (id: string) => {
    console.log('Mettre en pause la planification:', id);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planification</h1>
        <p className="text-gray-600">
          Gérez vos publications planifiées et suivez leur statut.
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button onClick={handleCreateSchedule}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle planification
          </Button>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous</option>
              <option value="scheduled">Planifiés</option>
              <option value="published">Publiés</option>
              <option value="failed">Échecs</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {filteredSchedules.length} publication(s) {filter !== 'all' && `(${filter})`}
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune publication planifiée
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre première planification pour commencer
              </p>
              <Button onClick={handleCreateSchedule}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une planification
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Video Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={schedule.videoThumbnail}
                      alt={schedule.videoTitle}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {schedule.videoTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {schedule.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>@{schedule.account}</span>
                          <span>•</span>
                          <span>{formatDate(schedule.scheduledAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {schedule.hashtags.map((hashtag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(schedule.status)}
                        
                        <div className="flex space-x-2">
                          {schedule.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePauseSchedule(schedule.id)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSchedule(schedule.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Échecs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules.filter(s => s.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
