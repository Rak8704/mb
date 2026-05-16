"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserPlus, RefreshCw, Trash2, Eye, Coins, Calendar, TrendingUp } from "lucide-react";

interface DemoUser {
    id: number;
    name: string;
    email: string;
    coins: number;
    createdAt: string;
    lastResetAt: string;
    totalBets?: number;
    totalWagered?: number;
}

export const DemoUserManagement = () => {
    const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialog, setCreateDialog] = useState(false);
    const [resetDialog, setResetDialog] = useState<{ open: boolean; user: DemoUser | null }>({ open: false, user: null });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: DemoUser | null }>({ open: false, user: null });
    const [viewDialog, setViewDialog] = useState<{ open: boolean; user: DemoUser | null }>({ open: false, user: null });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        initialCoins: "10000",
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchDemoUsers();
    }, []);

    const fetchDemoUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/demo-users", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setDemoUsers(data.users || []);
            } else {
                toast.error("Failed to load demo users");
            }
        } catch (error) {
            console.error("Error fetching demo users:", error);
            toast.error("Error loading demo users");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDemoUser = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/demo-users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Demo user created successfully!");
                setCreateDialog(false);
                setFormData({ name: "", email: "", initialCoins: "10000" });
                fetchDemoUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to create demo user");
            }
        } catch (error) {
            toast.error("Error creating demo user");
        } finally {
            setProcessing(false);
        }
    };

    const handleResetDemoUser = async () => {
        if (!resetDialog.user) return;

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/demo-users/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ userId: resetDialog.user.id }),
            });

            if (res.ok) {
                toast.success("Demo user reset successfully!");
                setResetDialog({ open: false, user: null });
                fetchDemoUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to reset demo user");
            }
        } catch (error) {
            toast.error("Error resetting demo user");
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteDemoUser = async () => {
        if (!deleteDialog.user) return;

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/admin/demo-users/delete?userId=${deleteDialog.user.id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                toast.success("Demo user deleted successfully!");
                setDeleteDialog({ open: false, user: null });
                fetchDemoUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to delete demo user");
            }
        } catch (error) {
            toast.error("Error deleting demo user");
        } finally {
            setProcessing(false);
        }
    };

    const handleResetAll = async () => {
        if (!confirm("Are you sure you want to reset ALL demo users? This will reset their coins and clear their betting history.")) {
            return;
        }

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/demo-users/reset-all", {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                toast.success("All demo users reset successfully!");
                fetchDemoUsers();
            } else {
                toast.error("Failed to reset all demo users");
            }
        } catch (error) {
            toast.error("Error resetting all demo users");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Demo User Management</h2>
                    <p className="text-muted-foreground">Manage demo accounts for testing</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleResetAll} variant="outline" className="gap-2" disabled={processing || demoUsers.length === 0}>
                        <RefreshCw className="h-4 w-4" />
                        Reset All
                    </Button>
                    <Button onClick={() => setCreateDialog(true)} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Create Demo User
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Demo Users</p>
                                <p className="text-2xl font-bold">{demoUsers.length}</p>
                            </div>
                            <UserPlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Coins</p>
                                <p className="text-2xl font-bold">{demoUsers.reduce((sum, u) => sum + u.coins, 0).toLocaleString()}</p>
                            </div>
                            <Coins className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Coins</p>
                                <p className="text-2xl font-bold">
                                    {demoUsers.length > 0 ? Math.round(demoUsers.reduce((sum, u) => sum + u.coins, 0) / demoUsers.length).toLocaleString() : 0}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Today</p>
                                <p className="text-2xl font-bold">
                                    {demoUsers.filter(u => {
                                        const lastReset = new Date(u.lastResetAt);
                                        const today = new Date();
                                        return lastReset.toDateString() === today.toDateString();
                                    }).length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Demo Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Demo Users ({demoUsers.length})</CardTitle>
                    <CardDescription>Test accounts with resettable balances</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading demo users...</div>
                    ) : demoUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No demo users yet. Create one to get started!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">User</th>
                                        <th className="text-left p-3 font-semibold">Coins</th>
                                        <th className="text-left p-3 font-semibold">Created</th>
                                        <th className="text-left p-3 font-semibold">Last Reset</th>
                                        <th className="text-right p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demoUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="p-3">
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-semibold text-primary flex items-center gap-1">
                                                    <Coins className="h-4 w-4" />
                                                    {user.coins.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(user.lastResetAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewDialog({ open: true, user })}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setResetDialog({ open: true, user })}
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setDeleteDialog({ open: true, user })}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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

            {/* Create Demo User Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Demo User</DialogTitle>
                        <DialogDescription>Add a new demo account for testing</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="demo-name">Name *</Label>
                            <Input
                                id="demo-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Demo User 1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="demo-email">Email *</Label>
                            <Input
                                id="demo-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="demo1@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="demo-coins">Initial Coins</Label>
                            <Input
                                id="demo-coins"
                                type="number"
                                value={formData.initialCoins}
                                onChange={(e) => setFormData({ ...formData, initialCoins: e.target.value })}
                                placeholder="10000"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateDemoUser} disabled={processing}>
                            {processing ? "Creating..." : "Create Demo User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Demo User Dialog */}
            <Dialog open={resetDialog.open} onOpenChange={(open) => !open && setResetDialog({ open: false, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Demo User</DialogTitle>
                        <DialogDescription>
                            Reset {resetDialog.user?.name} to default state? This will:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Reset coins to 10,000</li>
                                <li>Clear all betting history</li>
                                <li>Clear all transactions</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setResetDialog({ open: false, user: null })} disabled={processing}>
                            Cancel
                        </Button>
                        <Button onClick={handleResetDemoUser} disabled={processing}>
                            {processing ? "Resetting..." : "Reset User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Demo User Dialog */}
            <Dialog open={viewDialog.open} onOpenChange={(open) => !open && setViewDialog({ open: false, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Demo User Details</DialogTitle>
                    </DialogHeader>
                    {viewDialog.user && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Name</Label>
                                    <p className="font-medium">{viewDialog.user.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{viewDialog.user.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Coins</Label>
                                    <p className="font-medium">{viewDialog.user.coins.toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Role</Label>
                                    <p className="font-medium">Demo</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground">Created</Label>
                                    <p className="font-medium">{new Date(viewDialog.user.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground">Last Reset</Label>
                                    <p className="font-medium">{new Date(viewDialog.user.lastResetAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setViewDialog({ open: false, user: null })}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Demo User Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Demo User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deleteDialog.user?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, user: null })} disabled={processing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteDemoUser} disabled={processing}>
                            {processing ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
