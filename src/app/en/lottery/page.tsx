import { HeaderNavigation } from "@/components/sections/header-navigation";
import Footer from "@/components/sections/footer";
import { GameLauncher } from "@/components/sections/game-launcher";

export default function LotteryPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-2 text-foreground">Lottery</h1>
        <p className="text-muted-foreground">Lottery draws and results will be shown here. Coming soon.</p>
        <div className="mt-6">
          <GameLauncher title="Lottery Launcher" />
        </div>
      </main>
      <Footer />
    </div>
  );
}