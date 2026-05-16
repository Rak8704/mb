import { GameLauncher } from "@/components/sections/game-launcher";

export default function LiveCasinoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Live Casino</h1>
        <p className="text-muted-foreground mt-2">
          Play with live dealers. This is a placeholder page.
        </p>
        <div className="mt-6">
          <GameLauncher title="Live Casino Launcher" />
        </div>
      </div>
    </div>
  );
}