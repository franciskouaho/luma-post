'use client';

import { useState, useEffect } from 'react';
import { TikTokAccount } from '@/lib/firestore';

export function useTikTokAccounts(userId: string | null) {
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/accounts?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des comptes');
      }

      const data = await response.json();
      setAccounts(data.accounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const connectTikTokAccount = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/auth/tiktok/authorize?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération de l\'URL d\'autorisation');
      }

      const data = await response.json();
      
      // Rediriger vers TikTok
      window.location.href = data.authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts?accountId=${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la déconnexion du compte');
      }

      setAccounts(prev => prev.filter(account => account.id !== accountId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    connectTikTokAccount,
    disconnectAccount,
  };
}
