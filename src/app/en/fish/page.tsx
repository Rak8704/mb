import { HeaderNavigation } from '@/components/sections/header-navigation';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import Footer from '@/components/sections/footer';
import { Fish } from 'lucide-react';
import { GamesNavigation } from '@/components/sections/games-navigation';

export default function FishPage() {
    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />
            <main className="container py-6">
                <GamesNavigation />
                <div className="flex items-center gap-3 mb-6">
                    <Fish className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold">Fishing Games</h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Ocean King', 'Fishing War', 'Monster Awaken', 'Zombie Party'].map((game) => (
                        <div key={game} className="aspect-video bg-accent rounded-lg flex items-center justify-center border border-border hover:border-blue-500 cursor-pointer transition-colors">
                            <span className="font-bold">{game}</span>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
