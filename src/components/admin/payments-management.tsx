"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Eye, Filter } from "lucide-react";

interface PaymentRequest {
    id: number;
    userId: string;
    userName: string;
    userEmail: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    method: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    processedAt?: string;
    processedBy?: string;
    notes?: string;
}

export const PaymentsManagement = () => {
    const [payments, setPayments] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewDialog, setViewDialog] = useState<{ open: boolean; payment: PaymentRequest | null }>({ open: false, payment: null });
    const [actionDialog, setActionDialog] = useState<{ open: boolean; payment: PaymentRequest | null; action: 'approve' | 'reject' | null }>({ open: false, payment: null, action: null });
    const [notes, setNotes] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, [typeFilter, statusFilter]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("bearer_token");
            const params = new URLSearchParams();
            if (typeFilter !== "all") params.append("type", typeFilter);
            if (statusFilter !== "all") params.append("status", statusFilter);

            const res = await fetch(`/api/admin/payments?${params.toString()}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (res.ok) {
                const data = await res.json();
                setPayments(data.payments || []);
            } else {
                toast.error("Failed to load payments");
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error("Error loading payments");
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayment = async () => {
        if (!actionDialog.payment || !actionDialog.action) return;

        try {
            setProcessing(true);
            const token = localStorage.getItem("bearer_token");
            const res = await fetch("/api/admin/payments/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    paymentId: actionDialog.payment.id,
                    action: actionDialog.action,
                    notes: notes || undefined,
                }),
            });

            if (res.ok) {
                toast.success(`Payment ${actionDialog.action}d successfully!`);
                setActionDialog({ open: false, payment: null, action: null });
                setNotes("");
                fetchPayments();
            } else {
                const error = await res.json();
                toast.error(error.error || `Failed to ${actionDialog.action} payment`);
            }
        } catch (error) {
            toast.error(`Error ${actionDialog.action}ing payment`);
        } finally {
            setProcessing(false);
        }
    };

    const filteredPayments = payments;

    const stats = {
        totalPending: payments.filter(p => p.status === 'pending').length,
        totalApproved: payments.filter(p => p.status === 'approved').length,
        totalRejected: payments.filter(p => p.status === 'rejected').length,
        totalAmount: payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
        pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Payments Management</h2>
                    <p className="text-muted-foreground">Manage deposits and withdrawals</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{stats.totalPending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Approved</p>
                                <p className="text-2xl font-bold">{stats.totalApproved}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rejected</p>
                                <p className="text-2xl font-bold">{stats.totalRejected}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Approved</p>
                                <p className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Amount</p>
                                <p className="text-2xl font-bold">${stats.pendingAmount.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="deposit">Deposits</SelectItem>
                                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Requests ({filteredPayments.length})</CardTitle>
                    <CardDescription>All deposit and withdrawal requests</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading payments...</div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No payment requests found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">User</th>
                                        <th className="text-left p-3 font-semibold">Type</th>
                                        <th className="text-left p-3 font-semibold">Amount</th>
                                        <th className="text-left p-3 font-semibold">Method</th>
                                        <th className="text-left p-3 font-semibold">Status</th>
                                        <th className="text-left p-3 font-semibold">Date</th>
                                        <th className="text-right p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="border-b hover:bg-muted/50">
                                            <td className="p-3">
                                                <div>
                                                    <div className="font-medium">{payment.userName}</div>
                                                    <div className="text-sm text-muted-foreground">{payment.userEmail}</div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${payment.type === "deposit" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                                    }`}>
                                                    {payment.type === "deposit" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                                    {payment.type}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-sm">{payment.method}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${payment.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                                                        payment.status === "approved" ? "bg-green-500/10 text-green-500" :
                                                            "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {payment.status === "pending" ? <Clock className="h-3 w-3" /> :
                                                        payment.status === "approved" ? <CheckCircle className="h-3 w-3" /> :
                                                            <XCircle className="h-3 w-3" />}
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewDialog({ open: true, payment })}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {payment.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => setActionDialog({ open: true, payment, action: 'approve' })}
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => setActionDialog({ open: true, payment, action: 'reject' })}
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
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

            {/* View Payment Dialog */}
            <Dialog open={viewDialog.open} onOpenChange={(open) => !open && setViewDialog({ open: false, payment: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                    </DialogHeader>
                    {viewDialog.payment && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">User</p>
                                    <p className="font-medium">{viewDialog.payment.userName}</p>
                                    <p className="text-sm text-muted-foreground">{viewDialog.payment.userEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium capitalize">{viewDialog.payment.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="font-medium">${viewDialog.payment.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Method</p>
                                    <p className="font-medium">{viewDialog.payment.method}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="font-medium capitalize">{viewDialog.payment.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">{new Date(viewDialog.payment.createdAt).toLocaleString()}</p>
                                </div>
                                {viewDialog.payment.notes && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground">Notes</p>
                                        <p className="font-medium">{viewDialog.payment.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setViewDialog({ open: false, payment: null })}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Action Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, payment: null, action: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionDialog.action === 'approve' ? 'Approve' : 'Reject'} Payment
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.action === 'approve'
                                ? `Approve ${actionDialog.payment?.type} of $${actionDialog.payment?.amount.toLocaleString()} for ${actionDialog.payment?.userName}?`
                                : `Reject ${actionDialog.payment?.type} of $${actionDialog.payment?.amount.toLocaleString()} for ${actionDialog.payment?.userName}?`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes (optional)</label>
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this decision..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog({ open: false, payment: null, action: null })} disabled={processing}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionDialog.action === 'approve' ? 'default' : 'destructive'}
                            onClick={handleProcessPayment}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
