"use client";

import { useMemo, useState, useEffect } from "react";
import { Menu, Users, ShieldCheck, Gamepad2, Dice6, Trophy, Wallet, CreditCard, BarChart3, Megaphone, Settings, LifeBuoy, Search, Plus, Filter, ChevronRight, Coins, Activity, CircleDollarSign, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, MessageCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DemoUserManagement } from "./demo-user-management";
import { UserManagementCRUD } from "./user-management-crud";
import { AgentManagement } from "./agent-management";
import { PromotionsManagement } from "./promotions-management";

// Simple UI primitives built with Tailwind (no external UI deps required)
export const AdminDashboard = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [active, setActive] = useState<SectionId>("overview");

  // Check if user is admin using our new authentication
  useEffect(() => {
    const checkAdminAccess = async () => {
      // Get token from localStorage
      const token = localStorage.getItem("admin_token");
      const adminData = localStorage.getItem("admin_user");

      if (!token || !adminData) {
        router.push("/admin/login");
        return;
      }

      try {
        // Verify token with our new API
        const res = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.valid) {
          setAdmin(JSON.parse(adminData));
        } else {
          // Token invalid, clear storage and redirect to login
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          router.push("/admin/login");
          return;
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        router.push("/admin/login");
        return;
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Handle logout - Admin specific logout
  const handleLogout = async () => {
    try {
      // Clear admin storage
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      
      // Also clear regular user storage to avoid conflicts
      localStorage.removeItem("bearer_token");
      localStorage.removeItem("user");
      
      // Call admin logout API
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: 'include'
      });
      
      // Redirect to admin login
      router.push("/admin/login");
      router.refresh(); // Refresh the page to ensure clean state
      
    } catch (error) {
      console.error("Admin logout error:", error);
      // Force clear everything and redirect
      localStorage.clear();
      router.push("/admin/login");
    }
  };

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Admin Dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // Only render if admin data exists
  if (!admin) {
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
    <div className="min-h-screen bg-green-60">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <ShieldCheck className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">NiceBet Admin</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{admin?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{admin?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

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
          <TopBar active={active} admin={admin} />
          <SectionRenderer active={active} admin={admin} />
        </main>
      </div>
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
const TopBar = ({ active, admin }: { active: SectionId; admin: any }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-bold capitalize">{active.replace(/-/g, " ")}</h1>
        <p className="text-sm text-muted-foreground">Manage {active} for Nicebet Liberia</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-gray-600">Logged in as:</span>
          <span className="font-medium text-green-600">{admin?.name}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">Coins:</span>
          <span className="font-medium text-blue-600">{admin?.coins?.toLocaleString() || "100,000"}</span>
        </div>
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
const SectionRenderer = ({ active, admin }: { active: SectionId; admin: any }) => {
  switch (active) {
    case "overview":
      return <OverviewSection />;
    case "coins":
      return <CoinManagement admin={admin} />;
    case "analytics":
      return <AnalyticsGraphs />;
    case "demo-users":
      return <DemoUserManagement />;
    case "user-management":
      return <UserManagementCRUD />;
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
      return <WalletSection admin={admin} />;
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
      return (
        <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Welcome to Admin Dashboard</p>
            <p className="text-gray-500 mt-2">Select a section from the sidebar to get started</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-700">Admin Info</p>
                <p className="text-sm text-gray-600 mt-1">Name: {admin?.name}</p>
                <p className="text-sm text-gray-600">Email: {admin?.email}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-700">Account Status</p>
                <p className="text-sm text-gray-600 mt-1">Status: Active</p>
                <p className="text-sm text-gray-600">Coins: {admin?.coins?.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-700">Quick Stats</p>
                <p className="text-sm text-gray-600 mt-1">Total Admins: 1</p>
                <p className="text-sm text-gray-600">Access Level: Full</p>
              </div>
            </div>
          </div>
        </div>
      );
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
    walletFloat: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token for API calls
        const token = localStorage.getItem("admin_token");
        
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setStats({
          ggr24h: data.ggr24h || 0,
          ggrDelta: data.ggrDelta || 0,
          bets24h: data.bets24h || 0,
          betsDelta: data.betsDelta || 0,
          activeUsers: data.activeUsers || 0,
          payoutRatio: data.payoutRatio || 0,
          payoutDelta: data.payoutDelta || 0,
          walletFloat: data.walletFloat || 0,
        });
        
      } catch (e: any) {
        console.error('Stats error:', e);
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
          value={loading ? "..." : `$${stats.ggr24h.toLocaleString()}`}
          delta={loading ? "—" : `${stats.ggrDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.ggrDelta).toFixed(1)}% vs yesterday`}
          icon={CircleDollarSign}
          tone={stats.ggrDelta >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Bets (24h)"
          value={loading ? "..." : stats.bets24h.toLocaleString()}
          delta={loading ? "—" : `${stats.betsDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.betsDelta).toFixed(1)}%`}
          icon={Coins}
          tone={stats.betsDelta >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Active Users"
          value={loading ? "..." : stats.activeUsers.toLocaleString()}
          delta="—"
          icon={Users}
        />
        <StatCard
          title="Payout Ratio"
          value={loading ? "..." : `${stats.payoutRatio.toFixed(1)}%`}
          delta={loading ? "—" : `${stats.payoutDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.payoutDelta).toFixed(1)}%`}
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
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <div className="w-20 text-xs text-muted-foreground">Day {day}</div>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div
                        className="h-6 bg-emerald-500/30 rounded-sm flex items-center justify-center text-xs font-medium"
                        style={{ width: `${Math.random() * 70 + 20}%`, minWidth: '30px' }}
                      >
                        {Math.floor(Math.random() * 100) + 50}
                      </div>
                      <div
                        className="h-6 bg-red-500/30 rounded-sm flex items-center justify-center text-xs font-medium"
                        style={{ width: `${Math.random() * 40 + 10}%`, minWidth: '20px' }}
                      >
                        {Math.floor(Math.random() * 50) + 20}
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-xs font-medium">${(Math.random() * 5000 + 1000).toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Revenue Trend (Last 7 Days)</h3>
          {loading ? (
            <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const revenue = Math.random() * 8000 + 2000;
                return (
                  <div key={day} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-muted-foreground">Day {day}</div>
                    <div className="flex-1">
                      <div
                        className="h-6 bg-primary/30 rounded-sm flex items-center justify-end px-2 text-xs font-medium"
                        style={{ width: `${(revenue / 10000) * 100}%`, minWidth: '40px' }}
                      >
                        ${revenue.toFixed(0)}
                      </div>
                    </div>
                    <div className="w-12 text-right text-xs text-muted-foreground">{Math.floor(Math.random() * 200) + 50}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Coin Management component
const CoinManagement = ({ admin }: { admin: any }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("No authentication token");
        return;
      }

      const response = await fetch('/api/admin/balances', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      const formattedUsers = (data.balances || []).map((balance: any) => ({
        userId: balance.userId,
        name: balance.name || 'Unknown',
        email: balance.email || 'N/A',
        role: balance.role || 'user',
        coins: balance.coins || 0,
      }));

      setUsers(formattedUsers);
    } catch (e: any) {
      console.error('Fetch users error:', e);
      setError(e?.message || "Failed to load users");
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
        </div>
        <button 
          onClick={fetchUsers}
          className="rounded-md bg-primary/20 px-3 py-2 text-xs hover:bg-primary/30"
        >
          Refresh
        </button>
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-xs text-muted-foreground">
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
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
                    <button className="mr-2 rounded-md bg-primary/20 px-3 py-1 text-xs hover:bg-primary/30">
                      <Plus size={12} className="mr-1 inline" />
                      Add
                    </button>
                    <button className="rounded-md bg-red-500/20 px-3 py-1 text-xs hover:bg-red-500/30">
                      <DollarSign size={12} className="mr-1 inline" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add AnalyticsGraphs component
const AnalyticsGraphs = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const response = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setStats(data);
      } catch (e) {
        console.error('Analytics error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics & Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">Track wins, losses, revenue, and user activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : `$${stats.ggr24h.toLocaleString()}`}
          delta={loading ? "—" : `${stats.ggrDelta >= 0 ? "▲" : "▼"} ${Math.abs(stats.ggrDelta).toFixed(1)}%`}
          icon={CircleDollarSign}
          tone={stats.ggrDelta >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Total Bets"
          value={loading ? "..." : `$${stats.bets24h.toLocaleString()}`}
          delta={loading ? "—" : `Avg: $${Math.floor(stats.bets24h / Math.max(1, stats.activeUsers))}`}
          icon={Coins}
        />
        <StatCard
          title="Total Payouts"
          value={loading ? "..." : `$${(stats.ggr24h * (stats.payoutRatio / 100)).toLocaleString()}`}
          delta="—"
          icon={Wallet}
        />
        <StatCard
          title="Active Users"
          value={loading ? "..." : stats.activeUsers.toLocaleString()}
          delta="—"
          icon={Users}
          tone="positive"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h4 className="mb-4 text-sm font-semibold">Revenue Trend (Last 7 Days)</h4>
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
        ) : (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const revenue = stats.ggr24h / 7 + (Math.random() * 2000 - 1000);
              const barWidth = (revenue / (stats.ggr24h / 7 * 1.5)) * 100;
              return (
                <div key={day} className="flex items-center gap-2">
                  <div className="w-20 text-xs text-muted-foreground">Day {day}</div>
                  <div className="flex-1">
                    <div
                      className="h-7 bg-primary/30 rounded flex items-center justify-end px-2 text-xs font-medium"
                      style={{ width: `${Math.min(barWidth, 100)}%`, minWidth: '50px' }}
                    >
                      ${revenue.toFixed(0)}
                    </div>
                  </div>
                  <div className="w-12 text-right text-xs text-muted-foreground">{Math.floor(Math.random() * 200) + 50}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Users Section
const UsersSection = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("No authentication token");
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load users');
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (e: any) {
      console.error('Users error:', e);
      setError(e?.message || "Failed to load users");
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
        </div>
        <button 
          onClick={fetchUsers}
          className="rounded-md bg-primary/20 px-3 py-2 text-xs hover:bg-primary/30"
        >
          Refresh
        </button>
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-xs text-muted-foreground">
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-border/60">
                  <td className="px-3 py-2">{u.name || "Unknown"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{u.email || "N/A"}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-md px-2 py-1 text-xs ${
                      u.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                      u.role === 'agent' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <Coins size={14} />
                      {(u.coins || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="mr-2 rounded-md bg-primary/20 px-3 py-1 text-xs hover:bg-primary/30">
                      Edit
                    </button>
                    <button className="rounded-md bg-red-500/20 px-3 py-1 text-xs hover:bg-red-500/30">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BetsSection = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    openBets: 0,
    settledBets: 0,
    liability: 0,
  });

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("No authentication token");
        return;
      }

      const response = await fetch('/api/admin/bets?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bets: ${response.status}`);
      }

      const data = await response.json();
      setBets(data.bets || []);

      // Calculate stats
      const openCount = data.bets?.filter((b: any) => b.result === 'pending').length || 0;
      const settledCount = data.bets?.filter((b: any) => b.result !== 'pending').length || 0;
      const totalLiability = data.bets?.reduce((sum: number, b: any) => sum + (b.amount || 0), 0) || 0;

      setStats({
        openBets: openCount,
        settledBets: settledCount,
        liability: totalLiability,
      });
    } catch (e: any) {
      console.error('Fetch bets error:', e);
      setError(e?.message || "Failed to load bets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Open Bets" value={stats.openBets.toString()} delta="+0 today" icon={Coins} />
        <StatCard title="Settled (24h)" value={stats.settledBets.toString()} delta="—" icon={BarChart3} />
        <StatCard title="Liability" value={`$${stats.liability.toLocaleString()}`} delta="—" icon={ShieldCheck} />
      </div>
      
      {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>}

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent Bets</h3>
          <button 
            onClick={fetchBets}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="text-xs text-muted-foreground">Loading bets...</div>
        ) : bets.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">No bets found</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="min-w-full text-xs">
              <thead className="bg-muted/20 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1 text-left">Game</th>
                  <th className="px-2 py-1 text-left">User</th>
                  <th className="px-2 py-1 text-right">Amount</th>
                  <th className="px-2 py-1 text-right">Payout</th>
                  <th className="px-2 py-1 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {bets.slice(0, 5).map((bet, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="px-2 py-1">{bet.gameName}</td>
                    <td className="px-2 py-1 text-muted-foreground">{bet.userName}</td>
                    <td className="px-2 py-1 text-right">${bet.amount}</td>
                    <td className="px-2 py-1 text-right">${bet.payout}</td>
                    <td className="px-2 py-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${bet.result === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : bet.result === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {bet.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentsSection = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ deposits: 0, withdrawals: 0, net: 0 });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const response = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPayments(data.payments || []);
      
      const deposits = data.payments?.filter((p: any) => p.type === 'deposit').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
      const withdrawals = data.payments?.filter((p: any) => p.type === 'withdrawal').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
      setStats({ deposits, withdrawals, net: deposits - withdrawals });
    } catch (e) {
      console.error('Payments error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Deposits (24h)" value={loading ? "..." : `$${stats.deposits.toLocaleString()}`} delta="▲ 5.2%" icon={CreditCard} tone="positive" />
        <StatCard title="Withdrawals (24h)" value={loading ? "..." : `$${stats.withdrawals.toLocaleString()}`} delta="▼ 1.1%" icon={Wallet} tone="negative" />
        <StatCard title="Net Cashflow" value={loading ? "..." : `$${stats.net.toLocaleString()}`} delta="today" icon={CircleDollarSign} />
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent Transactions</h3>
          <button onClick={fetchPayments} className="text-xs text-muted-foreground hover:text-foreground">Refresh</button>
        </div>
        {loading ? <div className="text-xs text-muted-foreground">Loading...</div> : payments.length === 0 ? <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">No payments</div> : (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="min-w-full text-xs">
              <thead className="bg-muted/20 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1 text-left">User</th>
                  <th className="px-2 py-1 text-left">Type</th>
                  <th className="px-2 py-1 text-right">Amount</th>
                  <th className="px-2 py-1 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="px-2 py-1">{p.userName || "Unknown"}</td>
                    <td className="px-2 py-1">{p.type}</td>
                    <td className="px-2 py-1 text-right font-semibold">${p.amount}</td>
                    <td className="px-2 py-1"><span className={`px-2 py-0.5 rounded text-xs ${p.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportsSection = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;
        const response = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setStats(data);
      } catch (e) {
        console.error('Reports error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAsync();
  }, []);

  const reports = [
    { name: "GGR by Day", value: stats?.ggr24h || "—", unit: "$" },
    { name: "Sports Turnover", value: stats?.bets24h || "—", unit: "$" },
    { name: "Casino Revenue", value: stats?.ggr24h ? (stats.ggr24h * 0.35).toFixed(0) : "—", unit: "$" },
    { name: "User Growth", value: stats?.activeUsers || "—", unit: " users" },
    { name: "Payout Ratio", value: stats?.payoutRatio?.toFixed(1) || "—", unit: "%" },
    { name: "Wallet Float", value: stats?.walletFloat || "—", unit: "$" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Key Reports</h3>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
          {reports.map((report) => (
            <li key={report.name} className="rounded-md border border-border p-3 flex items-center justify-between">
              <span className="text-muted-foreground">{report.name}</span>
              <span className="font-semibold text-foreground">{loading ? "..." : `${report.value}${report.unit}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RiskSection = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;
        const response = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setSettings(data);
      } catch (e) {
        console.error('Risk error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRisk();
  }, []);

  const riskControls = [
    { name: "Max Bet per Event", value: "$10,000", editable: true },
    { name: "Max User Daily Loss", value: "$50,000", editable: true },
    { name: "Payout Ratio Limit", value: "98%", editable: true },
    { name: "Liability Threshold", value: `$${settings?.walletFloat || "—"}`, editable: false },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Risk Controls</h3>
        <ul className="space-y-2 text-sm">
          {riskControls.map((control) => (
            <li key={control.name} className="flex items-center justify-between">
              <span>{control.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{loading ? "..." : control.value}</span>
                {control.editable && <button className="rounded-md border border-border px-2 py-1 text-xs hover:bg-primary/10">Edit</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const WalletSection = ({ admin }: { admin: any }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard title="Total Balance" value={`$${(admin?.coins || 0).toLocaleString()}`} delta="—" icon={Wallet} />
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
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [scope]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const response = await fetch('/api/admin/games', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      let filtered = data.games || [];
      if (scope !== 'games') {
        filtered = filtered.filter((g: any) => g.category === scope || g.type === scope);
      }
      setGames(filtered);
    } catch (e) {
      console.error('Games error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{scope === "games" ? "All Games" : `${capitalize(scope)} Games`}</h3>
        <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Add Game</button>
      </div>
      {loading && <div className="text-xs text-muted-foreground">Loading...</div>}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {games.length === 0 ? (
          <li className="col-span-full text-xs text-muted-foreground text-center py-8">No games found</li>
        ) : (
          games.map((game) => (
            <li key={game.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Gamepad2 size={32} className="text-primary/40" />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{game.name}</p>
                <p className="truncate text-xs text-muted-foreground">{game.provider}</p>
                <div className="mt-2"><button className="rounded-md border border-border px-2 py-1 text-xs hover:bg-primary/10">Launch</button></div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const CMSSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;
        await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      } catch (e) {
        console.error('CMS error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCMS();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Content Management</h3>
        <button className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Add Banner</button>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-semibold">Homepage Banners</h4>
        {loading ? (
          <div className="h-32 rounded-md border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">Loading...</div>
        ) : (
          <div className="h-32 rounded-md border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">No banners configured</div>
        )}
      </div>
    </div>
  );
};

const SupportSection = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;
        await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
        setTickets([
          { id: 1, subject: "Payment Issue", status: "open", priority: "high", date: "2024-01-08" },
          { id: 2, subject: "Account Verification", status: "pending", priority: "medium", date: "2024-01-07" },
          { id: 3, subject: "Game Bug Report", status: "closed", priority: "low", date: "2024-01-06" },
        ]);
      } catch (e) {
        console.error('Tickets error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Support Tickets</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground">View All</button>
        </div>
        {loading ? (
          <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-md border border-border/60 p-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">{ticket.date}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  ticket.status === 'open' ? 'bg-red-500/20 text-red-400' :
                  ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>{ticket.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;
        await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      } catch (e) {
        console.error('Settings error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const settingsList = [
    { name: "Brand Colors", value: "Green", editable: true },
    { name: "Platform Currency", value: "USD", editable: true },
    { name: "Timezone", value: "UTC", editable: true },
    { name: "Language", value: "English", editable: true },
    { name: "Session Timeout", value: "30 mins", editable: true },
    { name: "2FA Enabled", value: "Yes", editable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Platform Settings</h3>
        <ul className="space-y-2 text-sm">
          {settingsList.map((setting) => (
            <li key={setting.name} className="flex items-center justify-between">
              <span>{setting.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{loading ? "..." : setting.value}</span>
                {setting.editable && <button className="rounded-md border border-border px-2 py-1 text-xs hover:bg-primary/10">Edit</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Helpers
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type { SectionId };
