"use client";

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/sections/loading-screen';
import { HeaderNavigation } from '@/components/sections/header-navigation';
import SportsBettingInterface from '@/components/sections/sports-betting-interface';
import LobbyContent from '@/components/sections/lobby-content';
import Footer from '@/components/sections/footer';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import { AnnouncementDialog } from '@/components/sections/announcement-dialog';
import Promotions from '@/components/sections/promotions';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <SportsBettingInterface showSportsContent={false}>
        <LobbyContent />

      </SportsBettingInterface>
      <Footer />
      <MobileBottomNav />

      <AnnouncementDialog />
      <div className="h-20 md:hidden" /> {/* Spacer for fixed bottom nav */}
    </div>
  );
}