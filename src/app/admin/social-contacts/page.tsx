"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  MessageCircle, 
  Send, 
  Facebook, 
  Headphones,
  Phone,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialContact {
  id: number;
  platform: string;
  label: string;
  value: string;
  iconColor: string;
  isActive: boolean;
  displayOrder: number;
}

export default function SocialContactsAdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<SocialContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    label: '',
    value: '',
    iconColor: '#25D366',
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchContacts();
    }
  }, [session]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/admin/social-contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast.error('Admin access required');
        router.push('/');
        return;
      }

      const data = await response.json();
      if (data.contacts) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch('/api/admin/social-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to create contact');
        return;
      }

      toast.success('Contact created successfully');
      setIsCreating(false);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Failed to create contact:', error);
      toast.error('Failed to create contact');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/admin/social-contacts?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to update contact');
        return;
      }

      toast.success('Contact updated successfully');
      setEditingId(null);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Failed to update contact:', error);
      toast.error('Failed to update contact');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/admin/social-contacts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete contact');
        return;
      }

      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleToggleActive = async (contact: SocialContact) => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/admin/social-contacts?id=${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !contact.isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to toggle status');
        return;
      }

      toast.success(`Contact ${!contact.isActive ? 'activated' : 'deactivated'}`);
      fetchContacts();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Failed to toggle status');
    }
  };

  const startEdit = (contact: SocialContact) => {
    setEditingId(contact.id);
    setFormData({
      platform: contact.platform,
      label: contact.label,
      value: contact.value,
      iconColor: contact.iconColor,
      isActive: contact.isActive,
      displayOrder: contact.displayOrder,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      label: '',
      value: '',
      iconColor: '#25D366',
      isActive: true,
      displayOrder: 0,
    });
  };

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5" />;
      case 'telegram':
        return <Send className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'support':
        return <Headphones className="w-5 h-5" />;
      default:
        return <Phone className="w-5 h-5" />;
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Social Contacts</h1>
              <p className="text-muted-foreground mt-1">
                Manage social media and contact information
              </p>
            </div>
            {!isCreating && (
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-primary text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="whatsapp, telegram, facebook, support"
                />
              </div>
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="WhatsApp Support"
                />
              </div>
              <div>
                <Label htmlFor="value">Value (URL or Phone)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="+231770123456 or https://..."
                />
              </div>
              <div>
                <Label htmlFor="iconColor">Icon Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="iconColor"
                    type="color"
                    value={formData.iconColor}
                    onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.iconColor}
                    onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
                    placeholder="#25D366"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Create
              </Button>
              <Button onClick={cancelEdit} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-card border rounded-lg p-6 ${
                !contact.isActive ? 'opacity-50' : ''
              }`}
            >
              {editingId === contact.id ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Platform</Label>
                      <Input
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Icon Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.iconColor}
                          onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.iconColor}
                          onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleUpdate(contact.id)}
                      className="bg-primary text-primary-foreground"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={cancelEdit} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: contact.iconColor }}
                      >
                        {getIcon(contact.platform)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{contact.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          Platform: {contact.platform}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Value: {contact.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Order: {contact.displayOrder} | Color: {contact.iconColor}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleToggleActive(contact)}
                        variant="outline"
                        size="sm"
                      >
                        {contact.isActive ? (
                          <><Eye className="w-4 h-4 mr-1" /> Active</>
                        ) : (
                          <><EyeOff className="w-4 h-4 mr-1" /> Hidden</>
                        )}
                      </Button>
                      <Button
                        onClick={() => startEdit(contact)}
                        variant="outline"
                        size="sm"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(contact.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {contacts.length === 0 && !isCreating && (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first social contact to get started
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
