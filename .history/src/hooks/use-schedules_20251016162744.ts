'use client';

import { useState, useEffect } from 'react';
import { Schedule } from '@/lib/firestore';

export function useSchedules(userId: string | null) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async (status?: string) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId,
        limit: '50',
      });

      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/schedules?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des planifications');
      }

      const data = await response.json();
      setSchedules(data.schedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData: {
    videoId: string;
    accountId: string;
    title: string;
    description?: string;
    hashtags?: string[];
    scheduledAt: string;
  }) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...scheduleData,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la planification');
      }

      const newSchedule = await response.json();
      setSchedules(prev => [newSchedule, ...prev]);
      return newSchedule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  };

  const updateSchedule = async (scheduleId: string, updates: Partial<Schedule>) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: scheduleId,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la planification');
      }

      const updatedSchedule = await response.json();
      setSchedules(prev => 
        prev.map(schedule => schedule.id === scheduleId ? updatedSchedule : schedule)
      );
      return updatedSchedule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/schedules?id=${scheduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la planification');
      }

      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
}
