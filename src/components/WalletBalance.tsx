// components/WalletBalance.tsx
'use client';

import { useWallet } from '@/hooks/useWallet';
import { Wallet, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function WalletBalance() {
  const { balance, loading, error, refreshBalance } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setIsRefreshing(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet size={32} />
          <div>
            <p className="text-sm text-blue-100">Your Balance</p>
            <p className="text-3xl font-bold">
              {balance ? (
                <>
                  ₹{balance.balance?.toLocaleString('en-IN') || '0'}
                </>
              ) : (
                <span className="text-lg">Loading...</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="p-2 hover:bg-blue-400 rounded-full transition disabled:opacity-50"
        >
          <RefreshCw
            size={24}
            className={isRefreshing ? 'animate-spin' : ''}
          />
        </button>
      </div>
      {error && <p className="text-red-200 text-sm mt-2">⚠️ {error}</p>}
    </div>
  );
}
