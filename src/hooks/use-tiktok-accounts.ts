import { useState, useEffect, useCallback } from 'react';

export interface TikTokAccount {
  id: string;
  userId: string;
  platform: 'tiktok';
  tiktokUserId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  accessTokenEnc: string;
  refreshTokenEnc: string;
  expiresAt: any;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

interface UseTikTokAccountsOptions {
  userId: string | null;
  initialAccounts?: TikTokAccount[];
}

export function useTikTokAccounts({ userId, initialAccounts = [] }: UseTikTokAccountsOptions) {
  const [accounts, setAccounts] = useState<TikTokAccount[]>(initialAccounts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async (currentUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/accounts?userId=${currentUserId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch TikTok accounts');
      }
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAccounts(userId);
    } else {
      setAccounts([]);
    }
  }, [userId, fetchAccounts]);

  const addAccount = useCallback(async (accountData: Omit<TikTokAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      setError('User not authenticated');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...accountData, userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add TikTok account');
      }
      const addedAccount: TikTokAccount = await response.json();
      setAccounts(prev => [addedAccount, ...prev]);
      return addedAccount;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateAccount = useCallback(async (accountId: string, updateData: Partial<TikTokAccount>) => {
    if (!userId) {
      setError('User not authenticated');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update TikTok account');
      }
      const updatedAccount: TikTokAccount = await response.json();
      setAccounts(prev => prev.map(acc => (acc.id === accountId ? updatedAccount : acc)));
      return updatedAccount;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteAccount = useCallback(async (accountId: string) => {
    if (!userId) {
      setError('User not authenticated');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete TikTok account');
      }
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts: () => userId && fetchAccounts(userId),
    addAccount,
    updateAccount,
    deleteAccount,
  };
}