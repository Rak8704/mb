"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, UserPlus, Edit, Trash2, Shield, Ban, CheckCircle, Eye, Mail, Calendar, Users, Copy, DollarSign, Trophy, TrendingUp, BarChart3, Zap } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: string;
    role: string;
    coins: number;
    status: string;
}

interface ReferralUser {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    status: string;
    rewardAmount: number;
    joinedAt: string;
}

interface SystemStats {
    totalUsers: number;
    totalAgents: number;
    usersWithAgents: number;
    totalReferrals: number;
    orphanedUsers: number;
}

export const AgentManagement = () => {
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState<SystemStats>({
        totalUsers: 0,
        totalAgents: 0,
        usersWithAgents: 0,
        totalReferrals: 0,
        orphanedUsers: 0,
    });

    // Dialogs
    const [viewDialog, setViewDialog] = useState<{ open: boolean; agent: User | null }>({ open: false, agent: null });
    const [createDialog, setCreateDialog] = useState(false);
    const [referralsLoading, setReferralsLoading] = useState(false);
    const [agentReferrals, setAgentReferrals] = useState<ReferralUser[]>([]);
    const [agentCode, setAgentCode] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "agent",
        initialCoins: "1000",
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchAgents();
        fetchReferralStats();
    }, []);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("bearer_token");
            const params = new URLSearchParams();
            params.append("role", "agent");

            const res = await fetch(`/api/admin/users?${params.toString()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setAgents(data.users || []);
            } else {
                toast.error("Failed to load agents");
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
            toast.error("Error loading agents");
        } finally {
            setLoading(false);
        }
    };

    const fetchReferralStats = async () => {
        try {
            setStatsLoading(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/referral-system/stats", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data.stats || {
                    totalUsers: 0,
                    totalAgents: 0,
                    usersWithAgents: 0,
                    totalReferrals: 0,
                    orphanedUsers: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchAgentDetails = async (agentId: string) => {
        try {
            setReferralsLoading(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/admin/agents/referrals?agentId=${agentId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setAgentCode(data.referralCode);
                setAgentReferrals(data.referrals || []);
            } else {
                toast.error("Failed to load agent details");
            }
        } catch (error) {
            console.error("Error fetching agent details:", error);
            toast.error("Error loading agent details");
        } finally {
            setReferralsLoading(false);
        }
    };

    const handleCreateAgent = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Agent created successfully!");
                setCreateDialog(false);
                setFormData({ name: "", email: "", password: "", role: "agent", initialCoins: "1000" });
                fetchAgents();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to create agent");
            }
        } catch (error) {
            toast.error("Error creating agent");
        } finally {
            setProcessing(false);
        }
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.status === "active" ? "suspended" : "active";

        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/users/toggle-status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    userId: user.id,
                    status: newStatus,
                }),
            });

            if (res.ok) {
                toast.success(`Agent ${newStatus === "active" ? "activated" : "suspended"}!`);
                fetchAgents();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const handleViewAgent = (agent: User) => {
        setViewDialog({ open: true, agent });
        fetchAgentDetails(agent.id);
    };

    useEffect(() => {
        // Automatically check and assign unassigned users when admin visits this page
        const autoAssignUsers = async () => {
            try {
                const token = localStorage.getItem("bearer_token");
                const res = await fetch("/api/admin/users/auto-assign-bulk", {
                    method: "POST",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Auto-assign result:", data);
                    if (data.details && data.details.usersAssigned > 0) {
                        toast.success(`🎉 Success! Automatically assigned ${data.details.usersAssigned} users to agents.`);
                        fetchAgents(); // Refresh data
                    } else {
                        console.log("No unassigned users found.");
                    }
                }
            } catch (e) {
                console.error("Auto-assign check failed", e);
            }
        };

        autoAssignUsers();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Agent Management</h2>
                    <p className="text-muted-foreground">Manage agents and their referrals</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => { fetchAgents(); fetchReferralStats(); }} variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={() => setCreateDialog(true)} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create Agent
                    </Button>
                </div>
            </div>

            {/* Referral System Stats */}
            {statsLoading ? (
                <div className="text-center py-4 text-muted-foreground text-sm">Loading statistics...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {/* Total Users */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">TOTAL USERS</p>
                                    <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-500/30" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Agents */}
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">TOTAL AGENTS</p>
                                    <p className="text-2xl font-bold mt-1">{stats.totalAgents}</p>
                                </div>
                                <Shield className="h-8 w-8 text-green-500/30" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users With Agents */}
                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">WITH AGENTS</p>
                                    <p className="text-2xl font-bold mt-1">{stats.usersWithAgents}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stats.totalUsers > 0 ? Math.round((stats.usersWithAgents / stats.totalUsers) * 100) : 0}% coverage
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-purple-500/30" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Referrals */}
                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">TOTAL REFERRALS</p>
                                    <p className="text-2xl font-bold mt-1">{stats.totalReferrals}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-amber-500/30" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orphaned Users */}
                    <Card className={`border-l-4 ${stats.orphanedUsers > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">UNASSIGNED</p>
                                    <p className={`text-2xl font-bold mt-1 ${stats.orphanedUsers > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {stats.orphanedUsers}
                                    </p>
                                </div>
                                <BarChart3 className={`h-8 w-8 ${stats.orphanedUsers > 0 ? 'text-red-500/30' : 'text-green-500/30'}`} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search agents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agents Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Agents ({filteredAgents.length})</CardTitle>
                    <CardDescription>All registered agents</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading agents...</div>
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No agents found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">Agent</th>
                                        <th className="text-left p-3 font-semibold">Coins</th>
                                        <th className="text-left p-3 font-semibold">Status</th>
                                        <th className="text-left p-3 font-semibold">Joined</th>
                                        <th className="text-right p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAgents.map((agent) => (
                                        <tr key={agent.id} className="border-b hover:bg-muted/50">
                                            <td className="p-3">
                                                <div>
                                                    <div className="font-medium">{agent.name}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {agent.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-semibold text-primary">{agent.coins.toLocaleString()}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${agent.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {agent.status === "active" ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                                                    {agent.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(agent.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewAgent(agent)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Details
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleStatus(agent)}
                                                        className={agent.status === "active" ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"}
                                                    >
                                                        {agent.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Agent Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Agent</DialogTitle>
                        <DialogDescription>Add a new agent to the system</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Full Name *</Label>
                            <Input
                                id="create-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-email">Email *</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-password">Password *</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-coins">Initial Coins</Label>
                            <Input
                                id="create-coins"
                                type="number"
                                value={formData.initialCoins}
                                onChange={(e) => setFormData({ ...formData, initialCoins: e.target.value })}
                                placeholder="1000"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateAgent} disabled={processing}>
                            {processing ? "Creating..." : "Create Agent"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Agent Details Dialog */}
            <Dialog open={viewDialog.open} onOpenChange={(open) => !open && setViewDialog({ open: false, agent: null })}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Agent Details: {viewDialog.agent?.name}</DialogTitle>
                        <DialogDescription>Referral information and downline management</DialogDescription>
                    </DialogHeader>

                    {referralsLoading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                            <p className="mt-4 text-sm text-muted-foreground">Loading agent details...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 py-2">
                            {/* 1. Hero Section: Referral Code */}
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">Agent Referral Code</h3>
                                        <p className="text-xs text-white/60">Share this code to bind new users</p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-lg p-2 pr-3 border border-white/10">
                                        <code className="text-2xl font-bold font-mono px-4 tracking-widest text-white shadow-sm">
                                            {agentCode || "NO-CODE"}
                                        </code>
                                        {agentCode && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-10 w-10 text-white hover:bg-white/20 hover:text-white"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(agentCode);
                                                    toast.success("Code copied!");
                                                }}
                                                title="Copy Code"
                                            >
                                                <Copy className="h-5 w-5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Key Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Total Referrals */}
                                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
                                    <div className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Users</p>
                                            <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-foreground">{agentReferrals.length}</span>
                                                <span className="text-sm text-muted-foreground">users</span>
                                            </div>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Users className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="bg-muted/50 px-6 py-2 border-t text-xs text-muted-foreground">
                                        Currently assigned downline
                                    </div>
                                </Card>

                                {/* Total Rewards */}
                                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all">
                                    <div className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Earnings</p>
                                            <div className="mt-2 flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-foreground">
                                                    ${agentReferrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="bg-muted/50 px-6 py-2 border-t text-xs text-muted-foreground">
                                        Lifetime commission Rewards
                                    </div>
                                </Card>
                            </div>

                            {/* Referrals List */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Referred Users
                                    </h3>
                                    {agentReferrals.length > 0 && (
                                        <span className="text-sm text-muted-foreground">
                                            {agentReferrals.length} total
                                        </span>
                                    )}
                                </div>

                                {agentReferrals.length === 0 ? (
                                    <Card className="border-dashed">
                                        <CardContent className="py-12">
                                            <div className="text-center">
                                                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                                <h4 className="text-lg font-semibold mb-2">No Referrals Yet</h4>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    This agent hasn't referred any users yet.
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Share the referral code <code className="bg-muted px-2 py-1 rounded">{agentCode}</code> to start building your network!
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="overflow-hidden border shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted/40 border-b">
                                                    <tr>
                                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground w-[45%]">User</th>
                                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground w-[25%]">Joined Date</th>
                                                        <th className="h-10 px-4 text-left font-medium text-muted-foreground w-[15%]">Status</th>
                                                        <th className="h-10 px-4 text-right font-medium text-muted-foreground w-[15%]">Reward</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {agentReferrals.map((ref, index) => (
                                                        <tr key={ref.id} className="group hover:bg-muted/30 transition-colors">
                                                            <td className="p-4 align-middle">
                                                                <div className="flex items-center gap-3 max-w-[250px] sm:max-w-[300px]">
                                                                    <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-background">
                                                                        {ref.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="font-medium truncate text-foreground">{ref.name}</div>
                                                                        <div className="text-xs text-muted-foreground truncate">{ref.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                                                                {new Date(ref.joinedAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td className="p-4 align-middle">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ref.status === 'active'
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                                                                    }`}>
                                                                    {ref.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle text-right font-medium text-emerald-600 dark:text-emerald-400">
                                                                ${ref.rewardAmount.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="border-t pt-4">
                        <Button variant="outline" onClick={() => setViewDialog({ open: false, agent: null })}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
