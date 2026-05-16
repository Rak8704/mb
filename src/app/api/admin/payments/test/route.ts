import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { provider } = await req.json();
  const start = Date.now();
  // Simulate a provider ping
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
  const latencyMs = Date.now() - start;
  return NextResponse.json({ ok: true, provider, latencyMs });
}