"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Zap, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PROMOTIONS = [
    {
        id: 1,
        title: "Welcome Bonus",
        description: "Get 100% match up to $500 on your first deposit",
        icon: Gift,
        color: "from-pink-500 to-rose-500",
        link: "/register"
    },
    {
        id: 2,
        title: "Live Betting Boost",
        description: "Extra 10% winnings on all live sports bets today",
        icon: Zap,
        color: "from-amber-500 to-orange-500",
        link: "/en/live"
    },
    {
        id: 3,
        title: "Tournament Series",
        description: "Join the weekly tournament and win big prizes",
        icon: Trophy,
        color: "from-blue-500 to-cyan-500",
        link: "/en/sports"
    }
];

export default function Promotions() {
    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Gift className="text-primary h-6 w-6" />
                    Active Promotions
                </h2>
                <Link href="/promotions" className="text-primary hover:underline text-sm font-medium">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROMOTIONS.map((promo, index) => (
                    <motion.div
                        key={promo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="overflow-hidden border-none shadow-lg h-full">
                            <div className={`h-2 bg-gradient-to-r ${promo.color}`} />
                            <div className="p-6">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${promo.color} flex items-center justify-center mb-4 text-white shadow-md`}>
                                    <promo.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {promo.description}
                                </p>
                                <Button variant="outline" className="w-full group" asChild>
                                    <Link href={promo.link}>
                                        Claim Offer
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
