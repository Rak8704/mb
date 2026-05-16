"use client";

import { useMemo, useState, useEffect } from "react";
import { Menu, Users, ShieldCheck, Gamepad2, Dice6, Trophy, Wallet, CreditCard, BarChart3, Megaphone, Settings, LifeBuoy, Search, Plus, Filter, ChevronRight, Coins, Activity, CircleDollarSign, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { DemoUserManagement } from "@/components/admin/demo-user-management";
import { UserAgentCRUD } from "@/components/admin/user-agent-crud";
import { AgentManagement } from "@/components/admin/agent-management";
import { PromotionsManagement } from "@/components/admin/promotions-management";
import { useRouter } from "next/navigation";

// Simple UI primitives built with Tailwind (no external UI deps required)
export const AdminDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [active, setActive] = useState<SectionId>("overview");

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isPending) return;

      if (!session?.user) {
        router.push("/admin/login");
        return;
      }

      try {
        const token = localStorage.getItem("bearer_token");
        const res = await fetch(`/api/user/balance?userId=${session.user.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          const role = data.balance?.role || 'user';
          setUserRole(role);

          if (role !== 'admin') {
            router.push("/");
            return;
          }
        } else {
          router.push("/");
          return;
        }
      } catch (error) {
        router.push("/");
        return;
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminAccess();
  }, [session, isPending, router]);

  // Show loading while checking
  if (isPending || isChecking) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-sm text-muted-foreground">Checking permissions...</div>
      </div>
    );
  }

  // Only render if user is admin
  if (userRole !== 'admin') {
    return null;
  }

  const sections: SectionItem[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "coins", label: "Coin Management", icon: Coins },
    { id: "analytics", label: "Analytics & Graphs", icon: BarChart3 },
    { id: "demo-users", label: "Demo Users", icon: Users },

    { id: "user-management", label: "User Management", icon: ShieldCheck },
    { id: "agent-management", label: "Agent Management", icon: Users },
    { id: "social-contacts", label: "Social Contacts", icon: MessageCircle },
    { id: "content", label: "Content Management", icon: Megaphone },
    { id: "sports", label: "Sports", icon: Trophy },
    { id: "live", label: "Live", icon: Menu },
    { id: "casino", label: "Casino", icon: Dice6 },
    { id: "crash", label: "Crash Games", icon: Gamepad2 },
    { id: "games", label: "All Games", icon: Gamepad2 },
    { id: "users", label: "Users", icon: Users },
    { id: "bets", label: "Bets", icon: Coins },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "promotions", label: "Promotions", icon: Megaphone },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "risk", label: "Risk & KYC", icon: ShieldCheck },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "cms", label: "CMS", icon: Settings },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSectionClick = (id: SectionId) => {
    if (id === "social-contacts") {
      router.push("/admin/social-contacts");
    } else if (id === "content") {
      router.push("/admin/content");
    } else {
      setActive(id);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="sticky top-[64px] h-[calc(100vh-64px)] overflow-auto p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">Super Admin</h3>
          <nav className="space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleSectionClick(id)}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${active === id
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
                <ChevronRight size={16} className={`ml-auto transition-transform ${active === id ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="p-4 md:p-6">
        <TopBar active={active} />
        <SectionRenderer active={active} />
      </main>
    </div>
  );
};

// Types
type SectionId =
  | "overview"
  | "coins"
  | "analytics"
  | "demo-users"
  | "user-management"
  | "agent-management"
  | "content"
  | "sports"
  | "live"
  | "casino"
  | "crash"
  | "games"
  | "users"
  | "bets"
  | "payments"
  | "promotions"
  | "reports"
  | "risk"
  | "wallet"
  | "cms"
  | "support"
  | "settings"
  | "social-contacts";

interface SectionItem { id: SectionId; label: string; icon: any }

// Top bar with search and quick actions
const TopBar = ({ active }: { active: SectionId }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-bold capitalize">{active.replace(/-/g, " ")}</h1>
        <p className="text-sm text-muted-foreground">Manage {active} for Nicebet Liberia</p>
      </div>
      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="relative w-full md:w-80">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search across admin..."
            className="w-full rounded-md border border-border bg-input/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
          <Plus size={14} />
          Quick Action
        </button>
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground">
          <Filter size={14} />
          Filters
        </button>
      </div>
    </div>
  );
};

