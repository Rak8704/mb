import { NextResponse } from "next/server";
import { db } from "@/db";
import { userBalances } from "@/db/schema";

export async function GET() {
    try {
        // Update all users to have role 'admin'
        await db.update(userBalances).set({ role: 'admin' });
        return NextResponse.json({ message: "All users promoted to admin" });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
