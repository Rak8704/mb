"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { GameLauncher } from "./game-launcher";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AdminDashboard = () => {
  // Tabs
  const tabs = [
    "Overview",
    "Games",
    "Users",
    "Bets",
    "Wallet",
    "Promotions",
    "Content",
    "Settings",
  ] as const;
  type Tab = (typeof tabs)[number];
  const [active, setActive] = useState<Tab>("Overview");

  // Launcher (Games)
  const [gameUrl, setGameUrl] = useState("");
  const [launchUrl, setLaunchUrl] = useState<string | undefined>();
  const [gameTitle, setGameTitle] = useState("Custom Game");

  // Data Fetching
  const { data: stats, isLoading: statsLoading } = useSWR('/api/admin/stats', fetcher);

  const [userQuery, setUserQuery] = useState("");
  const { data: usersData, isLoading: usersLoading } = useSWR(`/api/admin/users?search=${userQuery}`, fetcher);

  const { data: betsData, isLoading: betsLoading } = useSWR('/api/admin/bets', fetcher);

  const { data: promosData, mutate: mutatePromos, isLoading: promosLoading } = useSWR('/api/admin/promotions', fetcher);

  // Promotions State
  const [promoTitle, setPromoTitle] = useState("");
  const [promoCode, setPromoCode] = useState(""); // We'll use this as description or button text for now as schema differs
  const [promoImage, setPromoImage] = useState("https://placehold.co/600x400");

  const addPromo = async () => {
    if (!promoTitle) return toast.error("Title is required");

    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promoTitle,
          imageUrl: promoImage,
          description: promoCode, // Using code input as description for now
          isActive: true
        })
      });

      if (!res.ok) throw new Error('Failed to create promotion');

      toast.success("Promotion created");
      setPromoTitle("");
      setPromoCode("");
      mutatePromos();
    } catch (e) {
      toast.error("Error creating promotion");
    }
  };

  const togglePromo = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/promotions?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      mutatePromos();
      toast.success("Promotion updated");
    } catch (e) {
      toast.error("Error updating promotion");
    }
  };

  const deletePromo = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
      mutatePromos();
      toast.success("Promotion deleted");
    } catch (e) {
      toast.error("Error deleting promotion");
    }
  };

  // Settings
  const [maintenance, setMaintenance] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-md border px-3 py-1 text-sm transition-colors ${active === t ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-accent"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Panels */}
      {active === "Overview" && (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AdminStat title="Active Users" value={stats?.activeUsers ?? "..."} loading={statsLoading} />
          <AdminStat title="Total Bets" value={stats?.bets24h ?? "..."} loading={statsLoading} />
          <AdminStat title="Wallet Float" value={`$${stats?.walletFloat?.toFixed(2) ?? "..."}`} loading={statsLoading} />
          <AdminStat title="GGR (Total)" value={`$${stats?.ggr24h?.toFixed(2) ?? "..."}`} loading={statsLoading} />

          <div className="col-span-full rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
              <QuickLink href="/en/sports" label="Sports" />
              <QuickLink href="/en/sports?page=live" label="Live Sports" />
              <QuickLink href="/en/games/casino" label="Casino" />
              <QuickLink href="/en/games/casino-live" label="Live Casino" />
              <QuickLink href="/en/games/crash-games" label="Crash Games" />
              <QuickLink href="/en/virtuals" label="Virtuals" />
              <QuickLink href="/en/lottery" label="Lottery" />
              <QuickLink href="/en/promotions" label="Promotions" />
              <QuickLink href="/en/wallet" label="Wallet" />
              <QuickLink href="/en/bets" label="Bets" />
              <QuickLink href="/en/account" label="Accounts" />
              <QuickLink href="/" label="Homepage" />
            </div>
          </div>
        </section>
      )}

      {active === "Games" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Game Launcher Tester</h3>
            <p className="mb-3 text-sm text-muted-foreground">Paste a launch URL from your backend to test embedding.</p>
            <div className="mb-3 grid gap-2">
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://provider.example.com/launch?token=..."
                value={gameUrl}
                onChange={(e) => setGameUrl(e.target.value)}
              />
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Game Title (optional)"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setLaunchUrl(gameUrl || undefined)}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Launch
                </button>
                <button
                  onClick={() => setLaunchUrl(undefined)}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="rounded-md border bg-background p-2">
              {launchUrl ? (
                <GameLauncher title={gameTitle || "Game"} gameUrl={launchUrl} />
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  Enter a game URL and click Launch to preview here
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Featured Game Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <QuickLink href="/en/games/crash-games/play/33194/real" label="Aviator (real)" />
              <QuickLink href="/en/games/crash-games/play/22461/real" label="Spaceman (real)" />
              <QuickLink href="/en/games/casino" label="Casino Lobby" />
              <QuickLink href="/en/games/casino-live" label="Live Casino Lobby" />
              <QuickLink href="/en/games/crash-games" label="Crash Games" />
              <QuickLink href="/en/esports" label="E-Sports" />
            </div>
          </div>
        </section>
      )}

      {active === "Users" && (
        <section className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Users</h3>
            <input
              className="w-60 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search users..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
          </div>
          <div className="overflow-auto">
            {usersLoading ? (
              <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Coins</th>
                    <th className="p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((u: any) => (
                    <tr key={u.id} className="border-b/50">
                      <td className="p-2 font-mono text-xs">{u.id.substring(0, 8)}...</td>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-2 font-mono">{u.coins}</td>
                      <td className="p-2 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {usersData?.users?.length === 0 && (
                    <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No users found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {active === "Bets" && (
        <section className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Bets</h3>
          </div>
          <div className="overflow-auto">
            {betsLoading ? (
              <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-2">ID</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Game</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Payout</th>
                    <th className="p-2">Result</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {betsData?.bets?.map((b: any) => (
                    <tr key={b.id} className="border-b/50">
                      <td className="p-2 font-mono text-xs">{b.id}</td>
                      <td className="p-2">{b.userName || b.userId.substring(0, 8)}</td>
                      <td className="p-2">{b.gameName}</td>
                      <td className="p-2">${b.amount.toFixed(2)}</td>
                      <td className="p-2">${b.payout.toFixed(2)}</td>
                      <td className="p-2">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${b.result === "pending"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : b.result === "win"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                        >
                          {b.result}
                        </span>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {betsData?.bets?.length === 0 && (
                    <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No bets found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {active === "Wallet" && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Wallet Management</h3>
            <p className="text-sm text-muted-foreground">
              Global wallet stats are available in the Overview tab.
              Individual wallet management should be done via the Users tab (coming soon).
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Wallet Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <QuickLink href="/en/wallet" label="Wallet Page" />
              <QuickLink href="/en/bets" label="Bets Page" />
              <QuickLink href="/en/account" label="Accounts" />
            </div>
          </div>
        </section>
      )}

      {active === "Promotions" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Create Promotion</h3>
            <div className="mb-3 grid gap-2">
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Title"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
              />
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Description / Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Image URL"
                value={promoImage}
                onChange={(e) => setPromoImage(e.target.value)}
              />
              <button onClick={addPromo} className="w-fit rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                Add Promotion
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Promotions</h3>
            <div className="overflow-auto">
              {promosLoading ? (
                <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-2">Title</th>
                      <th className="p-2">Active</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promosData?.promotions?.map((p: any) => (
                      <tr key={p.id} className="border-b/50">
                        <td className="p-2">{p.title}</td>
                        <td className="p-2">{p.isActive ? "Yes" : "No"}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => togglePromo(p.id, p.isActive)} className="rounded-md border px-2 py-1 text-xs hover:bg-accent">
                            {p.isActive ? "Disable" : "Enable"}
                          </button>
                          <button onClick={() => deletePromo(p.id)} className="rounded-md border border-red-500/50 px-2 py-1 text-xs text-red-500 hover:bg-red-500/10">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {promosData?.promotions?.length === 0 && (
                      <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No promotions found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}

      {active === "Content" && (
        <section className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 text-lg font-semibold">Site Content Shortcuts</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <QuickLink href="/en/promotions" label="Promotions" />
            <QuickLink href="/en/live" label="Live" />
            <QuickLink href="/en/virtuals" label="Virtuals" />
            <QuickLink href="/en/lottery" label="Lottery" />
            <QuickLink href="/en/esports" label="E-Sports" />
            <QuickLink href="/" label="Homepage" />
          </div>
        </section>
      )}

      {active === "Settings" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Maintenance Mode</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Toggle a site-wide local setting (stored in browser) for testing banners or behavior.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm">Status:</span>
              <span className={`rounded px-2 py-0.5 text-xs ${maintenance ? "bg-yellow-600/20 text-yellow-400" : "bg-green-600/20 text-green-400"}`}>
                {maintenance ? "ON" : "OFF"}
              </span>
              <button onClick={() => setMaintenance((x) => !x)} className="rounded-md border px-3 py-2 text-sm hover:bg-accent">
                Toggle
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-lg font-semibold">Developer Tools</h3>
            <div className="flex flex-wrap gap-2">
              <QuickLink href="/api/auth" label="Auth API" />
              <QuickLink href="/api" label="API Root" />
              <QuickLink href="/en/bets" label="Bets UI" />
              <QuickLink href="/en/wallet" label="Wallet UI" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const AdminStat = ({ title, value, loading }: { title: string; value: string; loading?: boolean }) => (
  <div className="rounded-lg border bg-card p-4">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-2xl font-bold flex items-center gap-2">
      {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : value}
    </div>
  </div>
);

const QuickLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="rounded-md border bg-background px-3 py-2 text-center text-sm hover:bg-accent"
  >
    {label}
  </Link>
);