// Section Renderer
const SectionRenderer = ({ active }: { active: SectionId }) => {
  switch (active) {
    case "overview":
      return <OverviewSection />;
    case "coins":
      return <CoinManagement />;
    case "analytics":
      return <AnalyticsGraphs />;
    case "demo-users":
      return <DemoUserManagement />;
    case "user-management":
      return <UserAgentCRUD />;
    case "agent-management":
      return <AgentManagement />;
    case "users":
      return <UsersSection />;
    case "bets":
      return <BetsSection />;
    case "payments":
      return <PaymentsSection />;
    case "promotions":
      return <PromotionsManagement />;
    case "reports":
      return <ReportsSection />;
    case "risk":
      return <RiskSection />;
    case "wallet":
      return <WalletSection />;
    case "sports":
    case "live":
    case "casino":
    case "crash":
    case "games":
      return <GamesSection scope={active} />;
    case "cms":
      return <CMSSection />;
    case "support":
      return <SupportSection />;
    case "settings":
      return <SettingsSection />;
    default:
      return null;
  }
};

// Cards utility
const StatCard = ({ title, value, delta, icon: Icon, tone = "default" }: {
  title: string;
  value: string;
  delta?: string;
  icon?: any;
  tone?: "default" | "positive" | "negative"
}) => {
  const toneClasses =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-red-400"
        : "text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {Icon && <Icon size={16} className="text-muted-foreground" />}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {delta && <div className={`mt-1 text-xs ${toneClasses}`}>{delta}</div>}
    </div>
  );
};

