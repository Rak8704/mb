"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Puzzle, Heart, LayoutGrid, Spade, Trophy, Gamepad2, Bird, Club, Fish, Ticket } from 'lucide-react';

export const GamesNavigation = () => {
    const pathname = usePathname();
    const [activeId, setActiveId] = useState('sports');

    const items = [
        { id: 'lobby', label: 'Games lobby', icon: Puzzle, href: '/' },
        { id: 'sports', label: 'Sports', icon: Trophy, href: '/en/sports' },
        { id: 'favorites', label: 'Favorites', icon: Heart, href: '/en/favorites' },
        { id: 'slots', label: 'Slots', icon: LayoutGrid, href: '/en/slots' },
        { id: 'live', label: 'Live', icon: Spade, href: '/en/live' },
        { id: 'esports', label: 'E-sports', icon: Gamepad2, href: '/en/esports' },
        { id: 'cockfight', label: 'Cockfight', icon: Bird, href: '/en/cockfight' },
        { id: 'poker', label: 'Poker', icon: Club, href: '/en/poker' },
        { id: 'fish', label: 'Fish', icon: Fish, href: '/en/fish' },
        { id: 'lottery', label: 'Lottery', icon: Ticket, href: '/en/lottery' },
    ];

    useEffect(() => {
        // Determine active ID based on pathname
        if (pathname === '/') {
            setActiveId('lobby');
        } else if (pathname === '/en/sports') {
            setActiveId('sports');
        } else {
            const activeItem = items.find(item => item.href !== '/' && pathname.startsWith(item.href));
            if (activeItem) {
                setActiveId(activeItem.id);
            }
        }
    }, [pathname]);

    return (
        <div className="mb-6 -mx-6 px-6 overflow-x-auto no-scrollbar py-2 select-none sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
            <div className="flex items-center gap-2 min-w-max">
                {items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 group relative overflow-hidden
                ${isActive
                                    ? 'bg-gradient-to-b from-[#ffd700] to-[#b8860b] text-black shadow-[0_4px_12px_rgba(184,134,11,0.4)] border border-[#ffd700] scale-105 font-bold'
                                    : 'bg-accent/50 text-[#888] hover:text-white hover:bg-accent border border-transparent font-medium'
                                }
              `}
                        >
                            {/* Shine effect for active item */}
                            {isActive && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                </div>
                            )}

                            <item.icon
                                className={`w-5 h-5 ${isActive ? 'text-black fill-black/10' : 'group-hover:text-white transition-colors'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="text-base whitespace-nowrap font-display">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
