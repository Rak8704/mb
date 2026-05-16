import { HeaderNavigation } from '@/components/sections/header-navigation';
import { MobileBottomNav } from '@/components/sections/mobile-bottom-nav';
import Footer from '@/components/sections/footer';
import SlotsInterface from '@/components/sections/slots-interface';
import { GamesNavigation } from '@/components/sections/games-navigation';

export default function SlotsPage() {
    return (
        <div className="min-h-screen bg-background">
            <HeaderNavigation />
            <main className="container py-6">
                <GamesNavigation />
                <SlotsInterface />
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
