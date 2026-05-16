"use client";

import { useState, useEffect } from "react";
import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { MobileBottomNav } from "@/components/sections/mobile-bottom-nav";
import { Loader2, Gift, Zap, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Promotion {
  id: number | string;
  title: string;
  description: string | null;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string | null;
  orderIndex?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Added for static dashboard promotions
  icon?: any;
  color?: string;
  link?: string;
}

const STATIC_PROMOTIONS: Promotion[] = [
  {
    id: "static-1",
    title: "Welcome Bonus",
    description: "Get 100% match up to $500 on your first deposit",
    icon: Gift,
    color: "from-pink-500 to-rose-500",
    buttonText: "Claim Offer",
    buttonLink: "/register"
  },
  {
    id: "static-2",
    title: "Live Betting Boost",
    description: "Extra 10% winnings on all live sports bets today",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    buttonText: "Bet Now",
    buttonLink: "/en/live"
  },
  {
    id: "static-3",
    title: "Tournament Series",
    description: "Join the weekly tournament and win big prizes",
    icon: Trophy,
    color: "from-blue-500 to-cyan-500",
    buttonText: "Join Now",
    buttonLink: "/en/sports"
  }
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Start with static promotions
      let allPromotions = [...STATIC_PROMOTIONS];

      try {
        const res = await fetch("/api/promotions");
        if (res.ok) {
          const data = await res.json();
          if (data.promotions && Array.isArray(data.promotions)) {
            // Fix: Replace GK222 with JK222 in dynamic content
            const fixedPromotions = data.promotions.map((p: any) => ({
              ...p,
              title: p.title ? p.title.replace(/GK222/gi, "JK222") : p.title,
              description: p.description ? p.description.replace(/GK222/gi, "JK222") : p.description,
            }));
            allPromotions = [...allPromotions, ...fixedPromotions];
          }
        }
      } catch (apiError) {
        console.error("Failed to fetch API promotions", apiError);
        // Continue with just static promotions if API fails
      }

      setPromotions(allPromotions);
    } catch (e: any) {
      setError(e?.message || "Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Promotions</h1>
          <p className="text-muted-foreground">
            Check out our latest bonuses and special offers
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && promotions.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/60 bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">No active promotions at the moment</p>
          </div>
        )}

        {!loading && !error && promotions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="rounded-xl border border-border bg-card overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {/* Header/Image Area */}
                <div className={`relative h-48 w-full overflow-hidden ${promo.color ? `bg-gradient-to-r ${promo.color}` : 'bg-muted'}`}>
                  {promo.imageUrl ? (
                    <Image
                      src={promo.imageUrl}
                      alt={promo.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-white p-6">
                      {promo.icon && (
                        <div className="mb-3 p-3 rounded-full bg-white/20 backdrop-blur-sm">
                          <promo.icon className="h-8 w-8" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-center drop-shadow-md">{promo.title}</h3>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <div className="mb-4">
                    {!promo.imageUrl && !promo.color && (
                      <h2 className="text-xl font-bold mb-2 text-foreground">
                        {promo.title}
                      </h2>
                    )}
                    {promo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {promo.description}
                      </p>
                    )}
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={promo.buttonLink || promo.link || "#"}>
                      {promo.buttonText || "View Details"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
      <div className="h-20 md:hidden" />
    </div>
  );
}