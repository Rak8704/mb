import { NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers, demoBets, demoTrades } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST - Reset all demo users
export async function POST() {
    try {
        const now = new Date().toISOString();

        // Get all demo users
        const users = await db.select().from(demoUsers);

        // Reset each user
        for (const user of users) {
            await db.update(demoUsers)
                .set({
                    coins: 10000,
                    lastResetAt: now
                })
                .where(eq(demoUsers.id, user.id));

            // Clear betting history
            await db.delete(demoBets).where(eq(demoBets.demoUserId, user.id));

            // Clear trading history
            await db.delete(demoTrades).where(eq(demoTrades.demoUserId, user.id));
        }

        return NextResponse.json({
            success: true,
            message: `Reset ${users.length} demo users successfully`,
            count: users.length
        }, { status: 200 });
    } catch (error) {
        console.error('Reset all demo users error:', error);
        return NextResponse.json({
            error: 'Failed to reset all demo users: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
