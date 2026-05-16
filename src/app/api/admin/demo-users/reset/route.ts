import { NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers, demoBets, demoTrades } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST - Reset demo user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const now = new Date().toISOString();

        // Reset coins to 10000
        await db.update(demoUsers)
            .set({
                coins: 10000,
                lastResetAt: now
            })
            .where(eq(demoUsers.id, userId));

        // Clear betting history
        await db.delete(demoBets).where(eq(demoBets.demoUserId, userId));

        // Clear trading history
        await db.delete(demoTrades).where(eq(demoTrades.demoUserId, userId));

        return NextResponse.json({
            success: true,
            message: 'Demo user reset successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Reset demo user error:', error);
        return NextResponse.json({
            error: 'Failed to reset demo user: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
