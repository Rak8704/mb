import { HeaderNavigation } from '@/components/sections/header-navigation';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import Footer from '@/components/sections/footer';
import { Club } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GamesNavigation } from '@/components/sections/games-navigation';

export default function PokerPage() {
    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />
            <main className="container py-6">
                <GamesNavigation />
                <div className="flex items-center gap-3 mb-6">
                    <Club className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Poker Room</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Texas Hold\'em', 'Omaha', 'Seven Card Stud'].map((game) => (
                        <Card key={game} className="p-6 bg-card border-border hover:border-primary cursor-pointer transition-colors">
                            <h3 className="text-xl font-bold mb-2">{game}</h3>
                            <p className="text-muted-foreground mb-4">Join a table and play against others.</p>
                            <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-bold">Play Now</button>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
