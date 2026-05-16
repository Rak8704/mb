import { NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers, demoBets, demoTrades } from '@/db/schema';
import { eq } from 'drizzle-orm';

// DELETE - Delete demo user
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const userIdNum = parseInt(userId);

        // Delete related data
        await db.delete(demoBets).where(eq(demoBets.demoUserId, userIdNum));
        await db.delete(demoTrades).where(eq(demoTrades.demoUserId, userIdNum));
        await db.delete(demoUsers).where(eq(demoUsers.id, userIdNum));

        return NextResponse.json({
            success: true,
            message: 'Demo user deleted successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Delete demo user error:', error);
        return NextResponse.json({
            error: 'Failed to delete demo user: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
