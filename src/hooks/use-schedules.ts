import { useState, useEffect } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export interface Schedule {
  id: string;
  userId: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  platforms: string[];
  scheduledAt: string;
  status: 'scheduled' | 'published' | 'failed';
  createdAt: string;
  videoFileName?: string;
}

export function useSchedules(userId?: string, status?: string) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔧 useSchedules appelé avec:', { userId, status });

  const fetchSchedules = async () => {
    if (!userId) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📅 Récupération des planifications via API pour userId:', userId);
      
      // Utiliser l'API au lieu de Firebase directement
      const url = status 
        ? `/api/schedules?userId=${userId}&status=${status}`
        : `/api/schedules?userId=${userId}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📅 Réponse API:', data);
      
      const schedulesData: Schedule[] = data.schedules || [];
      
      // Debug et conversion des dates
      schedulesData.forEach((schedule, index) => {
        console.log(`📅 ===== DEBUG SCHEDULE ${index} =====`);
        console.log('📅 Données brutes scheduledAt:', schedule.scheduledAt);
        console.log('📅 Type:', typeof schedule.scheduledAt);
        
        // Convertir la date si nécessaire
        if (schedule.scheduledAt && typeof schedule.scheduledAt === 'string') {
          if (schedule.scheduledAt.includes('octobre') || schedule.scheduledAt.includes('à')) {
            console.log('📅 Format français détecté!');
            try {
              const match = schedule.scheduledAt.match(/(\d+) octobre (\d+) à (\d+):(\d+):(\d+) UTC\+(\d+)/);
              console.log('📅 Regex match:', match);
              
              if (match) {
                const [, day, year, hour, minute, second, timezone] = match;
                console.log('📅 Composants extraits:', { day, year, hour, minute, second, timezone });
                
                const isoDate = `${year}-10-${day.padStart(2, '0')}T${hour}:${minute}:${second}+0${timezone}:00`;
                console.log('📅 Date ISO construite:', isoDate);
                
                const testDate = new Date(isoDate);
                console.log('📅 Test Date object:', testDate);
                console.log('📅 Test Date isValid:', !isNaN(testDate.getTime()));
                
                schedule.scheduledAt = testDate.toISOString();
                console.log('📅 Date française convertie:', schedule.scheduledAt);
              } else {
                console.error('❌ Regex ne matche pas pour:', schedule.scheduledAt);
              }
            } catch (error) {
              console.error('❌ Erreur conversion date française:', error);
            }
          }
        }
      });
      
      console.log('📅 Planifications finales:', schedulesData);
      setSchedules(schedulesData);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des planifications:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await deleteDoc(doc(db, 'schedules', scheduleId));
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      console.log('✅ Planification supprimée:', scheduleId);
    } catch (err) {
      console.error('❌ Erreur lors de la suppression:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [userId]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
    deleteSchedule
  };
}