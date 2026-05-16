'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { HeaderNavigation } from '@/components/sections/header-navigation';
import Footer from '@/components/sections/footer';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import { categories, type Game, type CategorySection } from '@/components/sections/lobby-content';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id as string;

    const category = categories.find(cat => cat.id === categoryId);

    if (!category) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                    <Button onClick={() => router.push('/')}>Go Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />

            <main className="container py-6">
                {/* Back Button and Title */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                        <h1 className="text-2xl font-bold">{category.title}</h1>
                        <span className="text-sm text-muted-foreground">({category.count} games)</span>
                    </div>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {category.games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </main>

            <Footer />
            <MobileBottomNav />
            <div className="h-20 md:hidden" />
        </div>
    );
}

const GameCard = ({ game }: { game: Game }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card aspect-[3/4]">
                <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Automatic Flash/Shine Animation Effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div
                        className="absolute top-0 left-0 w-full h-full animate-card-shine"
                        style={{
                            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Provider Logo / Name */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                    {game.provider && (
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider drop-shadow-md">
                            {game.provider}
                        </span>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10"
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
                </button>

                {/* Tag (e.g. 10000X) */}
                {game.tag && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                        {game.tag}
                    </div>
                )}
            </div>

            {/* Game Name */}
            <div className="mt-1.5 text-center">
                <h3 className="text-xs font-medium text-foreground line-clamp-1 leading-tight">
                    {game.name}
                </h3>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes card-shine {
                    0% {
                        transform: translateX(-100%) skewX(-15deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-15deg);
                    }
                }
                .animate-card-shine {
                    animation: card-shine 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
