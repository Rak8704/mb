import { HeaderNavigation } from '@/components/sections/header-navigation';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import Footer from '@/components/sections/footer';
import { Bird } from 'lucide-react';
import { GamesNavigation } from '@/components/sections/games-navigation';

export default function CockfightPage() {
    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />
            <main className="container py-6">
                <GamesNavigation />
                <div className="flex items-center gap-3 mb-6">
                    <Bird className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Cockfight Arena</h1>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-4">
                        <Bird className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Live Matches</h2>
                    <p className="text-muted-foreground">There are no cockfight matches scheduled at the moment.</p>
                </div>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
