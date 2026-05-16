"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Coins, TrendingUp, TrendingDown, RefreshCw, CreditCard } from "lucide-react";
import { BuyCoinsDialog } from "@/components/payments/buy-coins-dialog";
import { toast } from "sonner";

interface Balance {
  userId: string;
  coins: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string | null;
  gameName: string | null;
  createdAt: string;
}

export const WalletSection = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/en/wallet");
      return;
    }
    if (session?.user) {
      fetchBalance();
    }
  }, [session, isPending, router]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('bearer_token');
      const res = await fetch(`/api/user/balance?userId=${session?.user?.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        if (res.status === 404) {
          // No balance yet, show 0
          setBalance(null);
          setTransactions([]);
          return;
        }
        throw new Error('Failed to load balance');
      }

      const data = await res.json();
      setBalance(data.balance);
      setTransactions(data.recentTransactions || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="animate-spin" size={16} />
            <span>Loading wallet...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const currentCoins = balance?.coins || 0;

  return (
    <>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground">Manage your coins and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="mb-6 rounded-lg border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <div className="mt-2 flex items-center gap-2">
                <Coins className="text-primary" size={32} />
                <span className="text-4xl font-bold">{currentCoins.toLocaleString()}</span>
                <span className="text-xl text-muted-foreground">coins</span>
              </div>
              {balance && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Role: <span className="font-semibold capitalize">{balance.role}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => setBuyDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <CreditCard size={20} />
              Buy Coins
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            onClick={() => setBuyDialogOpen(true)}
            className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold">Add Coins</p>
                <p className="text-xs text-muted-foreground">Purchase more coins</p>
              </div>
            </div>
          </button>

          <button
            onClick={fetchBalance}
            className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-3">
                <RefreshCw className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="font-semibold">Refresh Balance</p>
                <p className="text-xs text-muted-foreground">Update latest balance</p>
              </div>
            </div>
          </button>

          <Link
            href="/en/bets"
            className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-secondary/10 p-3">
                <TrendingDown className="text-secondary" size={20} />
              </div>
              <div>
                <p className="font-semibold">View Bets</p>
                <p className="text-xs text-muted-foreground">Check betting history</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button
              onClick={fetchBalance}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <Coins className="mx-auto mb-3 text-muted-foreground" size={48} />
              <p className="text-sm text-muted-foreground">No transactions yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start playing games to see your transaction history
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        tx.amount > 0
                          ? 'bg-emerald-500/10'
                          : 'bg-red-500/10'
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <TrendingUp className="text-emerald-400" size={16} />
                      ) : (
                        <TrendingDown className="text-red-400" size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {tx.description || tx.type.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      {tx.gameName && (
                        <p className="text-xs text-muted-foreground">{tx.gameName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-right font-mono font-semibold ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/en/account" className="text-primary underline">
            Back to Account
          </Link>
        </p>
      </div>

      <BuyCoinsDialog
        open={buyDialogOpen}
        onOpenChange={setBuyDialogOpen}
        onSuccess={fetchBalance}
      />
    </>
  );
};

export default WalletSection;