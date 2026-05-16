"use client";

import { useState, useEffect } from "react";
import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { MobileBottomNav } from "@/components/sections/mobile-bottom-nav";
import { Loader2, ArrowRight } from "lucide-react";
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
}

// Static promotions with ONLY public/images folder images
const STATIC_PROMOTIONS: Promotion[] = [
  {
    id: "static-1",
    title: "Welcome Bonus",
    description: "Get 100% match up to $500 on your first deposit",
    imageUrl: "/images/slide12.webp", // 1M COIN WELCOME BONUS
    buttonText: "Claim Offer",
    buttonLink: "/register"
  },
  {
    id: "static-2",
    title: "Live Betting Boost",
    description: "Extra 10% winnings on all live sports bets today",
    imageUrl: "/images/slide7.webp", // BIG WIN
    buttonText: "Bet Now",
    buttonLink: "/en/live"
  },
  {
    id: "static-3",
    title: "Tournament Series",
    description: "Join the weekly tournament and win big prizes",
    imageUrl: "/images/slide8.webp", // 1,000,000 bmi
    buttonText: "Join Now",
    buttonLink: "/en/sports"
  },
  {
    id: "static-4",
    title: "Social Bonus",
    description: "Follow us on social media for exclusive bonuses",
    imageUrl: "/images/slide6.webp", // SOCIAL PHOTO
    buttonText: "Follow Now",
    buttonLink: "/en/social"
  },
  {
    id: "static-5",
    title: "Cashback Offer",
    description: "Get up to 50% cashback on your losses this week",
    imageUrl: "/images/slide9.webp", // Special offer in Ukrainian
    buttonText: "Get Cashback",
    buttonLink: "/en/cashback"
  },
  {
    id: "static-6",
    title: "bKash Deposit Bonus",
    description: "Special bonus when you deposit using bKash",
    imageUrl: "/images/slide11.webp", // bKash
    buttonText: "Deposit Now",
    buttonLink: "/en/deposit"
  },
  {
    id: "static-7",
    title: "5 Million Voucher Giveaway",
    description: "Win 5,000,000 worth of vouchers",
    imageUrl: "/images/slide10.webp", // 5,000,000 Voucher
    buttonText: "Join Giveaway",
    buttonLink: "/en/giveaway"
  },
  {
    id: "static-8",
    title: "Extra Bonus Special",
    description: "Exclusive extra bonus for loyal customers",
    imageUrl: "/images/Nicebet_Extra_Bonus_Homepage_Banner_15_Sep_2025_Tablet_extra_bonus.webp", // Extra Bonus image
    buttonText: "Get Bonus",
    buttonLink: "/en/extra-bonus"
  }
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      
      // Sirf static promotions use karein, koi API call nahi
      const allPromotions = [...STATIC_PROMOTIONS];
      
      setPromotions(allPromotions);
    } catch (e: any) {
      console.error("Failed to load promotions:", e);
      // Error case mein bhi static promotions show karein
      setPromotions(STATIC_PROMOTIONS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Promotions</h1>
          <p className="text-muted-foreground">
            Check out our latest bonuses and special offers
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && promotions.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/60 bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">No active promotions at the moment</p>
          </div>
        )}

        {!loading && promotions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="rounded-xl border border-border bg-card overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 group"
              >
                {/* Rounded Box Image Container - Fixed 687x290 aspect ratio */}
                <div className="relative w-full overflow-hidden">
                  <div 
                    className="relative" 
                    style={{ 
                      width: '100%',
                      height: '0',
                      paddingBottom: '42.21%' // 290/687 * 100 = 42.21%
                    }}
                  >
                    {promo.imageUrl ? (
                      <>
                        {/* Rounded corners with overflow hidden */}
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={promo.imageUrl}
                            alt={promo.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={promo.id === "static-1"}
                          />
                        </div>
                        {/* Rounded border effect */}
                        <div className="absolute inset-0 rounded-t-xl border-2 border-border/50 pointer-events-none" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-6">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-foreground mb-2">{promo.title}</h3>
                          <p className="text-sm text-muted-foreground">No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Area with rounded bottom corners */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                      {promo.title}
                    </h3>
                    {promo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {promo.description}
                      </p>
                    )}
                  </div>

                  <Button className="w-full rounded-lg" asChild>
                    <Link href={promo.buttonLink || "#"}>
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
