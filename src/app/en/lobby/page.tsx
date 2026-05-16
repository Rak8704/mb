import { HeaderNavigation } from '@/components/sections/header-navigation';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import Footer from '@/components/sections/footer';
import { Card } from '@/components/ui/card';
import { Puzzle } from 'lucide-react';
import { GamesNavigation } from '@/components/sections/games-navigation';

export default function LobbyPage() {
    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />
            <main className="container py-6">
                <GamesNavigation />
                <div className="flex items-center gap-3 mb-6">
                    <Puzzle className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Games Lobby</h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Placeholder for game grid */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Card key={i} className="aspect-[3/4] bg-card border-border hover:border-primary transition-colors cursor-pointer flex items-center justify-center group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="font-bold text-white">Game {i + 1}</span>
                            </div>
                            <span className="text-muted-foreground">Game {i + 1}</span>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
