"use client";

import { useState, useEffect } from 'react';
import { Coins, Plus, Minus, User, Users, Shield, Search, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UserBalance {
  userId: string;
  name: string;
  email: string;
  role: string;
  coins: number;
  createdAt: string;
  updatedAt: string;
}

export const CoinManagement = () => {
  const [balances, setBalances] = useState<UserBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserBalance | null>(null);
  const [actionType, setActionType] = useState<'add' | 'remove' | 'role'>('add');
  const [amount, setAmount] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const url = roleFilter === 'all' 
        ? '/api/admin/balances' 
        : `/api/admin/balances?role=${roleFilter}`;
      
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error('Failed to load balances');

      const data = await res.json();
      setBalances(data.balances || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [roleFilter]);

  const openDialog = (user: UserBalance, type: 'add' | 'remove' | 'role') => {
    setSelectedUser(user);
    setActionType(type);
    setAmount('');
    setDescription('');
    setNewRole(user.role);
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setAmount('');
    setDescription('');
  };

  const handleAddCoins = async () => {
    if (!selectedUser || !amount || parseInt(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/balances/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: selectedUser.userId,
          amount: parseInt(amount),
          description: description || `Admin added ${amount} coins`,
        }),
      });

      if (!res.ok) throw new Error('Failed to add coins');

      const data = await res.json();
      toast.success(`Successfully added ${amount} coins to ${selectedUser.name}`);
      closeDialog();
      fetchBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add coins');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCoins = async () => {
    if (!selectedUser || !amount || parseInt(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseInt(amount) > selectedUser.coins) {
      toast.error('Amount exceeds user balance');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/balances/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: selectedUser.userId,
          amount: parseInt(amount),
          description: description || `Admin removed ${amount} coins`,
        }),
      });

      if (!res.ok) throw new Error('Failed to remove coins');

      const data = await res.json();
      toast.success(`Successfully removed ${amount} coins from ${selectedUser.name}`);
      closeDialog();
      fetchBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove coins');
    } finally {
      setSaving(false);
    }
  };

  const handleSetRole = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/balances/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: selectedUser.userId,
          role: newRole,
        }),
      });

      if (!res.ok) throw new Error('Failed to update role');

      const data = await res.json();
      toast.success(`Successfully updated ${selectedUser.name}'s role to ${newRole}`);
      closeDialog();
      fetchBalances();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  const filteredBalances = balances.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCoins = balances.reduce((sum, b) => sum + b.coins, 0);
  const userCount = balances.filter((b) => b.role === 'user').length;
  const agentCount = balances.filter((b) => b.role === 'agent').length;
  const adminCount = balances.filter((b) => b.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Coins</p>
            <Coins size={16} className="text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{totalCoins.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Users</p>
            <User size={16} className="text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{userCount}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Agents</p>
            <Users size={16} className="text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{agentCount}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Admins</p>
            <Shield size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{adminCount}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-64 rounded-md border border-border bg-input/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-border bg-input/60 px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="agent">Agents</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <button
          onClick={fetchBalances}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center text-sm text-muted-foreground">Loading balances...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/20 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Role</th>
                <th className="px-3 py-2 text-right font-semibold">Coins</th>
                <th className="px-3 py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBalances.map((balance) => (
                <tr key={balance.userId} className="border-t border-border/60">
                  <td className="px-3 py-2 font-medium">{balance.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{balance.email}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                        balance.role === 'admin'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : balance.role === 'agent'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      {balance.role === 'admin' && <Shield size={12} />}
                      {balance.role === 'agent' && <Users size={12} />}
                      {balance.role === 'user' && <User size={12} />}
                      {balance.role.charAt(0).toUpperCase() + balance.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold">
                    {balance.coins.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => openDialog(balance, 'add')}
                      className="mr-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <Plus size={12} />
                      Add
                    </button>
                    <button
                      onClick={() => openDialog(balance, 'remove')}
                      className="mr-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <Minus size={12} />
                      Remove
                    </button>
                    <button
                      onClick={() => openDialog(balance, 'role')}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <Shield size={12} />
                      Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'add' && 'Add Coins'}
              {actionType === 'remove' && 'Remove Coins'}
              {actionType === 'role' && 'Change Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUser && (
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <p className="text-sm font-semibold">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                <p className="mt-1 text-sm">
                  Current Balance: <span className="font-mono font-bold">{selectedUser.coins}</span> coins
                </p>
              </div>
            )}

            {actionType !== 'role' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Reason for transaction"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="role">New Role</Label>
                <select
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={closeDialog}
              disabled={saving}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={
                actionType === 'add'
                  ? handleAddCoins
                  : actionType === 'remove'
                  ? handleRemoveCoins
                  : handleSetRole
              }
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              {saving ? 'Processing...' : 'Confirm'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};