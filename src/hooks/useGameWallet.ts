// hooks/useGameWallet.ts
'use client';

import { useWallet } from './useWallet';
import { useCallback } from 'react';

/**
 * Game Wallet Hook
 * Handles wallet transactions for games (betting, payouts, etc.)
 */
export function useGameWallet(gameId: string) {
  const { debit, credit, balance, loading, error } = useWallet();

  /**
   * Place a bet - debit from wallet
   */
  const placeBet = useCallback(
    async (amount: number, gameType: string = 'game') => {
      if (balance && balance.balance < amount) {
        return { success: false, error: 'Insufficient balance' };
      }

      const success = await debit(amount, `${gameType}_${gameId}`);
      return { success, error: success ? null : 'Failed to place bet' };
    },
    [gameId, balance, debit]
  );

  /**
   * Receive payout - credit to wallet
   */
  const receivePayout = useCallback(
    async (amount: number, reason: string = 'win') => {
      const success = await credit(amount, `${reason}_${gameId}`);
      return { success, error: success ? null : 'Failed to receive payout' };
    },
    [gameId, credit]
  );

  /**
   * Refund bet - credit to wallet
   */
  const refundBet = useCallback(
    async (amount: number) => {
      const success = await credit(amount, `refund_${gameId}`);
      return { success, error: success ? null : 'Failed to refund' };
    },
    [gameId, credit]
  );

  return {
    balance: balance?.balance || 0,
    currency: balance?.currency || 'INR',
    loading,
    error,
    placeBet,
    receivePayout,
    refundBet,
  };
}
