"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Megaphone, MessageSquare } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    buttonText: string;
    buttonLink?: string;
    orderIndex: number;
    isActive: boolean;
}

interface ScrollingMessage {
    id: number;
    message: string;
    orderIndex: number;
    isActive: boolean;
}

export default function ContentManagementPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [messages, setMessages] = useState<ScrollingMessage[]>([]);
    const [loading, setLoading] = useState(true);

    // Announcement form state
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementForm, setAnnouncementForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
        buttonText: "Learn More",
        buttonLink: "",
        orderIndex: 0,
    });

    // Message form state
    const [editingMessage, setEditingMessage] = useState<ScrollingMessage | null>(null);
    const [messageForm, setMessageForm] = useState({
        message: "",
        orderIndex: 0,
    });

    // Fetch data
    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("/api/announcements");
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data.announcements || []);
            }
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/scrolling-messages");
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
        fetchMessages();
    }, []);

    // Announcement handlers
    const handleSaveAnnouncement = async () => {
        try {
            const method = editingAnnouncement ? "PUT" : "POST";
            const body = editingAnnouncement
                ? { id: editingAnnouncement.id, ...announcementForm }
                : announcementForm;

            const res = await fetch("/api/announcements", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingAnnouncement ? "Announcement updated!" : "Announcement created!");
                fetchAnnouncements();
                resetAnnouncementForm();
            } else {
                toast.error("Failed to save announcement");
            }
        } catch (error) {
            toast.error("Error saving announcement");
        }
    };

    const handleDeleteAnnouncement = async (id: number) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        try {
            const res = await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Announcement deleted!");
                fetchAnnouncements();
            } else {
                toast.error("Failed to delete announcement");
            }
        } catch (error) {
            toast.error("Error deleting announcement");
        }
    };

    const handleToggleAnnouncementStatus = async (announcement: Announcement) => {
        try {
            const res = await fetch("/api/announcements", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: announcement.id,
                    isActive: !announcement.isActive,
                }),
            });

            if (res.ok) {
                toast.success(`Announcement ${!announcement.isActive ? "activated" : "deactivated"}!`);
                fetchAnnouncements();
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const resetAnnouncementForm = () => {
        setEditingAnnouncement(null);
        setAnnouncementForm({
            title: "",
            description: "",
            imageUrl: "",
            buttonText: "Learn More",
            buttonLink: "",
            orderIndex: 0,
        });
    };

    const startEditAnnouncement = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setAnnouncementForm({
            title: announcement.title,
            description: announcement.description,
            imageUrl: announcement.imageUrl || "",
            buttonText: announcement.buttonText,
            buttonLink: announcement.buttonLink || "",
            orderIndex: announcement.orderIndex,
        });
    };

    // Message handlers
    const handleSaveMessage = async () => {
        try {
            const method = editingMessage ? "PUT" : "POST";
            const body = editingMessage
                ? { id: editingMessage.id, ...messageForm }
                : messageForm;

            const res = await fetch("/api/scrolling-messages", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingMessage ? "Message updated!" : "Message created!");
                fetchMessages();
                resetMessageForm();
            } else {
                toast.error("Failed to save message");
            }
        } catch (error) {
            toast.error("Error saving message");
        }
    };

    const handleDeleteMessage = async (id: number) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const res = await fetch(`/api/scrolling-messages?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Message deleted!");
                fetchMessages();
            } else {
                toast.error("Failed to delete message");
            }
        } catch (error) {
            toast.error("Error deleting message");
        }
    };

    const handleToggleMessageStatus = async (message: ScrollingMessage) => {
        try {
            const res = await fetch("/api/scrolling-messages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: message.id,
                    isActive: !message.isActive,
                }),
            });

            if (res.ok) {
                toast.success(`Message ${!message.isActive ? "activated" : "deactivated"}!`);
                fetchMessages();
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const resetMessageForm = () => {
        setEditingMessage(null);
        setMessageForm({
            message: "",
            orderIndex: 0,
        });
    };

    const startEditMessage = (message: ScrollingMessage) => {
        setEditingMessage(message);
        setMessageForm({
            message: message.message,
            orderIndex: message.orderIndex,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading content management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Content Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage announcements and scrolling messages
                    </p>
                </div>
            </div>

            {/* Announcements Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5" />
                        Popup Announcements
                    </CardTitle>
                    <CardDescription>
                        Manage popup announcements that appear when users visit the site
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Announcement Form */}
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <h3 className="font-semibold mb-4">
                            {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                        </h3>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="ann-title">Title *</Label>
                                    <Input
                                        id="ann-title"
                                        value={announcementForm.title}
                                        onChange={(e) =>
                                            setAnnouncementForm({ ...announcementForm, title: e.target.value })
                                        }
                                        placeholder="Welcome Bonus - $10 Billion"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ann-button">Button Text *</Label>
                                    <Input
                                        id="ann-button"
                                        value={announcementForm.buttonText}
                                        onChange={(e) =>
                                            setAnnouncementForm({ ...announcementForm, buttonText: e.target.value })
                                        }
                                        placeholder="Claim Now"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="ann-desc">Description *</Label>
                                <Textarea
                                    id="ann-desc"
                                    value={announcementForm.description}
                                    onChange={(e) =>
                                        setAnnouncementForm({ ...announcementForm, description: e.target.value })
                                    }
                                    placeholder="Register now and claim your special welcome bonus!"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="ann-image">Image URL (optional)</Label>
                                    <Input
                                        id="ann-image"
                                        value={announcementForm.imageUrl}
                                        onChange={(e) =>
                                            setAnnouncementForm({ ...announcementForm, imageUrl: e.target.value })
                                        }
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ann-link">Button Link (optional)</Label>
                                    <Input
                                        id="ann-link"
                                        value={announcementForm.buttonLink}
                                        onChange={(e) =>
                                            setAnnouncementForm({ ...announcementForm, buttonLink: e.target.value })
                                        }
                                        placeholder="/register"
                                    />
                                </div>
                            </div>

                            <div className="w-32">
                                <Label htmlFor="ann-order">Order Index</Label>
                                <Input
                                    id="ann-order"
                                    type="number"
                                    value={announcementForm.orderIndex}
                                    onChange={(e) =>
                                        setAnnouncementForm({
                                            ...announcementForm,
                                            orderIndex: parseInt(e.target.value) || 0,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleSaveAnnouncement} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {editingAnnouncement ? "Update" : "Create"} Announcement
                                </Button>
                                {editingAnnouncement && (
                                    <Button onClick={resetAnnouncementForm} variant="outline" className="gap-2">
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Existing Announcements ({announcements.length})</h3>
                        {announcements.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-8 text-center">
                                No announcements yet. Create one above!
                            </p>
                        ) : (
                            announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="border rounded-lg p-4 flex items-start justify-between gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold">{announcement.title}</h4>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded ${announcement.isActive
                                                        ? "bg-green-500/20 text-green-500"
                                                        : "bg-gray-500/20 text-gray-500"
                                                    }`}
                                            >
                                                {announcement.isActive ? "Active" : "Inactive"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Order: {announcement.orderIndex}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {announcement.description}
                                        </p>
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            {announcement.imageUrl && (
                                                <span>📷 Image: {announcement.imageUrl.substring(0, 40)}...</span>
                                            )}
                                            {announcement.buttonLink && (
                                                <span>🔗 Link: {announcement.buttonLink}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleAnnouncementStatus(announcement)}
                                        >
                                            {announcement.isActive ? "Deactivate" : "Activate"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => startEditAnnouncement(announcement)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Scrolling Messages Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Scrolling Messages
                    </CardTitle>
                    <CardDescription>
                        Manage scrolling messages that appear in the notification banner
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Message Form */}
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <h3 className="font-semibold mb-4">
                            {editingMessage ? "Edit Message" : "Create New Message"}
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="msg-text">Message Text *</Label>
                                <Textarea
                                    id="msg-text"
                                    value={messageForm.message}
                                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                                    placeholder="Welcome to JK222! Experience the best sports betting..."
                                    rows={2}
                                />
                            </div>

                            <div className="w-32">
                                <Label htmlFor="msg-order">Order Index</Label>
                                <Input
                                    id="msg-order"
                                    type="number"
                                    value={messageForm.orderIndex}
                                    onChange={(e) =>
                                        setMessageForm({
                                            ...messageForm,
                                            orderIndex: parseInt(e.target.value) || 0,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleSaveMessage} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {editingMessage ? "Update" : "Create"} Message
                                </Button>
                                {editingMessage && (
                                    <Button onClick={resetMessageForm} variant="outline" className="gap-2">
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Existing Messages ({messages.length})</h3>
                        {messages.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-8 text-center">
                                No messages yet. Create one above!
                            </p>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className="border rounded-lg p-4 flex items-start justify-between gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded ${message.isActive
                                                        ? "bg-green-500/20 text-green-500"
                                                        : "bg-gray-500/20 text-gray-500"
                                                    }`}
                                            >
                                                {message.isActive ? "Active" : "Inactive"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Order: {message.orderIndex}
                                            </span>
                                        </div>
                                        <p className="text-sm">{message.message}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleMessageStatus(message)}
                                        >
                                            {message.isActive ? "Deactivate" : "Activate"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => startEditMessage(message)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteMessage(message.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
