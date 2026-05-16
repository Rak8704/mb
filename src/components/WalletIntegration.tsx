// components/WalletIntegration.tsx
'use client';

import { useWallet } from '@/hooks/useWallet';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Wallet Integration Component
 * Shows user's gaming wallet balance with quick actions
 */
export function WalletIntegration() {
  const { data: session } = useSession();
  const { balance, loading, refreshBalance } = useWallet();

  if (!session?.user || !balance) {
    return null;
  }

  return (
    <div className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet size={24} />
          <span className="font-semibold">Gaming Wallet</span>
        </div>
        <button
          onClick={() => refreshBalance()}
          disabled={loading}
          className="p-1 hover:bg-blue-500 rounded transition disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin">⟳</div>
          ) : (
            '↻'
          )}
        </button>
      </div>

      <div className="text-3xl font-bold mb-4">
        ₹{balance.balance?.toLocaleString('en-IN') || '0'}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/en/wallet"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-center text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <TrendingUp size={16} />
          Deposit
        </Link>
        <Link
          href="/en/wallet"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-center text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <TrendingDown size={16} />
          Withdraw
        </Link>
      </div>
    </div>
  );
}
