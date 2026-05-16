// This route is disabled - better-auth not configured
// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";
// export const { POST, GET } = toNextJsHandler(auth);

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not configured" }, { status: 501 });
}

export async function GET() {
  return NextResponse.json({ error: "Not configured" }, { status: 501 });
}