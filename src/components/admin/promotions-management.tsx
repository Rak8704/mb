"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface Promotion {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  buttonText: string;
  buttonLink: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; promotion: Promotion | null }>({
    open: false,
    promotion: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; promotion: Promotion | null }>({
    open: false,
    promotion: null,
  });

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    buttonText: "View",
    buttonLink: "",
    orderIndex: 0,
    isActive: true,
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/promotions", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error("Failed to load promotions");
      
      const data = await res.json();
      setPromotions(data.promotions || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error("Title and Image URL are required");
      return;
    }

    try {
      setProcessing(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create promotion");
      }

      await fetchPromotions();
      setCreateDialog(false);
      resetForm();
      toast.success("Promotion created successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create promotion");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async () => {
    if (!editDialog.promotion || !formData.title.trim() || !formData.imageUrl.trim()) {
      toast.error("Title and Image URL are required");
      return;
    }

    try {
      setProcessing(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch(`/api/admin/promotions?id=${editDialog.promotion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update promotion");
      }

      await fetchPromotions();
      setEditDialog({ open: false, promotion: null });
      resetForm();
      toast.success("Promotion updated successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update promotion");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.promotion) return;

    try {
      setProcessing(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch(`/api/admin/promotions?id=${deleteDialog.promotion.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete promotion");
      }

      await fetchPromotions();
      setDeleteDialog({ open: false, promotion: null });
      toast.success("Promotion deleted successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete promotion");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleActive = async (promo: Promotion) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch(`/api/admin/promotions?id=${promo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });

      if (!res.ok) throw new Error("Failed to toggle active status");

      await fetchPromotions();
      toast.success(`Promotion ${!promo.isActive ? "activated" : "deactivated"}`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to toggle active status");
    }
  };

  const handleReorder = async (promo: Promotion, direction: "up" | "down") => {
    const newOrderIndex = direction === "up" ? promo.orderIndex - 1 : promo.orderIndex + 1;
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
      const res = await fetch(`/api/admin/promotions?id=${promo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderIndex: newOrderIndex }),
      });

      if (!res.ok) throw new Error("Failed to reorder promotion");

      await fetchPromotions();
      toast.success("Promotion reordered");
    } catch (e: any) {
      toast.error(e?.message || "Failed to reorder promotion");
    }
  };

  const openEditDialog = (promo: Promotion) => {
    setFormData({
      title: promo.title,
      description: promo.description || "",
      imageUrl: promo.imageUrl,
      buttonText: promo.buttonText,
      buttonLink: promo.buttonLink || "",
      orderIndex: promo.orderIndex,
      isActive: promo.isActive,
    });
    setEditDialog({ open: true, promotion: promo });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      buttonText: "View",
      buttonLink: "",
      orderIndex: 0,
      isActive: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Promotions Management</h3>
          <p className="text-sm text-muted-foreground">Manage promotional banners and offers</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setCreateDialog(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Create Promotion
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && promotions.length === 0 && (
        <div className="rounded-lg border border-dashed border-border/60 bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No promotions yet. Create your first one!</p>
        </div>
      )}

      {!loading && !error && promotions.length > 0 && (
        <div className="space-y-3">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  {promo.imageUrl.startsWith('http') ? (
                    <Image
                      src={promo.imageUrl}
                      alt={promo.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h4 className="font-semibold">{promo.title}</h4>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        promo.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {promo.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {promo.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Order: {promo.orderIndex}</span>
                    <span>•</span>
                    <span>Button: {promo.buttonText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(promo, "up")}
                    disabled={promo.orderIndex === Math.min(...promotions.map(p => p.orderIndex))}
                    className="rounded-md border border-border p-2 hover:bg-muted disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleReorder(promo, "down")}
                    disabled={promo.orderIndex === Math.max(...promotions.map(p => p.orderIndex))}
                    className="rounded-md border border-border p-2 hover:bg-muted disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(promo)}
                    className="rounded-md border border-border p-2 hover:bg-muted"
                    title={promo.isActive ? "Deactivate" : "Activate"}
                  >
                    {promo.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => openEditDialog(promo)}
                    className="rounded-md border border-border p-2 hover:bg-muted"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteDialog({ open: true, promotion: promo })}
                    className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-title">Title *</Label>
              <Input
                id="create-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter promotion title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Input
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter promotion description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-image">Image URL *</Label>
              <Input
                id="create-image"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-button-text">Button Text</Label>
                <Input
                  id="create-button-text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="View"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-button-link">Button Link</Label>
                <Input
                  id="create-button-link"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/promotions/details"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-order">Order Index</Label>
                <Input
                  id="create-order"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setCreateDialog(false)}
              disabled={processing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={processing}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {processing ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, promotion: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter promotion title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter promotion description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL *</Label>
              <Input
                id="edit-image"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-button-text">Button Text</Label>
                <Input
                  id="edit-button-text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="View"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-button-link">Button Link</Label>
                <Input
                  id="edit-button-link"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/promotions/details"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-order">Order Index</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditDialog({ open: false, promotion: null })}
              disabled={processing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={processing}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {processing ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, promotion: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promotion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "<span className="font-semibold text-foreground">{deleteDialog.promotion?.title}</span>"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialog({ open: false, promotion: null })}
              disabled={processing}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={processing}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
            >
              {processing ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
