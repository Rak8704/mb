// hooks/useWallet.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface WalletBalance {
  username: string;
  balance: number;
  currency: string;
  timestamp: number;
}

export interface WalletTransaction {
  transactionId: string;
  type: 'debit' | 'credit';
  amount: number;
  gameId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
}

interface UseWalletReturn {
  balance: WalletBalance | null;
  loading: boolean;
  error: string | null;
  getBalance: () => Promise<void>;
  debit: (amount: number, gameId: string) => Promise<boolean>;
  credit: (amount: number, gameId: string) => Promise<boolean>;
  refreshBalance: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const username = user?.email || user?.id || 'guest';

  const getBalance = useCallback(async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          currency: 'INR',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch balance');

      const data = await response.json();
      setBalance(data.data || data);
    } catch (err: any) {
      setError(err.message);
      console.error('Wallet error:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const debit = useCallback(
    async (amount: number, gameId: string): Promise<boolean> => {
      if (!username) {
        setError('User not authenticated');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const transactionId = `debit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch('/api/wallet/debit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            amount,
            currency: 'INR',
            gameId,
            transactionId,
          }),
        });

        if (!response.ok) throw new Error('Debit failed');

        const data = await response.json();

        // Update local balance
        if (data.data?.balance !== undefined) {
          setBalance((prev) =>
            prev ? { ...prev, balance: data.data.balance } : null
          );
        }

        return true;
      } catch (err: any) {
        setError(err.message);
        console.error('Debit error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  const credit = useCallback(
    async (amount: number, gameId: string): Promise<boolean> => {
      if (!username) {
        setError('User not authenticated');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const transactionId = `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const response = await fetch('/api/wallet/credit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            amount,
            currency: 'INR',
            gameId,
            transactionId,
          }),
        });

        if (!response.ok) throw new Error('Credit failed');

        const data = await response.json();

        // Update local balance
        if (data.data?.balance !== undefined) {
          setBalance((prev) =>
            prev ? { ...prev, balance: data.data.balance } : null
          );
        }

        return true;
      } catch (err: any) {
        setError(err.message);
        console.error('Credit error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  const refreshBalance = useCallback(() => getBalance(), [getBalance]);

  // Fetch balance on mount
  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return {
    balance,
    loading,
    error,
    getBalance,
    debit,
    credit,
    refreshBalance,
  };
}
