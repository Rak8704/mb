import { HeaderNavigation } from '@/components/sections/header-navigation';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import Footer from '@/components/sections/footer';
import { Heart } from 'lucide-react';
import { GamesNavigation } from '@/components/sections/games-navigation';

export default function FavoritesPage() {
    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />
            <main className="container py-6">
                <GamesNavigation />
                <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-bold">My Favorites</h1>
                </div>
                <div className="text-center py-20 text-muted-foreground">
                    <p>You haven't added any games to your favorites yet.</p>
                </div>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
