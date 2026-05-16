"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Game {
  id: string;
  name: string;
  image: string;
  href: string;
}

const popularGames: Game[] = [
  { id: '1', name: 'Juicy Fruits', image: 'https://v3.fal.media/files/tiger/US1z1oBBnUZGRKtXXb86w_output.png', href: '/en/games/casino' },
  { id: '2', name: 'Koi Gate', image: 'https://v3.fal.media/files/koala/0AnBO-Dx8RCvMj5vssF9v_output.png', href: '/en/games/casino' },
  { id: '3', name: 'Lucky 6 Roulette', image: 'https://v3.fal.media/files/elephant/ILkEO6gBUSCsrh9b-bBtH_output.png', href: '/en/games/casino' },
  { id: '4', name: 'GU GU GU', image: 'https://v3.fal.media/files/penguin/cWeb1Nu0nz79XOQzC1lRV_output.png', href: '/en/games/casino' },
  { id: '5', name: 'Fortune Tiger', image: 'https://v3.fal.media/files/monkey/Dll0mczrVKZYCTOigIoLL_output.png', href: '/en/games/casino' },
  { id: '6', name: "Panda's Fortune 2", image: 'https://v3.fal.media/files/koala/VeCElJ_VB0Ku6Xmo8Vz4h_output.png', href: '/en/games/casino' },
  { id: '7', name: 'Fa Cai Shen', image: 'https://v3.fal.media/files/kangaroo/Ok1Pi6_uTGoThL7eivq90_output.png', href: '/en/games/casino' },
  { id: '8', name: 'Turkish Roulette 6', image: 'https://v3.fal.media/files/rabbit/aLEXMOKgAiZv66Qq8zAVc_output.png', href: '/en/games/casino' },
  { id: '9', name: 'Fire Chip 2', image: 'https://v3.fal.media/files/penguin/VTYYyOoJHSasqapk8hPr3_output.png', href: '/en/games/casino' },
];

export default function PopularGames() {
  const [jackpot, setJackpot] = useState(115752746.45);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Jackpot animation - increments randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.random() * 0.5);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const toggleLike = (gameId: string) => {
    setLikes(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Jackpot Banner */}
        <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 p-6 md:p-8">
          <div className="relative z-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">⚡</span>
              <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg tracking-wide">
                JACKPOT
              </h2>
              <span className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">⚡</span>
            </div>
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg px-6 py-3 border-4 border-yellow-300 shadow-2xl">
              <div className="text-3xl md:text-5xl font-black text-white tracking-wider drop-shadow-xl">
                {jackpot.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-2 left-4 text-6xl animate-bounce">💰</div>
            <div className="absolute top-4 right-8 text-5xl animate-pulse">🎰</div>
            <div className="absolute bottom-2 left-12 text-4xl animate-bounce delay-150">💎</div>
            <div className="absolute bottom-4 right-4 text-5xl animate-pulse delay-300">🏆</div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">জনপ্রিয়</h3>
          </div>
          <Link 
            href="/en/games/casino"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View All →
          </Link>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularGames.map((game) => (
            <Link key={game.id} href={game.href}>
              <Card className="group relative overflow-hidden bg-card border-border hover:border-primary transition-all hover:scale-105 hover:shadow-lg cursor-pointer">
                <CardContent className="p-0">
                  {/* Game Image */}
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-lg">PLAY NOW</span>
                    </div>

                    {/* Like Button (Top Left) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(game.id);
                      }}
                      className={`absolute top-2 left-2 rounded-full p-2 transition-all z-10 ${
                        likes[game.id]
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      aria-label="Like game"
                    >
                      <ThumbsUp className="h-4 w-4" fill={likes[game.id] ? 'currentColor' : 'none'} />
                    </button>

                    {/* Favorite Button (Top Right) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(game.id);
                      }}
                      className={`absolute top-2 right-2 rounded-full p-2 transition-all z-10 ${
                        favorites[game.id]
                          ? 'bg-yellow-500 text-white'
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      aria-label="Favorite game"
                    >
                      <Star className="h-4 w-4" fill={favorites[game.id] ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Game Name */}
                  <div className="p-3 bg-card">
                    <h4 className="text-sm font-semibold text-foreground text-center line-clamp-1">
                      {game.name}
                    </h4>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}