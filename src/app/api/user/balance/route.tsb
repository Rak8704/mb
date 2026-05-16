import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userBalances } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        let balance = await db.query.userBalances.findFirst({
            where: eq(userBalances.userId, userId),
        });

        if (!balance) {
            // Create default balance if not exists (Lazy creation)
            const now = new Date().toISOString();
            const newBalance = await db.insert(userBalances).values({
                userId,
                coins: 1000, // Welcome bonus
                role: 'admin', // Default to admin for dev
                createdAt: now,
                updatedAt: now,
            }).returning();

            balance = newBalance[0];
        }

        return NextResponse.json({ balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
