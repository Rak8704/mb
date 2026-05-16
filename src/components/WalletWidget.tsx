// components/WalletWidget.tsx
'use client';

import { useWallet } from '@/hooks/useWallet';
import { Coins, TrendingDown, TrendingUp } from 'lucide-react';

export function WalletWidget() {
  const { balance, loading } = useWallet();

  if (loading || !balance) {
    return (
      <div className="w-full max-w-md bg-white rounded-lg p-4 shadow animate-pulse">
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Coins className="text-yellow-500" />
          Wallet
        </h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
          {balance.currency}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{balance.balance?.toLocaleString('en-IN') || '0'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-200">
          <div className="bg-green-50 rounded p-3">
            <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
              <TrendingUp size={16} />
              <span className="font-medium">Deposits</span>
            </div>
            <p className="text-lg font-bold text-green-700">₹0</p>
          </div>
          <div className="bg-red-50 rounded p-3">
            <div className="flex items-center gap-2 text-red-700 text-sm mb-1">
              <TrendingDown size={16} />
              <span className="font-medium">Withdrawals</span>
            </div>
            <p className="text-lg font-bold text-red-700">₹0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
