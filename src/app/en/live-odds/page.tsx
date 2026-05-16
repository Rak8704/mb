import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import OddsWidget from "@/components/sections/odds-widget";

export default function LiveOddsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <HeaderNavigation />
            <main className="flex-grow container py-8 max-w-[1400px]">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Live Odds</h1>
                    <p className="text-muted-foreground">
                        Real-time odds from multiple bookmakers across different sports
                    </p>
                </div>
                <OddsWidget />
            </main>
            <Footer />
        </div>
    );
}
