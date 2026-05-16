import { GameLauncher } from "@/components/sections/game-launcher";

export default function CrashGamesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Crash Games</h1>
        <p className="text-muted-foreground mt-2">
          Browse crash-style games. This is a placeholder page.
        </p>
        <div className="mt-6">
          <GameLauncher title="Crash Games Launcher" />
        </div>
      </div>
    </div>
  );
}