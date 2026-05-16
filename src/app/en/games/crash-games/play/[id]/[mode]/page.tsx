import { notFound } from "next/navigation";
import { GameLauncher } from "@/components/sections/game-launcher";

interface PageProps {
  params: Promise<{ id: string; mode: string }>;
}

export default async function CrashGamePlayerPage({ params }: PageProps) {
  const { id, mode } = await params;
  if (!id || !mode) return notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Crash Game</h1>
        <p className="text-muted-foreground mt-2">Game ID: {id}</p>
        <p className="text-muted-foreground">Mode: {mode}</p>
        <div className="mt-6">
          <GameLauncher title={`Crash Game #${id} (${mode})`} />
        </div>
      </div>
    </div>
  );
}