"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Share } from 'lucide-react';

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(isInStandaloneMode);

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Check if user has dismissed before
            const dismissed = localStorage.getItem('pwa_install_dismissed');
            if (!dismissed) {
                setTimeout(() => setShowInstallPrompt(true), 3000); // Show after 3 seconds
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        localStorage.setItem('pwa_install_dismissed', 'true');
    };

    // Don't show if already installed or on iOS (different install process)
    if (isStandalone || !showInstallPrompt) return null;

    // iOS Install Instructions
    if (isIOS) {
        return (
            <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom">
                <Card className="bg-gradient-to-r from-primary/90 to-purple-600/90 backdrop-blur-lg border-primary/20 p-4 shadow-2xl">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 text-white/80 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Download className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">Install NiceBet App</h3>
                            <p className="text-sm text-white/90 mb-2">
                                Add to your home screen for a better experience
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/80">
                                <span>Tap</span>
                                <Share className="h-4 w-4" />
                                <span>then "Add to Home Screen"</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    // Android/Desktop Install Prompt
    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom md:left-auto md:right-4 md:w-96">
            <Card className="bg-gradient-to-r from-primary/90 to-purple-600/90 backdrop-blur-lg border-primary/20 p-4 shadow-2xl">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-white/80 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-start gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Download className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">Install NiceBet App</h3>
                        <p className="text-sm text-white/90">
                            Get instant access with one tap. Works offline!
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleInstallClick}
                        className="flex-1 bg-white text-primary hover:bg-white/90"
                    >
                        Install Now
                    </Button>
                    <Button
                        onClick={handleDismiss}
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                    >
                        Later
                    </Button>
                </div>
            </Card>
        </div>
    );
}
