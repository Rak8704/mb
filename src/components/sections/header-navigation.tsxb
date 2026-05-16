"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Wallet, Coins, Shield } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BuyCoinsDialog } from "@/components/payments/buy-coins-dialog";
import Image from "next/image";

export const HeaderNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [coinBalance, setCoinBalance] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchBalance();
    }
  }, [session]);

  const fetchBalance = async () => {
    if (!session?.user) return;
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch(`/api/user/balance?userId=${session.user.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setCoinBalance(data.balance?.coins || 0);
        setUserRole(data.balance?.role || 'user');
      }
    } catch (error) {
      // Balance fetch failed
    }
  };

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      setCoinBalance(null);
      setUserRole(null);
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="JK222 Logo"
                width={250}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/en/sports" className="text-sm font-medium hover:text-primary transition-colors">Sports</Link>
              <Link href="/en/live" className="text-sm font-medium hover:text-primary transition-colors">Live</Link>
              <Link href="/en/trade" className="text-sm font-medium hover:text-primary transition-colors">Trade</Link>
              <Link href="/en/live-odds" className="text-sm font-medium hover:text-primary transition-colors">Live Odds</Link>
              <Link href="/en/games/casino" className="text-sm font-medium hover:text-primary transition-colors">Casino</Link>
              <Link href="/en/virtuals" className="text-sm font-medium hover:text-primary transition-colors">Virtual</Link>
              <Link href="/en/lottery" className="text-sm font-medium hover:text-primary transition-colors">Lottery</Link>
              <Link href="/demo" className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors">🎮 Demo</Link>
            </nav>

            <div className="flex items-center gap-3">
              {!isPending && session?.user ? (
                <>
                  {coinBalance !== null && (
                    <button
                      onClick={() => setBuyDialogOpen(true)}
                      className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted"
                    >
                      <Coins className="text-primary" size={16} />
                      <span className="font-mono font-semibold">{coinBalance.toLocaleString()}</span>
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted"
                    >
                      <User size={16} />
                      <span className="hidden md:inline">{session.user.name}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-card shadow-lg">
                        <div className="p-2">
                          <Link href="/en/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted">
                            <User size={14} />Account
                          </Link>
                          <Link href="/en/wallet" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted">
                            <Wallet size={14} />Wallet
                          </Link>
                          <Link href="/en/bets" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted">
                            <Coins size={14} />My Bets
                          </Link>

                          <button onClick={() => { setUserMenuOpen(false); handleSignOut(); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 transition-colors hover:bg-muted">
                            <LogOut size={14} />Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/admin/login" className="rounded-md border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted flex items-center gap-1">
                    <Shield size={14} />
                    Admin
                  </Link>
                  <Link href="/login" className="rounded-md border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted">Login</Link>
                  <Link href="/register" className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Register</Link>
                </div>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-card md:hidden">
            <nav className="container py-4">
              <div className="space-y-2">
                {session?.user && coinBalance !== null && (
                  <button onClick={() => { setBuyDialogOpen(true); setMobileMenuOpen(false); }} className="flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2">
                    <span className="text-sm font-medium">Coin Balance</span>
                    <span className="flex items-center gap-2">
                      <Coins className="text-primary" size={16} />
                      <span className="font-mono font-semibold">{coinBalance.toLocaleString()}</span>
                    </span>
                  </button>
                )}
                <MobileLink href="/en/sports" onClick={() => setMobileMenuOpen(false)}>Sports</MobileLink>
                <MobileLink href="/en/live" onClick={() => setMobileMenuOpen(false)}>Live</MobileLink>
                <MobileLink href="/en/trade" onClick={() => setMobileMenuOpen(false)}>Trade</MobileLink>
                <MobileLink href="/en/live-odds" onClick={() => setMobileMenuOpen(false)}>Live Odds</MobileLink>
                <MobileLink href="/en/games/casino" onClick={() => setMobileMenuOpen(false)}>Casino</MobileLink>
                <MobileLink href="/en/games/crash-games" onClick={() => setMobileMenuOpen(false)}>Crash Games</MobileLink>
                <MobileLink href="/en/lottery" onClick={() => setMobileMenuOpen(false)}>Lottery</MobileLink>
                {session?.user && (
                  <>
                    <div className="my-2 border-t border-border" />
                    <MobileLink href="/en/account" onClick={() => setMobileMenuOpen(false)}>Account</MobileLink>
                    <MobileLink href="/en/wallet" onClick={() => setMobileMenuOpen(false)}>Wallet</MobileLink>
                    <MobileLink href="/en/bets" onClick={() => setMobileMenuOpen(false)}>My Bets</MobileLink>

                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <BuyCoinsDialog
        open={buyDialogOpen}
        onOpenChange={setBuyDialogOpen}
        onSuccess={() => {
          fetchBalance();
          toast.success("Coins added to your wallet!");
        }}
      />
    </>
  );
};

const MobileLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) => (
  <Link href={href} onClick={onClick} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted">
    {children}
  </Link>
);