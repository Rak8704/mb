import { NextResponse } from "next/server";

const mockGames = [
  { id: "g1", title: "Aviator", provider: "spribe", category: "crash" },
  { id: "g2", title: "Spaceman", provider: "pragmatic", category: "crash" },
  { id: "g3", title: "Roulette", provider: "evolution", category: "casino" },
  { id: "g4", title: "Blackjack", provider: "evolution", category: "casino" },
  { id: "g5", title: "Football Live", provider: "betradar", category: "sports" },
  { id: "g6", title: "Basketball Live", provider: "betradar", category: "live" },
  { id: "g7", title: "Crash X", provider: "generic", category: "crash" },
  { id: "g8", title: "Slots Bonanza", provider: "pragmatic", category: "casino" },
  { id: "g9", title: "Virtual Tennis", provider: "betradar", category: "sports" },
];

// Use mutable array for mock CRUD
let games = [...mockGames];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));

  const result = category && category !== "games"
    ? games.filter((g) => g.category === category)
    : games;

  return NextResponse.json({ games: result });
}

export async function POST(req: Request) {
  await new Promise((r) => setTimeout(r, 250));
  const body = await req.json().catch(() => ({}));
  const { title, provider = "generic", category = "casino" } = body || {};
  const nextNum = games.length + 1;
  const id = `g${nextNum}`;
  const game = { id, title: title || `Game ${nextNum}`, provider, category };
  games.push(game);
  return NextResponse.json({ game });
}

export async function PUT(req: Request) {
  await new Promise((r) => setTimeout(r, 250));
  const body = await req.json().catch(() => ({}));
  const { id, ...updates } = body || {};
  const idx = games.findIndex((g) => g.id === id);
  if (idx === -1) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  games[idx] = { ...games[idx], ...updates };
  return NextResponse.json({ game: games[idx] });
}

export async function DELETE(req: Request) {
  await new Promise((r) => setTimeout(r, 250));
  const body = await req.json().catch(() => ({}));
  const { id } = body || {};
  const before = games.length;
  games = games.filter((g) => g.id !== id);
  const ok = games.length < before;
  return NextResponse.json({ ok });
}