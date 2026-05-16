"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Game } from './lobby-content';

interface OptimizedGameCardProps {
    game: Game;
    sectionId: string;
}

/**
 * Optimized Game Card with instant authentication check
 * Uses localStorage for immediate redirect without session loading delay
 */
export const OptimizedGameCard = ({ game, sectionId }: OptimizedGameCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    // Instant authentication check using localStorage
    const isAuthenticated = () => {
        if (typeof window === 'undefined') return false;
        const token = localStorage.getItem('bearer_token');
        return !!token;
    };

    const handleGameClick = () => {
        // Instant check - no API call, no delay
        if (!isAuthenticated()) {
            toast.info("Please login to play games");
            router.push('/login');
            return;
        }

        // User is logged in
        toast.success(`Launching ${game.name}...`);
        // TODO: Add game launch logic
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated()) {
            toast.info("Please login to add favorites");
            router.push('/login');
            return;
        }

        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    };

    return (
        <div
            className="relative group flex-shrink-0 w-28 md:w-32 cursor-pointer"
            onClick={handleGameClick}
        >
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
                    onClick={handleFavoriteClick}
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
        </div>
    );
};