// Overview Section with Real Analytics
const OverviewSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    ggr24h: 0,
    ggrDelta: 0,
    bets24h: 0,
    betsDelta: 0,
    activeUsers: 0,
    payoutRatio: 0,
    payoutDelta: 0,
  });
  const [winsLossesData, setWinsLossesData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;

        // Fetch wins/losses data
        const wlRes = await fetch("/api/admin/stats/wins-losses?days=7", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (wlRes.ok) {
          const wlData = await wlRes.json();
          setWinsLossesData(wlData.stats || []);

          // Calculate stats from wins/losses data
          if (wlData.stats && wlData.stats.length > 0) {
            const today = wlData.stats[0];
            const yesterday = wlData.stats[1] || today;

            setStats({
              ggr24h: today.profit || 0,
              ggrDelta: yesterday.profit ? ((today.profit - yesterday.profit) / yesterday.profit * 100) : 0,
              bets24h: today.totalBets || 0,
              betsDelta: yesterday.totalBets ? ((today.totalBets - yesterday.totalBets) / yesterday.totalBets * 100) : 0,
              activeUsers: 0,
              payoutRatio: today.totalAmount ? (today.totalPayout / today.totalAmount * 100) : 0,
              payoutDelta: 0,
            });
          }
        }

        // Fetch revenue data
        const revRes = await fetch("/api/admin/stats/revenue?days=7", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (revRes.ok) {
          const revData = await revRes.json();
          setRevenueData(revData);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="GGR (24h)"
          value={`$${stats.ggr24h.toLocaleString()}`}
          delta={`${stats.ggrDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.ggrDelta).toFixed(1)}% vs yesterday`}
          icon={CircleDollarSign}
          tone={stats.ggrDelta >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Bets (24h)"
          value={stats.bets24h.toLocaleString()}
          delta={`${stats.betsDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.betsDelta).toFixed(1)}%`}
          icon={Coins}
          tone={stats.betsDelta >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          delta="—"
          icon={Users}
        />
        <StatCard
          title="Payout Ratio"
          value={`${stats.payoutRatio.toFixed(1)}%`}
          delta={`${stats.payoutDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.payoutDelta).toFixed(1)}%`}
          icon={BarChart3}
          tone={stats.payoutDelta >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Wins/Losses Chart */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Wins vs Losses (Last 7 Days)</h3>
          {loading ? (
            <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
          ) : winsLossesData.length > 0 ? (
            <div className="space-y-2">
              {winsLossesData.slice(0, 7).reverse().map((day: any) => (
                <div key={day.date} className="flex items-center gap-2">
                  <div className="w-20 text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div
                        className="h-6 bg-emerald-500/30 rounded-sm flex items-center justify-center text-xs font-medium"
                        style={{ width: `${(day.wonBets / day.totalBets * 100) || 0}%`, minWidth: day.wonBets > 0 ? '30px' : '0' }}
                      >
                        {day.wonBets}
                      </div>
                      <div
                        className="h-6 bg-red-500/30 rounded-sm flex items-center justify-center text-xs font-medium"
                        style={{ width: `${(day.lostBets / day.totalBets * 100) || 0}%`, minWidth: day.lostBets > 0 ? '30px' : '0' }}
                      >
                        {day.lostBets}
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-xs font-medium">${day.profit}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 w-full rounded-md border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">No data available</div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Revenue Trend (Last 7 Days)</h3>
          {loading ? (
            <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
          ) : revenueData && revenueData.daily && revenueData.daily.length > 0 ? (
            <div className="space-y-2">
              {revenueData.daily.slice(0, 7).reverse().map((day: any) => {
                const maxRevenue = Math.max(...revenueData.daily.map((d: any) => d.netRevenue));
                const barWidth = maxRevenue > 0 ? (day.netRevenue / maxRevenue * 100) : 0;
                return (
                  <div key={day.date} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="flex-1">
                      <div
                        className="h-6 bg-primary/30 rounded-sm flex items-center justify-end px-2 text-xs font-medium"
                        style={{ width: `${barWidth}%`, minWidth: '40px' }}
                      >
                        ${day.netRevenue}
                      </div>
                    </div>
                    <div className="w-12 text-right text-xs text-muted-foreground">{day.betCount}</div>
                  </div>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs">
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-semibold text-primary">${revenueData.summary.profit}</span>
              </div>
            </div>
          ) : (
            <div className="h-48 w-full rounded-md border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add CoinManagement component before UsersSection
const CoinManagement = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Coin dialogs
  const [addDialog, setAddDialog] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBalances();
  }, [roleFilter]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const params = roleFilter !== "all" ? `?role=${roleFilter}` : "";
      const res = await fetch(`/api/admin/balances${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load balances");
      const data = await res.json();
      setUsers(data.balances || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() =>
    users.filter(u =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [users, searchQuery]
  );

  const handleAddCoins = async () => {
    if (!addDialog.user || !amount || !session?.user?.id) return;
    const amt = parseInt(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Invalid amount");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/balances/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: addDialog.user.userId,
          amount: amt,
          description: description || "Coins added by admin",
          adminId: session.user.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add coins");
      }

      await fetchBalances();
      setAddDialog({ open: false, user: null });
      setAmount("");
      setDescription("");
    } catch (e: any) {
      setError(e?.message || "Failed to add coins");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveCoins = async () => {
    if (!removeDialog.user || !amount || !session?.user?.id) return;
    const amt = parseInt(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Invalid amount");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/balances/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: removeDialog.user.userId,
          amount: amt,
          description: description || "Coins removed by admin",
          adminId: session.user.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove coins");
      }

      await fetchBalances();
      setRemoveDialog({ open: false, user: null });
      setAmount("");
      setDescription("");
    } catch (e: any) {
      setError(e?.message || "Failed to remove coins");
    } finally {
      setProcessing(false);
    }
  };

  const openAddCoins = (user: any) => {
    setAddDialog({ open: true, user });
    setAmount("");
    setDescription("");
  };

  const openRemoveCoins = (user: any) => {
    setRemoveDialog({ open: true, user });
    setAmount("");
    setDescription("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users"
              className="w-64 rounded-md border border-border bg-input/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-border bg-input/60 px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold">Export CSV</button>
        </div>
      </div>

      {loading && <div className="text-xs text-muted-foreground">Loading users...</div>}
      {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/20 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Role</th>
              <th className="px-3 py-2 text-right font-semibold">Coins</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.userId} className="border-t border-border/60">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md px-2 py-1 text-xs ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                    u.role === 'agent' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    <Coins size={14} />
                    {u.coins?.toLocaleString()}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => openAddCoins(u)} className="mr-2 rounded-md bg-primary/20 px-3 py-1 text-xs hover:bg-primary/30">
                    <Plus size={12} className="mr-1 inline" />
                    Add
                  </button>
                  <button onClick={() => openRemoveCoins(u)} className="rounded-md bg-red-500/20 px-3 py-1 text-xs hover:bg-red-500/30">
                    <DollarSign size={12} className="mr-1 inline" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coins Dialog */}
      <Dialog open={addDialog.open} onOpenChange={(open) => !open && setAddDialog({ open: false, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Coins to {addDialog.user?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount</Label>
              <Input
                id="add-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-desc">Description (Optional)</Label>
              <Input
                id="add-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Welcome bonus"
              />
            </div>
            <div className="rounded-md bg-muted/30 p-3 text-xs">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-semibold">{addDialog.user?.coins?.toLocaleString()} coins</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>New Balance:</span>
                <span className="font-semibold text-primary">
                  {((addDialog.user?.coins || 0) + (parseInt(amount) || 0)).toLocaleString()} coins
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setAddDialog({ open: false, user: null })}
              disabled={processing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCoins}
              disabled={processing || !amount}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {processing ? "Adding..." : "Add Coins"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Coins Dialog */}
      <Dialog open={removeDialog.open} onOpenChange={(open) => !open && setRemoveDialog({ open: false, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Coins from {removeDialog.user?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="remove-amount">Amount</Label>
              <Input
                id="remove-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={removeDialog.user?.coins || 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remove-desc">Description (Optional)</Label>
              <Input
                id="remove-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Penalty deduction"
              />
            </div>
            <div className="rounded-md bg-muted/30 p-3 text-xs">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-semibold">{removeDialog.user?.coins?.toLocaleString()} coins</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>New Balance:</span>
                <span className={`font-semibold ${(removeDialog.user?.coins || 0) - (parseInt(amount) || 0) < 0 ? 'text-red-400' : 'text-primary'}`}>
                  {Math.max(0, (removeDialog.user?.coins || 0) - (parseInt(amount) || 0)).toLocaleString()} coins
                </span>
              </div>
              {(parseInt(amount) || 0) > (removeDialog.user?.coins || 0) && (
                <div className="mt-2 text-red-400">⚠️ Insufficient balance!</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setRemoveDialog({ open: false, user: null })}
              disabled={processing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveCoins}
              disabled={processing || !amount || (parseInt(amount) || 0) > (removeDialog.user?.coins || 0)}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {processing ? "Removing..." : "Remove Coins"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add AnalyticsGraphs component
const AnalyticsGraphs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [winsLosses, setWinsLosses] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [userActivity, setUserActivity] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const [wlRes, revRes, uaRes] = await Promise.all([
        fetch(`/api/admin/stats/wins-losses?days=${days}`, { headers }),
        fetch(`/api/admin/stats/revenue?days=${days}`, { headers }),
        fetch(`/api/admin/stats/user-activity?days=${days}`, { headers }),
      ]);

      if (wlRes.ok) {
        const data = await wlRes.json();
        setWinsLosses(data.stats || []);
      }

      if (revRes.ok) {
        const data = await revRes.json();
        setRevenue(data);
      }

      if (uaRes.ok) {
        const data = await uaRes.json();
        setUserActivity(data);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics & Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">Track wins, losses, revenue, and user activity</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="rounded-md border border-border bg-input/60 px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={60}>Last 60 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>
      )}

      {/* Summary Cards */}
      {revenue && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`$${revenue.summary.profit?.toLocaleString() || 0}`}
            delta={`${revenue.summary.betCount || 0} bets`}
            icon={CircleDollarSign}
            tone="positive"
          />
          <StatCard
            title="Total Bets"
            value={`$${revenue.summary.totalBets?.toLocaleString() || 0}`}
            delta={`Avg: $${revenue.summary.averageBet || 0}`}
            icon={Coins}
          />
          <StatCard
            title="Total Payouts"
            value={`$${revenue.summary.totalPayouts?.toLocaleString() || 0}`}
            delta="—"
            icon={Wallet}
          />
          <StatCard
            title="Active Users"
            value={userActivity?.summary.activeUsersInPeriod?.toLocaleString() || 0}
            delta={`${userActivity?.summary.newUsersInPeriod || 0} new`}
            icon={Users}
            tone="positive"
          />
        </div>
      )}

      {/* Wins vs Losses Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h4 className="mb-4 text-sm font-semibold">Wins vs Losses Trend</h4>
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
        ) : winsLosses.length > 0 ? (
          <div className="space-y-2">
            {winsLosses.slice(0, 15).reverse().map((day: any) => {
              const total = day.totalBets || 1;
              const wonPct = (day.wonBets / total * 100) || 0;
              const lostPct = (day.lostBets / total * 100) || 0;
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div
                        className="h-8 bg-emerald-500/30 rounded flex items-center justify-center text-xs font-medium hover:bg-emerald-500/40 transition-colors"
                        style={{ width: `${wonPct}%`, minWidth: day.wonBets > 0 ? '40px' : '0' }}
                        title={`Won: ${day.wonBets}`}
                      >
                        {day.wonBets > 0 && day.wonBets}
                      </div>
                      <div
                        className="h-8 bg-red-500/30 rounded flex items-center justify-center text-xs font-medium hover:bg-red-500/40 transition-colors"
                        style={{ width: `${lostPct}%`, minWidth: day.lostBets > 0 ? '40px' : '0' }}
                        title={`Lost: ${day.lostBets}`}
                      >
                        {day.lostBets > 0 && day.lostBets}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 text-right text-xs text-muted-foreground">{day.totalBets}</span>
                    <span className={`w-20 text-right text-sm font-semibold ${day.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${day.profit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground">
            No betting data available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="mb-4 text-sm font-semibold">Daily Revenue</h4>
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Loading...</div>
          ) : revenue && revenue.daily && revenue.daily.length > 0 ? (
            <div className="space-y-2">
              {revenue.daily.slice(0, 10).reverse().map((day: any) => {
                const maxRev = Math.max(...revenue.daily.map((d: any) => d.netRevenue));
                const barWidth = maxRev > 0 ? (day.netRevenue / maxRev * 100) : 0;
                return (
                  <div key={day.date} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div
                        className="h-7 bg-primary/30 rounded flex items-center justify-end px-2 text-xs font-medium"
                        style={{ width: `${barWidth}%`, minWidth: '50px' }}
                      >
                        ${day.netRevenue}
                      </div>
                    </div>
                    <div className="w-12 text-right text-xs text-muted-foreground">{day.betCount}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground">
              No revenue data
            </div>
          )}
        </div>

        {/* User Activity Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="mb-4 text-sm font-semibold">User Activity</h4>
          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Loading...</div>
          ) : userActivity && userActivity.daily && userActivity.daily.length > 0 ? (
            <div className="space-y-2">
              {userActivity.daily.slice(0, 10).reverse().map((day: any) => {
                const maxActive = Math.max(...userActivity.daily.map((d: any) => d.activeUsers));
                const activeWidth = maxActive > 0 ? (day.activeUsers / maxActive * 100) : 0;
                return (
                  <div key={day.date} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div
                        className="h-7 bg-blue-500/30 rounded flex items-center justify-end px-2 text-xs font-medium hover:bg-blue-500/40 transition-colors"
                        style={{ width: `${activeWidth}%`, minWidth: '40px' }}
                        title={`Active: ${day.activeUsers}`}
                      >
                        {day.activeUsers}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {day.newUsers > 0 && (
                        <span className="text-emerald-400">+{day.newUsers}</span>
                      )}
                      <span className="w-12 text-right text-muted-foreground">{day.totalUsers}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground">
              No user activity data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Users Section with Coin Management
const UsersSection = () => {
  const { data: session } = useSession();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coin management dialogs
  const [addCoinDialog, setAddCoinDialog] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [removeCoinDialog, setRemoveCoinDialog] = useState<{ open: boolean; user: any | null }>({ open: false, user: null });
  const [coinAmount, setCoinAmount] = useState("");
  const [coinDescription, setCoinDescription] = useState("");
  const [coinProcessing, setCoinProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const roleParam = role !== "all" ? `?role=${role}` : "";
      const res = await fetch(`/api/admin/balances${roleParam}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(Array.isArray(data.balances) ? data.balances : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(
    () =>
      users.filter((u) =>
        u.name?.toLowerCase().includes(q.toLowerCase()) ||
        u.email?.toLowerCase().includes(q.toLowerCase())
      ),
    [q, users]
  );

  const openAddCoins = (user: any) => {
    setAddCoinDialog({ open: true, user });
    setCoinAmount("");
    setCoinDescription("");
  };

  const openRemoveCoins = (user: any) => {
    setRemoveCoinDialog({ open: true, user });
    setCoinAmount("");
    setCoinDescription("");
  };

  const handleAddCoins = async () => {
    if (!addCoinDialog.user || !coinAmount || !session?.user?.id) return;
    const amount = parseInt(coinAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    try {
      setCoinProcessing(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/balances/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: addCoinDialog.user.userId,
          amount,
          description: coinDescription || "Coins added by admin",
          adminId: session.user.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add coins");
      }

      await fetchUsers();
      setAddCoinDialog({ open: false, user: null });
      setCoinAmount("");
      setCoinDescription("");
    } catch (e: any) {
      setError(e?.message || "Failed to add coins");
    } finally {
      setCoinProcessing(false);
    }
  };

  const handleRemoveCoins = async () => {
    if (!removeCoinDialog.user || !coinAmount || !session?.user?.id) return;
    const amount = parseInt(coinAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    try {
      setCoinProcessing(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/balances/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: removeCoinDialog.user.userId,
          amount,
          description: coinDescription || "Coins removed by admin",
          adminId: session.user.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove coins");
      }

      await fetchUsers();
      setRemoveCoinDialog({ open: false, user: null });
      setCoinAmount("");
      setCoinDescription("");
    } catch (e: any) {
      setError(e?.message || "Failed to remove coins");
    } finally {
      setCoinProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users"
              className="w-64 rounded-md border border-border bg-input/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-md border border-border bg-input/60 px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold">Export CSV</button>
        </div>
      </div>

      {loading && <div className="text-xs text-muted-foreground">Loading users...</div>}
      {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/20 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Role</th>
              <th className="px-3 py-2 text-right font-semibold">Coins</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.userId} className="border-t border-border/60">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md px-2 py-1 text-xs ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                    u.role === 'agent' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    <Coins size={14} />
                    {u.coins?.toLocaleString()}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => openAddCoins(u)} className="mr-2 rounded-md bg-primary/20 px-3 py-1 text-xs hover:bg-primary/30">
                    <Plus size={12} className="mr-1 inline" />
                    Add
                  </button>
                  <button onClick={() => openRemoveCoins(u)} className="rounded-md bg-red-500/20 px-3 py-1 text-xs hover:bg-red-500/30">
                    <DollarSign size={12} className="mr-1 inline" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coins Dialog */}
      <Dialog open={addCoinDialog.open} onOpenChange={(open) => !open && setAddCoinDialog({ open: false, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Coins to {addCoinDialog.user?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount</Label>
              <Input
                id="add-amount"
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">Description (Optional)</Label>
              <Input
                id="add-description"
                value={coinDescription}
                onChange={(e) => setCoinDescription(e.target.value)}
                placeholder="e.g., Welcome bonus"
              />
            </div>
            <div className="rounded-md bg-muted/30 p-3 text-xs">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-semibold">{addCoinDialog.user?.coins?.toLocaleString()} coins</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>New Balance:</span>
                <span className="font-semibold text-primary">
                  {((addCoinDialog.user?.coins || 0) + (parseInt(coinAmount) || 0)).toLocaleString()} coins
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setAddCoinDialog({ open: false, user: null })}
              disabled={coinProcessing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCoins}
              disabled={coinProcessing || !coinAmount}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {coinProcessing ? "Adding..." : "Add Coins"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Coins Dialog */}
      <Dialog open={removeCoinDialog.open} onOpenChange={(open) => !open && setRemoveCoinDialog({ open: false, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Coins from {removeCoinDialog.user?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="remove-amount">Amount</Label>
              <Input
                id="remove-amount"
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={removeCoinDialog.user?.coins || 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remove-desc">Description (Optional)</Label>
              <Input
                id="remove-desc"
                value={coinDescription}
                onChange={(e) => setCoinDescription(e.target.value)}
                placeholder="e.g., Penalty deduction"
              />
            </div>
            <div className="rounded-md bg-muted/30 p-3 text-xs">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-semibold">{removeCoinDialog.user?.coins?.toLocaleString()} coins</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>New Balance:</span>
                <span className={`font-semibold ${(removeCoinDialog.user?.coins || 0) - (parseInt(coinAmount) || 0) < 0 ? 'text-red-400' : 'text-primary'}`}>
                  {Math.max(0, (removeCoinDialog.user?.coins || 0) - (parseInt(coinAmount) || 0)).toLocaleString()} coins
                </span>
              </div>
              {(parseInt(coinAmount) || 0) > (removeCoinDialog.user?.coins || 0) && (
                <div className="mt-2 text-red-400">⚠️ Insufficient balance!</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setRemoveCoinDialog({ open: false, user: null })}
              disabled={coinProcessing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveCoins}
              disabled={coinProcessing || !coinAmount || (parseInt(coinAmount) || 0) > (removeCoinDialog.user?.coins || 0)}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {coinProcessing ? "Removing..." : "Remove Coins"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {rows.length} of {users.length}</span>
      </div>
    </div>
  );
};

const BetsSection = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Open Bets" value="1,482" delta="+52 today" icon={Coins} />
        <StatCard title="Settled (24h)" value="6,102" delta="-3%" icon={BarChart3} tone="negative" />
        <StatCard title="Liability" value="$28,430" delta="+2%" icon={ShieldCheck} />
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Recent Bets</h3>
        <div className="h-40 rounded-md border border-dashed border-border/60" />
        <p className="mt-2 text-xs text-muted-foreground">Table placeholder – connect bets API later.</p>
      </div>
    </div>
  );
};

const PaymentsSection = () => {
  const providers = [
    { name: "MTN MoMo", status: "active" },
    { name: "Airtel Money", status: "active" },
    { name: "Stripe", status: "inactive" },
  ];
  const [testing, setTesting] = useState<Record<string, { loading: boolean; ok?: boolean; latencyMs?: number }>>({});

  const handleTest = async (provider: string) => {
    try {
      setTesting((t) => ({ ...t, [provider]: { loading: true } }));
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/payments/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      setTesting((t) => ({ ...t, [provider]: { loading: false, ok: !!data?.ok, latencyMs: data?.latencyMs } }));
    } catch {
      setTesting((t) => ({ ...t, [provider]: { loading: false, ok: false } }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Deposits (24h)" value="$9,420" delta="▲ 5.2%" icon={CreditCard} tone="positive" />
        <StatCard title="Withdrawals (24h)" value="$7,310" delta="▼ 1.1%" icon={Wallet} tone="negative" />
        <StatCard title="Net Cashflow" value="$2,110" delta="today" icon={CircleDollarSign} />
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Payment Providers</h3>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {providers.map((p) => (
            <li key={p.name} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between text-sm">
                <span>{p.name}</span>
                <span className={`text-xs ${p.status === "active" ? "text-emerald-400" : "text-yellow-400"}`}>{p.status}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="rounded-md border border-border px-2 py-1 text-xs">Configure</button>
                <button onClick={() => handleTest(p.name)} className="rounded-md border border-border px-2 py-1 text-xs">
                  {testing[p.name]?.loading ? "Testing..." : "Test"}
                </button>
              </div>
              {testing[p.name] && !testing[p.name].loading && (
                <div className={`mt-2 text-xs ${testing[p.name].ok ? "text-emerald-400" : "text-red-400"}`}>
                  {testing[p.name].ok ? `OK • ${testing[p.name].latencyMs}ms` : "Failed"}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const ReportsSection = () => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Reports</h3>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
        {[
          "GGR by Day",
          "Sports Turnover",
          "Casino Revenue",
          "User Growth",
          "Payment Summary",
          "Risk Exposure",
        ].map((r) => (
          <li key={r} className="rounded-md border border-border p-3">{r}</li>
        ))}
      </ul>
    </div>
  </div>
);

const RiskSection = () => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Risk Controls</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between"><span>Max Bet per Event</span><button className="rounded-md border border-border px-2 py-1 text-xs">Edit</button></li>
        <li className="flex items-center justify-between"><span>Odds Margin</span><button className="rounded-md border border-border px-2 py-1 text-xs">Edit</button></li>
        <li className="flex items-center justify-between"><span>Auto-KYC Threshold</span><button className="rounded-md border border-border px-2 py-1 text-xs">Edit</button></li>
      </ul>
    </div>
  </div>
);

const WalletSection = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard title="Total Balance" value="$214,900" delta="—" icon={Wallet} />
      <StatCard title="Locked Funds" value="$12,340" delta="—" icon={ShieldCheck} />
      <StatCard title="Pending Withdrawals" value="$3,210" delta="—" icon={CreditCard} />
    </div>
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Wallet Transactions</h3>
      <div className="h-40 rounded-md border border-dashed border-border/60" />
      <p className="mt-2 text-xs text-muted-foreground">Connect wallet API later.</p>
    </div>
  </div>
);

const GamesSection = ({ scope }: { scope: string }) => {
  const [games, setGames] = useState(mockGames);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
        const res = await fetch(`/api/admin/games?category=${encodeURIComponent(scope)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Failed to load games");
        const data = await res.json();
        setGames(Array.isArray(data.games) ? data.games : mockGames);
      } catch (e: any) {
        setError(e?.message || "Failed to load games");
        setGames(mockGames);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [scope]);

  const addGame = async () => {
    try {
      setCreating(true);
      const optimistic = { id: `tmp-${Date.now()}`, title: "New Game", provider: "generic", category: scope === "games" ? "casino" : scope } as any;
      setGames((prev) => [optimistic, ...prev]);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ title: optimistic.title, provider: optimistic.provider, category: optimistic.category }),
      });
      const data = await res.json();
      if (res.ok && data?.game) {
        setGames((prev) => [data.game, ...prev.filter((g) => g.id !== optimistic.id)]);
      } else {
        throw new Error("Create failed");
      }
    } catch (e: any) {
      setError(e?.message || "Create failed");
      setGames((prev) => prev.filter((g) => !String(g.id).startsWith("tmp-")));
    } finally {
      setCreating(false);
    }
  };

  const renameGame = async (id: string) => {
    const current = games.find((g) => g.id === id);
    if (!current) return;
    const nextTitle = current.title.includes("(Updated)") ? current.title.replace(" (Updated)", "") : `${current.title} (Updated)`;
    try {
      setSavingIds((s) => ({ ...s, [id]: true }));
      setGames((prev) => prev.map((g) => (g.id === id ? { ...g, title: nextTitle } : g)));
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ id, title: nextTitle }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (e: any) {
      setError(e?.message || "Update failed");
      setGames((prev) => prev.map((g) => (g.id === id ? { ...g, title: current.title } : g)));
    } finally {
      setSavingIds((s) => ({ ...s, [id]: false }));
    }
  };

  const deleteGame = async (id: string) => {
    const snapshot = games;
    try {
      setSavingIds((s) => ({ ...s, [id]: true }));
      setGames((prev) => prev.filter((g) => g.id !== id));
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/games", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (e: any) {
      setError(e?.message || "Delete failed");
      setGames(snapshot);
    } finally {
      setSavingIds((s) => ({ ...s, [id]: false }));
    }
  };

  const items = games;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{scope === "games" ? "All Games" : `${capitalize(scope)} Games`}</h3>
        <button onClick={addGame} disabled={creating} className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{creating ? "Adding..." : "Add Game"}</button>
      </div>
      {loading && <div className="text-xs text-muted-foreground">Loading games...</div>}
      {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((g) => (
          <li key={g.id} className="group overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-video w-full bg-muted/20" />
            <div className="p-3">
              <p className="truncate text-sm font-semibold">{g.title}</p>
              <p className="truncate text-xs text-muted-foreground">{capitalize(g.provider)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button className="rounded-md border border-border px-2 py-1 text-xs">Launch</button>
                <button onClick={() => renameGame(g.id)} disabled={!!savingIds[g.id]} className="rounded-md border border-border px-2 py-1 text-xs">{savingIds[g.id] ? "Saving..." : "Rename"}</button>
                <button onClick={() => deleteGame(g.id)} disabled={!!savingIds[g.id]} className="rounded-md border border-border px-2 py-1 text-xs">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CMSSection = () => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Homepage Banners</h3>
      <div className="h-32 rounded-md border border-dashed border-border/60" />
      <div className="mt-3 flex items-center gap-2">
        <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Upload</button>
        <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold">Reorder</button>
      </div>
    </div>
  </div>
);

const SupportSection = () => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Tickets</h3>
      <div className="h-40 rounded-md border border-dashed border-border/60" />
      <p className="mt-2 text-xs text-muted-foreground">Connect support desk later.</p>
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Platform Settings</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between"><span>Brand Colors</span><button className="rounded-md border border-border px-2 py-1 text-xs">Edit</button></li>
        <li className="flex items-center justify-between"><span>Localization</span><button className="rounded-md border border-border px-2 py-1 text-xs">Edit</button></li>
        <li className="flex items-center justify-between"><span>Auth & Roles</span><button className="rounded-md border border-border px-2 py-1 text-xs">Edit</button></li>
      </ul>
    </div>
  </div>
);

// Helpers & Mock Data
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const mockUsers = [
  { id: 1, name: "John K", email: "john@example.com", role: "user", status: "active" },
  { id: 2, name: "Mary P", email: "mary@example.com", role: "admin", status: "active" },
  { id: 3, name: "Alex T", email: "alex@example.com", role: "agent", status: "pending" },
  { id: 4, name: "Dina R", email: "dina@example.com", role: "user", status: "active" },
  { id: 5, name: "Sam W", email: "sam@example.com", role: "user", status: "pending" },
];

const mockGames = [
  { id: "g1", title: "Aviator", provider: "spribe", category: "crash" },
  { id: "g2", title: "Spaceman", provider: "pragmatic", category: "crash" },
  { id: "g3", title: "Roulette", provider: "evolution", category: "casino" },
  { id: "g4", title: "Blackjack", provider: "evolution", category: "casino" },
  { id: "g5", title: "Football Live", provider: "betradar", category: "sports" },
  { id: "g6", title: "Basketball Live", provider: "betradar", category: "live" },
  { id: "g7", title: "Crash X", provider: "generic", category: "crash" },
  { id: "g8", title: "Slots Bonanza", provider: "pragmatic", category: "casino" },
  { id: "g9", title: "Virtual Tennis", provider: "betradar", category: "sports" },
];

export type { SectionId };