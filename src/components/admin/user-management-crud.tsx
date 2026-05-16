"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, UserPlus, Edit, Trash2, Shield, Ban, CheckCircle, Eye, Mail, Phone, Calendar } from "lucide-react";

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

export const UserManagementCRUD = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [agents, setAgents] = useState<User[]>([]); // List of available agents
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("user"); // Default to showing only regular users
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialogs
    const [viewDialog, setViewDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [editDialog, setEditDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [createDialog, setCreateDialog] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        initialCoins: "1000",
        agentId: "none", // Selected agent for this user
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchAgents(); // Fetch available agents
    }, [roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("bearer_token");
            const params = new URLSearchParams();
            if (roleFilter !== "all") params.append("role", roleFilter);
            if (statusFilter !== "all") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/users?${params.toString()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            } else {
                toast.error("Failed to load users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/admin/users?role=agent`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setAgents(data.users || []);
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    const handleCreateUser = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");

            // Handle agentId "none" -> empty string for API
            const payload = { ...formData };
            if (payload.agentId === "none") {
                payload.agentId = "";
            }

            const res = await fetch("/api/admin/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("User created successfully!");
                setCreateDialog(false);
                setFormData({ name: "", email: "", password: "", role: "user", initialCoins: "1000", agentId: "none" });
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to create user");
            }
        } catch (error) {
            toast.error("Error creating user");
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!editDialog.user) return;

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    userId: editDialog.user.id,
                    name: formData.name,
                    role: formData.role,
                }),
            });

            if (res.ok) {
                toast.success("User updated successfully!");
                setEditDialog({ open: false, user: null });
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to update user");
            }
        } catch (error) {
            toast.error("Error updating user");
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteDialog.user) return;

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch(`/api/admin/users/delete?userId=${deleteDialog.user.id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                toast.success("User deleted successfully!");
                setDeleteDialog({ open: false, user: null });
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to delete user");
            }
        } catch (error) {
            toast.error("Error deleting user");
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
                toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}!`);
                fetchUsers();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const openEditDialog = (user: User) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            initialCoins: user.coins.toString(),
            agentId: "none", // Not editable in edit dialog
        });
        setEditDialog({ open: true, user });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-muted-foreground">Manage regular user accounts</p>
                </div>
                <Button onClick={() => setCreateDialog(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create User
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>Regular users only</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No users found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">User</th>
                                        <th className="text-left p-3 font-semibold">Role</th>
                                        <th className="text-left p-3 font-semibold">Coins</th>
                                        <th className="text-left p-3 font-semibold">Status</th>
                                        <th className="text-left p-3 font-semibold">Joined</th>
                                        <th className="text-right p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="p-3">
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-red-500/10 text-red-500" :
                                                    user.role === "agent" ? "bg-blue-500/10 text-blue-500" :
                                                        "bg-green-500/10 text-green-500"
                                                    }`}>
                                                    <Shield className="h-3 w-3" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-semibold text-primary">{user.coins.toLocaleString()}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {user.status === "active" ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
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
                                                        onClick={() => openEditDialog(user)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleStatus(user)}
                                                    >
                                                        {user.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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

            {/* Create User Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>Add a new user to the system</DialogDescription>
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
                            <Label htmlFor="create-role">Role</Label>
                            <div className="space-y-2">
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-amber-600 font-medium">
                                    ℹ️ Agents can only be created via referral system. When a user refers someone, they automatically become an agent.
                                </p>
                            </div>
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
                        {formData.role === "user" && (
                            <div className="space-y-2">
                                <Label htmlFor="create-agent">Assign to Agent (Optional)</Label>
                                <Select value={formData.agentId} onValueChange={(value) => setFormData({ ...formData, agentId: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an agent..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Agent</SelectItem>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id}>
                                                {agent.name} ({agent.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Assign this user to an agent for commission tracking
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateUser} disabled={processing}>
                            {processing ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email (read-only)</Label>
                            <Input
                                id="edit-email"
                                value={formData.email}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <div className="space-y-2">
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formData.role === 'agent' && (
                                    <p className="text-xs text-blue-600 font-medium">
                                        ✅ This user is an agent (via referral). Cannot downgrade role here - role is managed by referral system.
                                    </p>
                                )}
                                <p className="text-xs text-amber-600 font-medium">
                                    ℹ️ Agents are created via referral system, not manually.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialog({ open: false, user: null })} disabled={processing}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} disabled={processing}>
                            {processing ? "Updating..." : "Update User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View User Dialog */}
            <Dialog open={viewDialog.open} onOpenChange={(open) => !open && setViewDialog({ open: false, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
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
                                    <Label className="text-muted-foreground">Role</Label>
                                    <p className="font-medium capitalize">{viewDialog.user.role}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <p className="font-medium capitalize">{viewDialog.user.status}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Coins</Label>
                                    <p className="font-medium">{viewDialog.user.coins.toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email Verified</Label>
                                    <p className="font-medium">{viewDialog.user.emailVerified ? "Yes" : "No"}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground">Joined</Label>
                                    <p className="font-medium">{new Date(viewDialog.user.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setViewDialog({ open: false, user: null })}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, user: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deleteDialog.user?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, user: null })} disabled={processing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser} disabled={processing}>
                            {processing ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
