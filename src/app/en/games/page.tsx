import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { GameLauncher } from "@/components/sections/game-launcher";

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-2 text-foreground">Games</h1>
        <p className="text-muted-foreground">Browse casino, live casino, and crash games. Coming soon.</p>
        <div className="mt-6">
          <GameLauncher title="Games Launcher" />
        </div>
      </main>
      <Footer />
    </div>
  );
}