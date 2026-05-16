"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import { useWallet } from "@/hooks/useWallet";
import { useState, useEffect } from "react";
import { 
  Copy, 
  Edit, 
  RefreshCw, 
  Trophy, 
  FileText, 
  TrendingUp, 
  CreditCard,
  Download,
  UserPlus,
  Gift,
  Percent,
  Mail,
  MessageSquare,
  Phone,
  LogOut,
  Shield,
  User,
  Target,
  ArrowLeft,
  Wallet,
  Coins
} from "lucide-react";
import { toast } from "sonner";

export const AccountSection = () => {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const { balance: walletBalance, loading: walletLoading, refreshBalance } = useWallet();
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showEditNickname, setShowEditNickname] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchBalance();
      setNickname(session.user.name || session.user.id || "User");
    }
  }, [session]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
    }
  }, [session, isPending, router]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch("/api/user/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    await fetchBalance();
    setTimeout(() => setIsRefreshing(false), 500);
    toast.success("Balance refreshed");
  };

  const handleCopyUserId = () => {
    if (session?.user?.id) {
      navigator.clipboard.writeText(session.user.id);
      toast.success("User ID copied!");
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    const { error } = await authClient.signOut();
    if (!error) {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const menuItems = [
    { 
      icon: Trophy, 
      label: "Reward Center", 
      href: "/en/wallet",
      color: "#ffd700"
    },
    { 
      icon: FileText, 
      label: "Betting Record", 
      href: "/en/bets",
      color: "#ff8c00"
    },
    { 
      icon: TrendingUp, 
      label: "Profit And Loss", 
      href: "/en/bets",
      color: "#ff8c00"
    },
    { 
      icon: Download, 
      label: "Deposit Record", 
      href: "/en/wallet",
      color: "#ff8c00"
    },
    { 
      icon: CreditCard, 
      label: "Withdrawal Record", 
      href: "/en/wallet",
      color: "#ff8c00"
    },
    { 
      icon: FileText, 
      label: "Account Record", 
      href: "/en/wallet",
      color: "#ff8c00"
    },
    { 
      icon: User, 
      label: "My Account", 
      href: "/en/account",
      color: "#ff8c00"
    },
    { 
      icon: Shield, 
      label: "Security Center", 
      href: "/en/account",
      color: "#ff8c00"
    },
    { 
      icon: UserPlus, 
      label: "Invite Friends", 
      href: "/en/invite",
      color: "#ff8c00"
    },
    { 
      icon: Target, 
      label: "Mission", 
      href: "/en/promotions",
      badge: true,
      color: "#ff8c00"
    },
    { 
      icon: Percent, 
      label: "Rebate", 
      href: "/en/promotions",
      color: "#ff8c00"
    },
    { 
      icon: Mail, 
      label: "Internal Message", 
      href: "/en/account",
      badge: true,
      color: "#ff8c00"
    },
    { 
      icon: MessageSquare, 
      label: "Suggestion", 
      href: "/en/account",
      color: "#ff8c00"
    },
    { 
      icon: Download, 
      label: "Download APP", 
      onClick: () => toast.info("App download coming soon!"),
      color: "#ff8c00"
    },
    { 
      icon: Phone, 
      label: "Customer Service", 
      onClick: () => toast.info("Customer service available 24/7"),
      color: "#ff8c00"
    },
    { 
      icon: LogOut, 
      label: "Logout", 
      onClick: handleSignOut,
      color: "#ff0000"
    },
  ];

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-[#333333]">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-white p-2 hover:bg-[#333333] rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white">My Account</h1>
          <Link
            href="/login"
            className="bg-[#ff0000] text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-1"
          >
            <span className="text-lg">✓</span>
            Sign In
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-6 border border-[#333333] shadow-xl">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff8c00] to-[#ff6600] p-1">
              <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-2xl font-bold">
                {nickname.charAt(0).toUpperCase()}
              </div>
            </div>
            {/* VIP Badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-black px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Trophy size={12} />
              VIP0
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            {/* User ID */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-lg font-mono">{session.user.id}</span>
              <button
                onClick={handleCopyUserId}
                className="p-1.5 hover:bg-[#333333] rounded transition-colors"
              >
                <Copy size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Nickname */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400 text-sm">Nickname:</span>
              <span className="text-white text-sm">{nickname}</span>
              <button
                onClick={() => setShowEditNickname(true)}
                className="p-1 hover:bg-[#333333] rounded transition-colors"
              >
                <Edit size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Balance */}
            <div className="flex items-center gap-3">
              <span className="text-white text-3xl font-bold">৳ {balance.toFixed(2)}</span>
              <button
                onClick={handleRefreshBalance}
                disabled={isRefreshing}
                className="p-2 hover:bg-[#333333] rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw 
                  size={20} 
                  className={`text-gray-400 ${isRefreshing ? "animate-spin" : ""}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Widget */}
        {walletBalance && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <Wallet size={16} />
                  Gaming Wallet
                </p>
                <p className="text-2xl font-bold mt-1">
                  ₹{walletBalance.balance?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
              <button
                onClick={() => refreshBalance()}
                disabled={walletLoading}
                className="p-2 hover:bg-blue-400 rounded-full transition disabled:opacity-50"
              >
                <RefreshCw 
                  size={20} 
                  className={walletLoading ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Link
            href="/en/wallet"
            className="bg-gradient-to-br from-[#333333] to-[#2a2a2a] hover:from-[#3a3a3a] hover:to-[#333333] rounded-xl py-3 text-center text-white font-medium transition-all border border-[#444444]"
          >
            Deposit
          </Link>
          <Link
            href="/en/wallet"
            className="bg-gradient-to-br from-[#333333] to-[#2a2a2a] hover:from-[#3a3a3a] hover:to-[#333333] rounded-xl py-3 text-center text-white font-medium transition-all border border-[#444444]"
          >
            Withdrawal
          </Link>
          <Link
            href="/en/wallet"
            className="bg-gradient-to-br from-[#333333] to-[#2a2a2a] hover:from-[#3a3a3a] hover:to-[#333333] rounded-xl py-3 text-center text-white font-medium transition-all border border-[#444444]"
          >
            My Cards
          </Link>
        </div>
      </div>

      {/* Member Center */}
      <div className="px-4 mt-6">
        <div className="bg-[#2a2a2a] rounded-t-2xl px-4 py-3 border-b border-[#333333]">
          <h2 className="text-white font-medium">Member Center</h2>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-b-2xl p-4 grid grid-cols-4 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const handleClick = () => {
              if (item.onClick) {
                item.onClick();
              } else if (item.href) {
                router.push(item.href);
              }
            };

            return (
              <button
                key={index}
                onClick={handleClick}
                className="flex flex-col items-center gap-2 p-2 hover:bg-[#2a2a2a] rounded-xl transition-colors relative"
              >
                {/* Badge */}
                {item.badge && (
                  <div className="absolute -top-1 right-2 w-5 h-5 bg-[#ff0000] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                )}
                
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fff5e6] to-[#ffe6cc] flex items-center justify-center">
                  <Icon size={24} style={{ color: item.color }} />
                </div>
                
                {/* Label */}
                <span className="text-white text-xs text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AccountSection;