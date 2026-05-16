"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

export default function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'support'; time: string }>>([
        {
            text: "Hello! Welcome to NiceBet Support. How can we help you today?",
            sender: 'support',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            text: message,
            sender: 'user' as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        // Simulate support response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "Thank you for your message. A support agent will respond shortly.",
                sender: 'support',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-200"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    1
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom">
            <Card className="bg-card border-border shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-full">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Live Support</CardTitle>
                                <p className="text-xs text-white/80">We're online now</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="text-white/80 hover:text-white p-1"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <CardContent className="p-0">
                        <div className="h-96 flex flex-col">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-accent/20">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-foreground'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                            <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-border bg-background">
                                <div className="flex gap-2">
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        size="icon"
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Average response time: 2 minutes
                                </p>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
