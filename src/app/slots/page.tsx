"use client";

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/sections/loading-screen';
import { HeaderNavigation } from '@/components/sections/header-navigation';
import SlotsInterface from '@/components/sections/slots-interface';
import Footer from '@/components/sections/footer';

export default function SlotsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <SlotsInterface />
      <Footer />
    </div>
  );
}