"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Users,
  TrendingUp,
  User2,
  Link2,
  Eye,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  Network,
  RefreshCw,
} from "lucide-react";

interface SystemStats {
  totalUsers: number;
  totalAgents: number;
  usersWithAgents: number;
  totalReferrals: number;
  orphanedUsers: number;
}

interface AgentWithStats {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredCount: number;
  coins: number;
  createdAt: string;
}

interface UserWithAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  coins: number;
  agentId: string | null;
  agentName: string | null;
}

export const ReferralSystemDashboard = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [agents, setAgents] = useState<AgentWithStats[]>([]);
  const [users, setUsers] = useState<UserWithAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    agent: AgentWithStats | null;
  }>({ open: false, agent: null });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemStats();
    fetchAgents();
    fetchUsers();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch("/api/admin/referral-system/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch("/api/admin/referral-system/agents", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch("/api/admin/referral-system/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchSystemStats(), fetchAgents(), fetchUsers()]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Code copied!");
  };

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading referral system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Referral System Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage users, agents, and referral tracking
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Agents</p>
                  <p className="text-2xl font-bold">{stats.totalAgents}</p>
                </div>
                <User2 className="h-8 w-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">With Agent</p>
                  <p className="text-2xl font-bold">{stats.usersWithAgents}</p>
                </div>
                <Link2 className="h-8 w-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Referrals</p>
                  <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className={stats.orphanedUsers > 0 ? "border-yellow-200" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unassigned</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.orphanedUsers}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agents Section */}
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>
              {agents.length} agents managing users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-500">{agent.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {agent.referredCount} referrals
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          💰 {agent.coins}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewDialog({ open: true, agent })}
                        className="p-2 hover:bg-blue-100 rounded"
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleCopyCode(agent.referralCode)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Copy referral code"
                      >
                        {copiedCode === agent.referralCode ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No agents found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Without Agents Section */}
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Users</CardTitle>
            <CardDescription>
              {users.filter((u) => !u.agentId).length} users without agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">
                  {stats?.orphanedUsers || 0} users need assignment
                </p>
                <p className="text-yellow-800 text-xs mt-1">
                  These users have no agent assigned. They will be auto-assigned
                  when they use a referral code or when system reassigns them.
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users
                .filter((u) => !u.agentId)
                .slice(0, 5)
                .map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        👤 {user.role}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        💰 {user.coins}
                      </span>
                    </div>
                  </div>
                ))}
              {users.filter((u) => !u.agentId).length > 5 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  +{users.filter((u) => !u.agentId).length - 5} more...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Complete user list with agent assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Name</th>
                    <th className="text-left py-2 px-3">Email</th>
                    <th className="text-left py-2 px-3">Role</th>
                    <th className="text-left py-2 px-3">Agent</th>
                    <th className="text-left py-2 px-3">Coins</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 20).map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium">{user.name}</td>
                      <td className="py-3 px-3 text-gray-600">{user.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === "agent"
                              ? "bg-green-100 text-green-700"
                              : user.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {user.agentName ? (
                          <div className="text-sm">
                            <p className="font-medium">{user.agentName}</p>
                            <p className="text-xs text-gray-500">
                              {user.agentId}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-green-600">
                          {user.coins}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="h-2 w-2 rounded-full bg-green-600"></span>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length > 20 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  Showing 20 of {filteredUsers.length} users
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) =>
          setViewDialog({ open, agent: open ? viewDialog.agent : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              {viewDialog.agent?.name} - {viewDialog.agent?.email}
            </DialogDescription>
          </DialogHeader>

          {viewDialog.agent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Name</p>
                  <p className="font-semibold">{viewDialog.agent.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Email</p>
                  <p className="font-semibold text-sm">
                    {viewDialog.agent.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Total Coins
                  </p>
                  <p className="font-semibold text-green-600">
                    {viewDialog.agent.coins}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Referrals</p>
                  <p className="font-semibold text-blue-600">
                    {viewDialog.agent.referredCount}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-2">
                  Referral Code
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white border rounded px-3 py-2 font-mono text-sm">
                    {viewDialog.agent.referralCode}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyCode(viewDialog.agent?.referralCode || "")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-600 font-medium mb-2">
                  Created
                </p>
                <p className="text-sm">
                  {new Date(viewDialog.agent.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, agent: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferralSystemDashboard;
