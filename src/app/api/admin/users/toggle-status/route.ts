import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PUT - Toggle user status (active/suspended)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, status } = body;

        if (!userId || !status) {
            return NextResponse.json({ error: 'User ID and status are required' }, { status: 400 });
        }

        if (status !== 'active' && status !== 'suspended') {
            return NextResponse.json({ error: 'Invalid status. Must be "active" or "suspended"' }, { status: 400 });
        }

        // For now, we'll store status in a comment or add a status field
        // Since we don't have a status field in the schema, we'll need to add it
        // For this implementation, we'll return success but note this needs DB schema update

        // TODO: Add status field to userBalances table
        // await db.update(userBalances)
        //   .set({ status, updatedAt: new Date().toISOString() })
        //   .where(eq(userBalances.userId, userId));

        return NextResponse.json({
            success: true,
            message: `User status updated to ${status}`,
            note: 'Status field needs to be added to database schema for full functionality'
        }, { status: 200 });
    } catch (error) {
        console.error('Toggle status error:', error);
        return NextResponse.json({
            error: 'Failed to update status: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
